import "./Swap.scss";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAppContext from "../../hooks/use-app-context";
import SwapCard from "../../components/SwapCard/SwapCard";
import SwapHeader from "../../components/SwapHeader/SwapHeader";
import SwapBody from "../../components/SwapBody/SwapBody";
import api from "../../utils/api";
import metamask from "../../utils/metamask";

function SwapPage() {
  const { connectedWallet } = useAppContext();
  const [secondaryWallet, setSecondaryWallet] = useState("");
  const [primaryNFTs, setPrimaryNFTs] = useState([]);
  const [secondaryNFTs, setSecondaryNFTs] = useState([]);
  const [primarySelected, setPrimarySelected] = useState([]);
  const [secondarySelected, setSecondarySelected] = useState([]);
  const [pendingSwap, setPendingSwap] = useState({});

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    checkQueryParams();
    setPrimaryData();
  }, [connectedWallet]);

  useEffect(() => {
    setSecondaryData();
  }, [secondaryWallet]);

  const checkQueryParams = async () => {
    if (params.swapId && connectedWallet !== "0x") {
      const swapData = await api.getSwapDetails(params.swapId, connectedWallet);
      if (swapData.success) {
        const counterWallet = connectedWallet === swapData.data.init_address ? swapData.data.accept_address : swapData.data.init_address;
        setSecondaryWallet(counterWallet);
        setPendingSwap(swapData);
      }
    }
  };

  const setPrimaryData = async () => {
    if (connectedWallet !== "0x") {
      const response = await fetchData(connectedWallet);
      setPrimaryNFTs(response);
    }
  };

  const setSecondaryData = async () => {
    if (secondaryWallet !== "0x" && secondaryWallet.length === 42) {
      const response = await fetchData(secondaryWallet);
      setSecondaryNFTs(response);
    }
  };

  const fetchData = async (wallet) => {
    const response = await api.getNftsForWallet(wallet);
    let pending = await api.getPendingSwapsForWallet(wallet);

    pending = pending.data.map((p) => ({
      id: p.id,
      metadata: JSON.parse(p.metadata),
    }));

    response.forEach((el) => {
      el.pending = isPartOfPendingSwap(el.tokenId, el.contract.address, pending);
    });

    return response;
  };

  const isPartOfPendingSwap = (tokenId, tokenAddress, pending) => {
    let found = false;
    pending.forEach((swap) => {
      //swap.metadata = JSON.parse(swap.metadata);
      let obj1 = swap.metadata.init.tokens.find((t) => t.id === tokenId && t.address === tokenAddress);
      let obj2 = swap.metadata.accept.tokens.find((t) => t.id === tokenId && t.address === tokenAddress);
      if (obj1 || obj2) found = true;
    });

    return found;
  };

  const handleSendClick = async () => {
    //make sure atleast one nft is selected on either side
    if (primarySelected.length === 0 || secondarySelected.length === 0) {
      alert("Please select at least one item from each wallet");
      return;
    }

    const swap = {
      init_address: connectedWallet,
      accept_address: secondaryWallet,
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

    let signature = await metamask.getUserSignature(swap);
    if (!signature) {
      alert("Not signed");
      // ui.showloadingScreen(false);
      // ui.nftChecked();
      return;
    }

    swap.init_sign = signature;

    let approval = await metamask.getUserApproval(swap, true);
    if (!approval) {
      alert("Not approved");
      // ui.nftChecked();
      return;
    }

    let res = null;
    // if (swap.id) res = await api.updateSwapOffer(swap);
    res = await api.createSwapOffer(swap);

    if (res.success) {
      alert("Offer Successfully Sent");
      navigate("/");

      // ui.alert("Offer Successfully Sent");
      // ui.goToAppHome();
      // ui.setOfferState("offer_sent");
    } else {
      alert("an error occurred while sending the offer");

      // ui.alert("an error occurred while sending the offer");
    }
  };

  return (
    <>
      <div className="swap-container">
        <div className="swapcards-container">
          <SwapCard>
            <SwapHeader />
            <SwapBody nfts={primaryNFTs} address={connectedWallet} selectedNFTs={primarySelected} setSelectedNFTs={setPrimarySelected} pendingSwap={pendingSwap} />
          </SwapCard>

          <SwapCard>
            <SwapHeader />
            <SwapBody nfts={secondaryNFTs} address={secondaryWallet} setSecondaryWallet={setSecondaryWallet} selectedNFTs={secondarySelected} setSelectedNFTs={setSecondarySelected} pendingSwap={pendingSwap} />
          </SwapCard>
        </div>

        {primarySelected.length > 0 && secondarySelected.length > 0 && <div className="buttons-container">{!params.swapId && <span onClick={handleSendClick}>Send Offer</span>}</div>}
      </div>
    </>
  );
}

export default SwapPage;
