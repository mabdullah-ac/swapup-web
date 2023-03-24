import "./NFTCard.scss";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import className from "classnames";

function NFTCard({ nft, selectedNFTs, setSelectedNFTs, pending }) {
  const [isSelected, setIsSelected] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/swap") {
      const pendingNFTs = pending.map((p) => ({
        id: p.id,
        metadata: JSON.parse(p.metadata),
      }));

      if (isPartOfPendingSwap(nft.tokenId, nft.contract.address, pendingNFTs)) {
        setIsPending(true);
      }
    }
    // eslint-disable-next-line
  }, []);

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
    // eslint-disable-next-line
  }, [isSelected]);

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

  const handleClick = () => {
    if (!isPending) {
      setIsSelected(!isSelected);
    }
  };

  const computeClasses = () => {
    const finalClassName = className({
      selected: isSelected,
      pending: isPending,
    });

    return finalClassName;
  };

  return (
    <div className="nft-card">
      <img src={nft.rawMetadata.image} alt={nft.rawMetadata.name} onClick={pathname === "/swap" ? handleClick : undefined} className={computeClasses()} />
      <p>{`${nft.title} ${nft.tokenId}`}</p>
    </div>
  );
}

export default NFTCard;
