import "./PendingSwaps.scss";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import useAppContext from "../../hooks/use-app-context";
import Table from "../Table/Table";
import api from "../../utils/api";
import utils from "../../utils/utils";
import CancelIcon from "../../assets/cancel-icon.svg";
import loaderImg from "../../assets/Interwind-1s-200px.svg";

function PendingSwaps() {
  const { connectedWallet } = useAppContext();
  const [pending, setPending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      if (connectedWallet !== "") {
        const response = await api.getPendingSwapsForWallet(connectedWallet);

        if (response) {
          setPending(response.data.reverse());
        }
      }
      setIsLoading(false);
    }
    fetchData();
  }, [connectedWallet]);

  const walletUI = (pending) => {
    const acceptAddress = connectedWallet === pending.init_address ? pending.accept_address : pending.init_address;
    return (
      <NavLink className="address-wallet" to={`/swap/${pending.id}`}>
        {utils.shortenWalletAddress(acceptAddress)}
      </NavLink>
    );
  };

  const dateUI = (pending) => {
    return utils.formatDate(pending.createdAt);
  };

  const statusUI = () => {
    return "Pending";
  };

  const cancelUI = (pending) => {
    return (
      <button className="cancel-btn" onClick={() => cancelSwap(pending.id)}>
        <img src={CancelIcon} alt="Cancel Icon" />
      </button>
    );
  };

  const cancelSwap = async (id) => {
    const res = await api.updateSwapStatus({ id: id, status: 0 });
    if (res.success) {
      alert("Offer Cancelled");
      const response = await api.getPendingSwapsForWallet(connectedWallet);

      response.data.sort((a, b) => {
        let diff = new Date(a.createdAt) - new Date(b.createdAt);
        return diff;
      });

      setPending(response.data);
    }
  };

  const config = [
    { label: "Counter Party Wallet", render: (pending) => walletUI(pending) },
    { label: "Date", render: (pending) => dateUI(pending) },
    { label: "Status", render: () => statusUI() },
    { label: "Cancel", render: (pending) => cancelUI(pending) },
  ];

  const keyFn = (pending) => {
    return pending.id;
  };

  return (
    <>
      {isLoading && (
        <div className="wait-box">
          <img src={loaderImg} alt="" />
        </div>
      )}
      <div className="table-bg">
        <div className="table-scroll">{!isLoading && <Table data={pending} config={config} keyFn={keyFn} />}</div>
      </div>
    </>
  );
}

export default PendingSwaps;
