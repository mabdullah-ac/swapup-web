import "./LeftNavBottom.scss";
import { useEffect } from "react";
import useAppContext from "../../hooks/use-app-context";
import { FaTwitter, FaDiscord } from "react-icons/fa";
import metamask from "../../utils/metamask";

function LeftNavBottom() {
  const { connectedWallet, updateConnectedWallet } = useAppContext();

  useEffect(() => {
    const connect = async () => {
      try {
        const userAddress = await metamask.getConnectedWallet();

        if (userAddress) {
          updateConnectedWallet(userAddress);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    connect();
    // eslint-disable-next-line
  }, []);

  const connectWallet = async () => {
    try {
      const userAddress = await metamask.connectWallet(true);

      if (userAddress) {
        updateConnectedWallet(userAddress);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="bottom-content">
      <button className="btn-primary" onClick={connectWallet} style={{ display: connectedWallet !== "" && "none" }}>
        Connect Wallet
      </button>
      <div className="social-ic">
        <a href="https://twitter.com/swapup_trade" className="link-ic">
          <FaTwitter />
        </a>
        <a href="https://discord.gg/UGt25aGB5U" className="link-ic">
          <FaDiscord />
        </a>
      </div>
    </div>
  );
}

export default LeftNavBottom;
