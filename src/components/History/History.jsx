import "./History.scss";
import { useEffect, useState } from "react";
import Table from "../Table/Table";
import useAppContext from "../../hooks/use-app-context";
import api from "../../utils/api";
import utils from "../../utils/utils";
import CheckIcon from "../../assets/checked-icon.png";
import CancelIcon from "../../assets/cancel-icon.svg";

function History() {
  const { connectedWallet } = useAppContext();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (connectedWallet !== "0x") {
        const response = await api.getSwapHistoryForWallet(connectedWallet);
        const filtered = response.data.filter((el) => el.status !== 1);

        filtered.sort((a, b) => {
          let diff = new Date(b.createdAt) - new Date(a.createdAt);
          return diff;
        });

        setHistory(filtered);
      }
    }
    fetchData();
  }, [connectedWallet]);

  const walletUI = (history) => {
    const acceptAddress = connectedWallet === history.init_address ? history.accept_address : history.init_address;
    return utils.shortenWalletAddress(acceptAddress);
  };

  const dateUI = (history) => {
    return utils.formatDate(history.createdAt);
  };

  const summaryUI = () => {
    return "View";
  };

  const statusUI = (history) => {
    let statusText;
    let icon;

    switch (history.status) {
      case 0: //cancelled
        statusText = "Cancelled";
        break;
      case 1: //pending/signed
        statusText = "Pending";
        break;
      case 2: //accepted
        statusText = "Accepted";
        break;
      case 3: //rejected
        statusText = "Rejected";
        break;
      case 4: //failed
        statusText = "TXN Failed";
        break;
      default:
        statusText = "";
    }

    icon = statusText === "Accepted" ? CheckIcon : CancelIcon;

    return (
      <button className="status-btn">
        <img src={icon} alt="status icon" />
      </button>
    );
  };

  const txnUI = (history) => {
    if (history.tx !== "undefined") {
      const txn = (
        <a className="history-link" href={`${utils.etherscanUrl}/${history.tx}`} rel="noreferrer" target="_blank">
          {`${history.tx.substring(0, 10)}...`}
        </a>
      );

      return txn;
    }

    return "";
  };

  const config = [
    { label: "Wallet", render: (history) => walletUI(history) },
    { label: "Date", render: (history) => dateUI(history) },
    { label: "Swap Summary", render: () => summaryUI() },
    { label: "Status", render: (history) => statusUI(history) },
    { label: "TXN #", render: (history) => txnUI(history) },
  ];

  const keyFn = (history) => {
    return history.id;
  };

  return (
    <>
      <Table data={history} config={config} keyFn={keyFn} />
    </>
  );
}

export default History;
