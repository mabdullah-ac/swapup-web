import "./NFTCard.scss";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import className from "classnames";

function NFTCard({ nft, selectedNFTs, setSelectedNFTs, pending, isAcceptor, ...rest }) {
  const [isSelected, setIsSelected] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { pathname } = useLocation();
  const { swapId } = useParams();

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

    if (pathname === `/swap/${swapId}`) {
      const pendingNFTs = pending.map((p) => ({
        id: p.id,
        metadata: JSON.parse(p.metadata),
      }));

      if (
        isPartOfPendingSwap(nft.tokenId, nft.contract.address, pendingNFTs) &&
        isPartOfSelectedSwap(nft.tokenId, nft.contract.address, selectedNFTs)
      ) {
        setIsSelected(true);
      } else if (isPartOfPendingSwap(nft.tokenId, nft.contract.address, pendingNFTs)) {
        setIsPending(true);
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (pathname === "/swap" || isAcceptor) {
      if (isSelected) {
        const id = nft.tokenId;
        const type = nft.tokenType;
        const address = nft.contract.address;

        const filtered = selectedNFTs.filter(
          (selectedNFT) => selectedNFT.id !== id && selectedNFT.address !== nft.contract.address
        );
        setSelectedNFTs([...filtered, { id, type, address }]);
        // setSelectedNFTs([...selectedNFTs, { id, type, address }]);
      } else {
        const filtered = selectedNFTs.filter(
          (selectedNFT) => selectedNFT.id !== nft.tokenId && selectedNFT.address !== nft.contract.address
        );
        setSelectedNFTs(filtered);
      }
    }

    // eslint-disable-next-line
  }, [isSelected]);

  const handleClick = () => {
    if (!isPending) {
      setIsSelected(!isSelected);
    }
  };

  const isPartOfPendingSwap = (tokenId, tokenAddress, pending) => {
    let found = false;
    pending.forEach((swap) => {
      let obj1 = swap.metadata.init.tokens.find((t) => t.id === tokenId && t.address === tokenAddress);
      let obj2 = swap.metadata.accept.tokens.find((t) => t.id === tokenId && t.address === tokenAddress);
      if (obj1 || obj2) found = true;
    });

    return found;
  };

  const isPartOfSelectedSwap = (tokenId, tokenAddress, selected) => {
    let found = false;
    let obj1 = selected.find((t) => t.id === tokenId && t.address === tokenAddress);
    if (obj1) found = true;

    return found;
  };

  const computeClasses = () => {
    const finalClassName = className({
      selected: isSelected,
      pending: isPending && !isSelected,
    });

    return finalClassName;
  };

  return (
    <div {...rest} className="nft-card">
      <img
        src={nft.rawMetadata.image}
        alt={nft.rawMetadata.name}
        onClick={pathname === "/swap" || isAcceptor ? handleClick : undefined}
        className={computeClasses()}
      />
      <p>{`${nft.title} ${nft.tokenId}`}</p>
    </div>
  );
}

export default NFTCard;
