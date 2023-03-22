import "./Swap.scss";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAppContext from "../../hooks/use-app-context";
import NFTContainer from "../../components/NFTContainer/NFTContainer";
import SwapCard from "../../components/SwapCard/SwapCard";
import SwapHeader from "../../components/SwapHeader/SwapHeader";
import SwapSearch from "../../components/SwapSearch/SwapSearch";
import api from "../../utils/api";
import metamask from "../../utils/metamask";

function SwapPage() {
  const { connectedWallet } = useAppContext();
  const [secondaryWallet, setSecondaryWallet] = useState("");
  const [primarySelected, setPrimarySelected] = useState([]);
  const [secondarySelected, setSecondarySelected] = useState([]);

  const params = useParams();
  const navigate = useNavigate();

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
      return;
    }

    swap.init_sign = signature;

    let approval = await metamask.getUserApproval(swap, true);
    if (!approval) {
      alert("Not approved");
      return;
    }

    let res = null;
    // if (swap.id) res = await api.updateSwapOffer(swap);
    res = await api.createSwapOffer(swap);

    if (res.success) {
      alert("Offer Successfully Sent");
      navigate("/");
    } else {
      alert("an error occurred while sending the offer");
    }
  };

  return (
    <>
      <div className="swap-container">
        <div className="swapcards-container">
          <SwapCard>
            <SwapHeader />
            <SwapSearch wallet={connectedWallet} disabled={true} />
            {connectedWallet && <NFTContainer wallet={connectedWallet} selectedNFTs={primarySelected} setSelectedNFTs={setPrimarySelected} />}
          </SwapCard>

          <SwapCard>
            <SwapHeader />
            <SwapSearch wallet={secondaryWallet} setWallet={setSecondaryWallet} disabled={params.swapId ? true : false} />
            {secondaryWallet.length === 42 && <NFTContainer wallet={secondaryWallet} selectedNFTs={secondarySelected} setSelectedNFTs={setSecondarySelected} />}
          </SwapCard>
        </div>

        {primarySelected.length > 0 && secondarySelected.length > 0 && <div className="buttons-container">{!params.swapId && <span onClick={handleSendClick}>Send Offer</span>}</div>}
      </div>
    </>
  );
}

export default SwapPage;
