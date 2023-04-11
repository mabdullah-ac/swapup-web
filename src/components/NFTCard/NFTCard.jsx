import "./NFTCard.scss";
import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import className from "classnames";
import BuildImg from "../../assets/build.svg";
import BoatImg from "../../assets/boat.svg";
import CheckedImg from "../../assets/checked-icon.png";

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
    if (pathname === "/swap") {
      setIsSelected(false);
      el.current.style.order = 0;

      const pendingNFTs = pending.map((p) => ({
        id: p.id,
        metadata: JSON.parse(p.metadata),
      }));

      if (isPartOfPendingSwap(nft.tokenId, nft.contract.address, pendingNFTs)) {
        setIsPending(true);
        el.current.style.order = -1;
      }
    }

    // eslint-disable-next-line
  }, [swapId]);

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

  const handleClick = () => {
    if (!isPending) {
      el.current.style.order = -2;
      setIsSelected(!isSelected);
    }

    if (isSelected) {
      el.current.style.order = 0;
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
      <div className="nft-img" onClick={pathname === "/swap" || isAcceptor ? handleClick : undefined}>
        <img src={nft.rawMetadata.image} alt={nft.rawMetadata.name} className={computeClasses()} />
        {isSelected && (
          <div className="check-nft">
            <img src={CheckedImg} alt="Checked icon" />
          </div>
        )}
      </div>
      <div className="nft-details">
        <div className="nft-name">{nft.title}</div>
        <div className="IdnBtns">
          <div className="nft-id">
            <h6 id="nft-id">#{nft.tokenId}</h6>
          </div>
          <div>
            <a href="" target="_blank">
              <img src={BuildImg} height="20px" alt="" />
            </a>
            <a href="" target="_blank">
              <img src={BoatImg} height="20px" alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTCard;
