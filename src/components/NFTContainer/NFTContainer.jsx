import "./NFTContainer.scss";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import NFTCard from "../NFTCard/NFTCard";
import loaderImg from "../../assets/Interwind-1s-200px.svg";

function NFTContainer({
  wallet,
  selectedNFTs,
  setSelectedNFTs,
  pending,
  isAcceptor,
  isLoading,
  setIsLoading,
  rerender,
}) {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNfts = async () => {
      if (rerender) {
        setIsLoading(true);
      }
      const response = await api.getNftsForWallet(wallet);

      if (response) {
        setNfts(response);
      }
      setIsLoading(false);
    };

    fetchNfts();

    // eslint-disable-next-line
  }, [wallet, pending]);

  const renderedNFTs = nfts.map((nft) => (
    <NFTCard
      key={`${nft.contract.address}_${nft.tokenId}`}
      id={`${nft.contract.address}_${nft.tokenId}`}
      pending={pending}
      nft={nft}
      selectedNFTs={selectedNFTs}
      setSelectedNFTs={setSelectedNFTs}
      isAcceptor={isAcceptor}
    />
  ));

  return (
    <>
      {isLoading && (
        <div className="wait-box">
          <img src={loaderImg} alt="" />
        </div>
      )}
      {!isLoading && <div className="nft-container">{renderedNFTs}</div>};
    </>
  );
}

export default NFTContainer;
