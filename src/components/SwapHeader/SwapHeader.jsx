import "./SwapHeader.scss";
import { useEffect, useRef } from "react";
import PlayerImage from "../../assets/Layer 3.png";

function SwapHeader({ icon, order }) {
  const el = useRef();

  useEffect(() => {
    el.current.style.order = order;
  }, []);

  return (
    <header className="swap-header">
      <div className="player-img">
        <img src={PlayerImage} alt="" />
      </div>
      <div className="status-icon" ref={el}>
        <img src={icon} alt="" />
      </div>
    </header>
  );
}

export default SwapHeader;
