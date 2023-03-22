import "./SwapBody.scss";
import NFTCard from "../NFTCard/NFTCard";
import { useEffect } from "react";

function SwapBody({ nfts, address, setSecondaryWallet, selectedNFTs, setSelectedNFTs, pendingSwap }) {
  useEffect(() => {
    if (pendingSwap.data) {
      const swapData = JSON.parse(pendingSwap.data.metadata);
      console.log(swapData);

      if (address === pendingSwap.data.init_address) {
        setSelectedNFTs(swapData.init.tokens);
      } else {
        setSelectedNFTs(swapData.accept.tokens);
      }
    }
  }, [address]);

  const handleClick = async (nft) => {
    const element = document.getElementById(`${nft.tokenUri.raw}`);

    if (!nft.pending) {
      element.classList.toggle("checked");

      const id = nft.tokenId;
      const type = nft.tokenType;
      const address = nft.contract.address;

      if (!element.classList.contains("checked")) {
        const filtered = selectedNFTs.filter((selectedNFT) => selectedNFT.id !== id);
        setSelectedNFTs(filtered);
      } else {
        setSelectedNFTs([...selectedNFTs, { id, type, address }]);
      }
    }
  };

  const handleChange = (e) => {
    setSecondaryWallet(e.target.value);
  };

  const renderedCards = nfts.map((nft) => (
    <NFTCard
      id={`${nft.tokenUri.raw}`}
      onClick={() => {
        handleClick(nft);
      }}
      className={nft.pending ? "darken" : ""}
      key={nft.tokenUri.raw}
      nft={nft}
    />
  ));

  return (
    <div className="newswap-container">
      <div className="wallet-search">
        <input type="text" placeholder="wallet" value={address} onChange={handleChange} />
      </div>

      <div className="nft-container">{renderedCards}</div>
    </div>
  );
}

export default SwapBody;
