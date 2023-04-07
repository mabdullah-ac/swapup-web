import "./History.scss";
import { useEffect, useState } from "react";
import useAppContext from "../../hooks/use-app-context";
import Table from "../Table/Table";
import api from "../../utils/api";
import utils from "../../utils/utils";
import CheckIcon from "../../assets/checked-icon.png";
import CancelIcon from "../../assets/cancel-icon.svg";
import Modal from "react-modal";
import loaderImg from "../../assets/Interwind-1s-200px.svg";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#22223f",
    borderRadius: "23px",
    padding: "30px",
    width: "65%",
    color: "#fff",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
};

Modal.setAppElement("#root");

function History() {
  const { connectedWallet } = useAppContext();
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      if (connectedWallet !== "") {
        const response = await api.getSwapHistoryForWallet(connectedWallet);

        if (response) {
          const filtered = response.data.filter((el) => el.status !== 1);

          filtered.sort((a, b) => {
            let diff = new Date(b.createdAt) - new Date(a.createdAt);
            return diff;
          });

          setHistory(filtered);
        }
      }
      setIsLoading(false);
    }
    fetchData();
  }, [connectedWallet]);

  const walletUI = (h) => {
    const acceptAddress = connectedWallet === h.init_address ? h.accept_address : h.init_address;
    return utils.shortenWalletAddress(acceptAddress);
  };

  const dateUI = (h) => {
    return utils.formatDate(h.createdAt);
  };

  const summaryUI = (h) => {
    const temp = { ...h };

    temp.metadata = JSON.parse(temp.metadata);

    return (
      <span
        className="view-modal-btn"
        onClick={() => {
          setIsModalOpen(true);
          setModalData(temp);
        }}
      >
        View
      </span>
    );
  };

  const statusUI = (h) => {
    let statusText;
    let icon;

    switch (h.status) {
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

  const txnUI = (h) => {
    if (h.tx !== "undefined") {
      const txn = (
        <a className="history-link" href={`${utils.etherscanUrl}/${h.tx}`} rel="noreferrer" target="_blank">
          {`${h.tx.substring(0, 10)}...`}
        </a>
      );

      return txn;
    }

    return "";
  };

  // h represents a single object from the history array.
  const config = [
    { label: "Wallet", render: (h) => walletUI(h) },
    { label: "Date", render: (h) => dateUI(h) },
    { label: "Swap Summary", render: (h) => summaryUI(h) },
    { label: "Status", render: (h) => statusUI(h) },
    { label: "TXN #", render: (h) => txnUI(h) },
  ];

  const keyFn = (h) => {
    return h.id;
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="History Modal"
      >
        <div className="heading">Swap Summary</div>
        <div className="modal-body">
          <div>
            <p>{connectedWallet}</p>
            {connectedWallet === modalData.init_address
              ? modalData.metadata?.init.tokens.map((token, index) => (
                  <img key={index} src={token.image} alt={token.name} />
                ))
              : modalData.metadata?.accept.tokens.map((token, index) => (
                  <img key={index} src={token.image} alt={token.name} />
                ))}
          </div>
          <div>
            <p>{connectedWallet === modalData.init_address ? modalData.accept_address : modalData.init_address}</p>
            {connectedWallet === modalData.init_address
              ? modalData.metadata?.accept.tokens.map((token, index) => (
                  <img key={index} src={token.image} alt={token.name} />
                ))
              : modalData.metadata?.init.tokens.map((token, index) => (
                  <img key={index} src={token.image} alt={token.name} />
                ))}
          </div>
        </div>
      </Modal>
      {isLoading && (
        <div className="wait-box">
          <img src={loaderImg} alt="" />
        </div>
      )}
      {!isLoading && <Table data={history} config={config} keyFn={keyFn} />}
    </>
  );
}

export default History;
