import "./NFTCard.scss";
import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import className from "classnames";

function NFTCard({ nft, selectedNFTs, setSelectedNFTs, pending, isAcceptor, ...rest }) {
  const [isSelected, setIsSelected] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const el = useRef();

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
        el.current.style.order = -1;
      }
    }

    if (pathname === `/swap/${swapId}`) {
      const pendingNFTs = pending.map((p) => ({
        id: p.id,
        metadata: JSON.parse(p.metadata),
      }));

      if (isPartOfSelectedSwap(nft.tokenId, nft.contract.address, selectedNFTs)) {
        setIsSelected(true);
        el.current.style.order = -2;
      } else if (isPartOfPendingSwap(nft.tokenId, nft.contract.address, pendingNFTs)) {
        setIsPending(true);
        el.current.style.order = -1;
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

        const filtered = selectedNFTs.filter((selectedNFT) => {
          if (selectedNFT.id === nft.tokenId) {
            if (selectedNFT.address === nft.contract.address) {
              return false;
            }
          }

          return true;
        });

        setSelectedNFTs([...filtered, { id, type, address }]);
      } else {
        const filtered = selectedNFTs.filter((selectedNFT) => {
          if (selectedNFT.id === nft.tokenId) {
            if (selectedNFT.address === nft.contract.address) {
              return false;
            }
          }

          return true;
        });

        setSelectedNFTs(filtered);
      }
    }

    // eslint-disable-next-line
  }, [isSelected]);

  const handleClick = (e) => {
    if (!isPending) {
      e.target.parentNode.style.order = -2;
      setIsSelected(!isSelected);
    }

    if (isSelected) {
      e.target.parentNode.style.order = 0;
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
    <div {...rest} className="nft-card" ref={el}>
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
