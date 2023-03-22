import "./Assets.scss";
import { useEffect, useState } from "react";
import useAppContext from "../../hooks/use-app-context";
import NFTCard from "../NFTCard/NFTCard";
import api from "../../utils/api";

function Assets() {
  const { connectedWallet } = useAppContext();
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (connectedWallet !== "0x") {
        const response = await api.getNftsForWallet(connectedWallet);

        setNfts(response);
      }
    }
    fetchData();
  }, [connectedWallet]);

  const renderedCards = nfts.map((nft) => <NFTCard key={nft.tokenUri.raw} nft={nft} />);

  return (
    <>
      <div className="card-container">{renderedCards}</div>
    </>
  );
}

export default Assets;
