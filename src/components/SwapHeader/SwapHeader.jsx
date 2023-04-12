import "./SwapHeader.scss";
import { useEffect, useRef } from "react";
import PlayerImage from "../../assets/Layer 3.png";

function SwapHeader({ icon, order, justify, rotate }) {
  const el = useRef();
  const head = useRef();
  const imageRef = useRef();

  useEffect(() => {
    el.current.style.order = order;
    head.current.style.justifyContent = justify;
    imageRef.current.style.transform = `rotateY(${rotate})`;

    // eslint-disable-next-line
  }, []);

  return (
    <header className="swap-header" ref={head}>
      <div className="player-img" ref={imageRef}>
        <img src={PlayerImage} alt="" />
      </div>
      <div className="status-icon" ref={el}>
        <img src={icon} alt="" />
      </div>
    </header>
  );
}

export default SwapHeader;
