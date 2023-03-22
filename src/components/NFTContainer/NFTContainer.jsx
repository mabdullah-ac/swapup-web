import "./NFTContainer.scss";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import NFTCard from "../NFTCard/NFTCard";

function NFTContainer({ wallet, selectedNFTs, setSelectedNFTs }) {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNfts = async () => {
      const response = await api.getNftsForWallet(wallet);

      setNfts(response);
    };

    fetchNfts();
  }, [wallet]);

  const renderedNFTs = nfts.map((nft) => <NFTCard key={nft.tokenUri.raw} nft={nft} selectedNFTs={selectedNFTs} setSelectedNFTs={setSelectedNFTs} />);

  return <div className="nft-container">{renderedNFTs}</div>;
}

export default NFTContainer;
