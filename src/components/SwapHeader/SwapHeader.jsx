import "./SwapHeader.scss";
import PlayerImage from "../../assets/player.png";

function SwapHeader({icon}) {
  return (
    <header className="header">
      <div className="player-img">
        <img src={PlayerImage} alt="" />
      </div>
      <div className="status-icon">
        <img src={icon} alt="" />
      </div>
    </header>
  );
}

export default SwapHeader;
