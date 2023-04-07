import "./Assets.scss";
import { useEffect, useState } from "react";
import useAppContext from "../../hooks/use-app-context";
import NFTCard from "../NFTCard/NFTCard";
import api from "../../utils/api";
import loaderImg from "../../assets/Interwind-1s-200px.svg";

function Assets() {
  const { connectedWallet } = useAppContext();
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      if (connectedWallet !== "") {
        const response = await api.getNftsForWallet(connectedWallet);

        if (response) {
          setNfts(response);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [connectedWallet]);

  const renderedCards = nfts.map((nft, index) => <NFTCard key={index} nft={nft} />);

  return (
    <>
      {isLoading && (
        <div className="wait-box">
          <img src={loaderImg} alt="" />
        </div>
      )}
      {!isLoading && <div className="card-container">{renderedCards}</div>}
    </>
  );
}

export default Assets;
