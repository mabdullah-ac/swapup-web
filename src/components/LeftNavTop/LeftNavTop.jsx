import "./LeftNavTop.scss"
import { NavLink } from "react-router-dom";
import HomeIcon from "../../assets/home-alt.svg";
import NftIcon from "../../assets/nft-icon.svg";
import Swapup from "../../assets/swapup.png";

function LeftNavTop() {
  return (
    <div>
      <div className="logo">
        <img src={Swapup} alt="Swapup Logo" />
      </div>

      <nav className="nav">
        <NavLink to="">
          <img src={HomeIcon} alt="Home Icon" />
          <span>Home</span>
        </NavLink>
        <NavLink to="swap">
          <img src={NftIcon} alt="NFT Icon" />
          <span>Swap NFTs</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default LeftNavTop;
