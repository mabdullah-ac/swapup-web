import "./Swap.scss";
import { useLayoutEffect, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAppContext from "../../hooks/use-app-context";
import NFTContainer from "../../components/NFTContainer/NFTContainer";
import SwapCard from "../../components/SwapCard/SwapCard";
import SwapHeader from "../../components/SwapHeader/SwapHeader";
import SwapSearch from "../../components/SwapSearch/SwapSearch";
import api from "../../utils/api";
import metamask from "../../utils/metamask";
import CheckedIcon from "../../assets/checked-icon.png";
import UncheckedIcon from "../../assets/un-checked.png";
import AgreementImg from "../../assets/agreement.png";
import ui from "../../utils/ui";

function SwapPage() {
  const { connectedWallet } = useAppContext();
  const [secondaryWallet, setSecondaryWallet] = useState("");
  const [primarySelected, setPrimarySelected] = useState([]);
  const [secondarySelected, setSecondarySelected] = useState([]);
  const [primaryPending, setPrimaryPending] = useState(null);
  const [secondaryPending, setSecondaryPending] = useState(null);
  const [isAcceptor, setIsAcceptor] = useState(false);
  const [isOfferUnedited, setIsOfferUnedited] = useState(true);
  const [existingSwap, setExistingSwap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const initiatorTokens = useRef();
  const acceptorTokens = useRef();

  const params = useParams();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    setSecondaryWallet("");
    setSecondarySelected([]);
    setPrimarySelected([]);

    // eslint-disable-next-line
  }, [params.swapId]);

  useEffect(() => {
    const fetchPending = async () => {
      if (!params.swapId) {
        setIsLoading(true);
      }

      const pending = await api.getPendingSwapsForWallet(connectedWallet);

      if (pending.success) {
        setPrimaryPending(pending.data);
      }
      setIsLoading(false);
    };

    const fetchSwapData = async () => {
      const swapData = await api.getSwapDetails(params.swapId, connectedWallet);

      if (swapData.success) {
        const metadata = JSON.parse(swapData.data.metadata);
        swapData.data.metadata = metadata;

        setExistingSwap(swapData.data);

        const counterWallet =
          swapData.data.init_address === connectedWallet ? swapData.data.accept_address : swapData.data.init_address;

        setSecondaryWallet(counterWallet);

        initiatorTokens.current = metadata.init.tokens;
        acceptorTokens.current = metadata.accept.tokens;

        if (swapData.data.init_address === connectedWallet) {
          setPrimarySelected(metadata.init.tokens);
          setSecondarySelected(metadata.accept.tokens);
        } else {
          setPrimarySelected(metadata.accept.tokens);
          setSecondarySelected(metadata.init.tokens);
          setIsAcceptor(true);
        }
      }
    };

    if (connectedWallet) {
      fetchPending();
    }

    if (connectedWallet && params?.swapId) {
      fetchSwapData();
    }
  }, [connectedWallet, params.swapId]);

  useEffect(() => {
    const fetchPending = async () => {
      const pending = await api.getPendingSwapsForWallet(secondaryWallet);

      if (pending.success) {
        setSecondaryPending(pending.data);
      }
    };

    if (secondaryWallet.length === 42) {
      fetchPending();
    }
  }, [secondaryWallet]);

  useEffect(() => {
    if (connectedWallet && isAcceptor) {
      if (
        checkOfferUnedited(acceptorTokens.current, primarySelected) &&
        checkOfferUnedited(initiatorTokens.current, secondarySelected)
      ) {
        setIsOfferUnedited(true);
      } else {
        setIsOfferUnedited(false);
      }
    }

    // eslint-disable-next-line
  }, [primarySelected, secondarySelected]);

  const checkOfferUnedited = (originalOffer, currentOffer) => {
    let status = JSON.stringify(originalOffer) === JSON.stringify(currentOffer);

    return status;
  };

  const handleOfferClick = async () => {
    //make sure atleast one nft is selected on either side
    if (primarySelected.length === 0 || secondarySelected.length === 0) {
      ui.alert("Please select at least one item from each wallet");
      return;
    }

    const swap = {
      init_address: null,
      accept_address: null,
      init_sign: null,
      accept_sign: null,
      metadata: {
        init: {
          tokens: primarySelected,
        },
        accept: {
          tokens: secondarySelected,
        },
      },
    };

    swap.init_address = connectedWallet;
    if (existingSwap) {
      //if init address is the same for existing swap then it means the initiator has opened the swap again
      swap.id = existingSwap.id;
      if (existingSwap.init_address === swap.init_address) swap.accept_address = existingSwap.accept_address;
      else swap.accept_address = existingSwap.init_address;
    } else {
      //this is a new swap, so fetch the accept address from text box
      swap.accept_address = secondaryWallet;
    }

    let signature = await metamask.getUserSignature(swap);
    if (!signature) {
      ui.alert("Not signed");
      return;
    }

    swap.init_sign = signature;

    let approval = await metamask.getUserApproval(swap, true);
    if (!approval) {
      ui.alert("Not approved");
      return;
    }

    let res = null;
    if (swap.id) res = await api.updateSwapOffer(swap);
    else res = await api.createSwapOffer(swap);

    if (res.success) {
      ui.alert("Offer Successfully Sent");
      navigate("/");
    } else {
      ui.alert("an error occurred while sending the offer");
    }
  };

  const handleAcceptClick = async () => {
    let approve = await metamask.getUserApproval(existingSwap, false);

    if (!approve) return;

    //initiate the transfers
    let res = await metamask.triggerTransfer(existingSwap);

    if (!res) {
      insertUrlsAndNamesInMetadata("init");
      insertUrlsAndNamesInMetadata("accept");
      let res2 = await api.updateSwapStatus({
        id: existingSwap.id,
        status: 4,
        txn: res?.hash,
        notes: res?.notes,
        metadata: JSON.stringify(existingSwap.metadata),
      });
      if (res2.success) {
        ui.alert("Swap Failed");
        navigate("/");
      } else {
        ui.alert(`An error occurred while accepting the swap. Blockchain status 4. Contact the admin`);
      }
      return;
    }

    let stts = 2; //keep default status to pending
    if (res.status === 0) stts = 4; //Failed
    //update the database
    insertUrlsAndNamesInMetadata("init");
    insertUrlsAndNamesInMetadata("accept");
    let res2 = await api.updateSwapStatus({
      id: existingSwap.id,
      status: stts,
      txn: res.hash,
      notes: res.notes,
      metadata: JSON.stringify(existingSwap.metadata),
      timestamp: res.timestamp,
    });
    if (res2.success) {
      ui.alert("Swap Completed");
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } else {
      ui.alert(`An error occurred while accepting the swap. Blockchain status ${stts}. Contact the admin`);
    }
  };

  const handleDeclineClick = async () => {
    insertUrlsAndNamesInMetadata("init");
    insertUrlsAndNamesInMetadata("accept");
    let res = await api.updateSwapStatus({
      id: existingSwap.id,
      status: 3,
      txn: "",
      notes: "",
      metadata: JSON.stringify(existingSwap.metadata),
    });
    if (res.success) {
      ui.alert("Offer Rejected");
      navigate("/");
    } else {
      ui.alert("an error occurred while rejecting the swap");
    }
  };

  const insertUrlsAndNamesInMetadata = (user) => {
    const temp = { ...existingSwap };

    temp.metadata[user].tokens.forEach((tkn) => {
      const img = document.getElementById(`${tkn.address}_${tkn.id}`).childNodes[0];
      const url = img.src;
      const name = img.alt;
      tkn.image = url;
      tkn.name = name;
    });

    setExistingSwap(temp);
  };

  return (
    <>
      <div className="swap-container">
        <div className="swapcards-container">
          <SwapCard>
            {!params.swapId && <SwapHeader icon={UncheckedIcon} justify={"flex-end"} rotate={"180deg"} />}
            {params.swapId && !isAcceptor && <SwapHeader icon={CheckedIcon} justify={"flex-end"} rotate={"180deg"} />}
            {params.swapId && isAcceptor && <SwapHeader icon={UncheckedIcon} justify={"flex-end"} rotate={"180deg"} />}

            <SwapSearch wallet={connectedWallet} disabled={true} />
            {connectedWallet && primaryPending && (
              <NFTContainer
                wallet={connectedWallet}
                pending={primaryPending}
                selectedNFTs={primarySelected}
                setSelectedNFTs={setPrimarySelected}
                isAcceptor={isAcceptor}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                rerender={true}
              />
            )}
          </SwapCard>

          <div className="agreement-img">
            <img src={AgreementImg} alt="" />
          </div>

          <SwapCard>
            {!params.swapId && <SwapHeader icon={UncheckedIcon} order={-1} />}
            {params.swapId && !isAcceptor && <SwapHeader icon={UncheckedIcon} order={-1} />}
            {params.swapId && isAcceptor && isOfferUnedited && <SwapHeader icon={CheckedIcon} order={-1} />}
            {params.swapId && isAcceptor && !isOfferUnedited && <SwapHeader icon={UncheckedIcon} order={-1} />}

            <SwapSearch
              wallet={secondaryWallet}
              setWallet={setSecondaryWallet}
              disabled={params.swapId ? true : false}
            />
            {secondaryWallet.length === 42 && secondaryPending && (
              <NFTContainer
                wallet={secondaryWallet}
                pending={secondaryPending}
                selectedNFTs={secondarySelected}
                setSelectedNFTs={setSecondarySelected}
                isAcceptor={isAcceptor}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
          </SwapCard>
        </div>

        {primarySelected.length > 0 && secondarySelected.length > 0 && !isLoading && (
          <div className="buttons-container">
            {!params.swapId && <span onClick={handleOfferClick}>Send Offer</span>}
            {params.swapId && isAcceptor && isOfferUnedited && !isLoading && (
              <>
                <span onClick={handleAcceptClick}>Accept</span>
                <span onClick={handleDeclineClick}>Decline</span>
              </>
            )}
            {params.swapId && isAcceptor && !isOfferUnedited && <span onClick={handleOfferClick}>Counter Offer</span>}
          </div>
        )}
      </div>
    </>
  );
}

export default SwapPage;
