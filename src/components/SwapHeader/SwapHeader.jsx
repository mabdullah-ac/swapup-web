import "./SwapHeader.scss";
import PlayerImage from "../../assets/player.png";
import CheckedIcon from "../../assets/checked-icon.png";

function SwapHeader() {
  return (
    <header className="header">
      <div className="player-img">
        <img src={PlayerImage} alt="" />
      </div>
      <div className="status-icon">
        <img src={CheckedIcon} alt="" />
      </div>
    </header>
  );
}

export default SwapHeader;
