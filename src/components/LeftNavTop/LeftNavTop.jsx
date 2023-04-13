import "./LeftNavTop.scss";
import { NavLink } from "react-router-dom";
import HomeIcon from "../../assets/home-alt.svg";
import NftIcon from "../../assets/nft-icon.svg";
import UserIcon from "../../assets/user.svg";
import Swapup from "../../assets/swapup.png";

function LeftNavTop() {
  return (
    <div>
      <div className="logo">
        <img src={Swapup} alt="Swapup Logo" />
      </div>

      <nav className="nav">
        {/* <NavLink to="">
          <img src={HomeIcon} alt="Home Icon" />
          <span>Home</span>
        </NavLink> */}
        <NavLink to="swap">
          <img src={NftIcon} alt="NFT Icon" className="nft-icon" />
          <span>Swap NFTs</span>
        </NavLink>
        <NavLink to="">
          <img src={UserIcon} alt="User Icon" className="user-icon" />
          <span>Account</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default LeftNavTop;
