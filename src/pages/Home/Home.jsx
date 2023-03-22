import "./Home.scss";
import { NavLink, Outlet } from "react-router-dom";
import useAppContext from "../../hooks/use-app-context";

import HeroImage from "../../assets/HeroImage.jpg";
import ProfilePicture from "../../assets/Untitled-2.jpg";

function HomePage() {
  const { connectedWallet } = useAppContext();

  const accountNumberUI = connectedWallet === "" ? "0x" : `${connectedWallet.slice(0, 8)}...${connectedWallet.slice(36)}`;

  return (
    <div className="home-container">
      <header>
        <div className="wallet-bg">
          <img src={HeroImage} alt="Cover" />
        </div>

        <div className="wallet-profile">
          <img src={ProfilePicture} alt="Display" />
        </div>
        <div className="logged-account">{accountNumberUI}</div>
      </header>

      <nav className="home-nav">
        <NavLink className={({ isActive }) => (isActive ? "active-link" : "")} end to="">
          Assets
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? "active-link" : "")} to="pending">
          Pending Swaps
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? "active-link" : "")} to="history">
          History
        </NavLink>
      </nav>

      <div className="home-outlet">
        <Outlet />
      </div>
    </div>
  );
}

export default HomePage;
