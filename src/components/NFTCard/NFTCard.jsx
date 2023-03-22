import "./NFTCard.scss";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function NFTCard({ nft, selectedNFTs, setSelectedNFTs }) {
  const [isSelected, setIsSelected] = useState(false);

  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/swap") {
      if (isSelected) {
        const id = nft.tokenId;
        const type = nft.tokenType;
        const address = nft.contract.address;

        setSelectedNFTs([...selectedNFTs, { id, type, address }]);
      } else {
        const filtered = selectedNFTs.filter((selectedNFT) => selectedNFT.id !== nft.tokenId);
        setSelectedNFTs(filtered);
      }
    }
  }, [isSelected]);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div className="nft-card">
      <img src={nft.rawMetadata.image} alt={nft.rawMetadata.name} onClick={pathname === "/swap" ? handleClick : undefined} className={isSelected ? "selected" : ""} />
      <p>{`${nft.title} ${nft.tokenId}`}</p>
    </div>
  );
}

export default NFTCard;
