import LeftNavTop from "../LeftNavTop/LeftNavTop";
import LeftNavBottom from "../LeftNavBottom/LeftNavBottom";
import "./LeftNav.scss";

function LeftNav() {
  return (
    <div className="sidenav-container">
      <LeftNavTop />
      <LeftNavBottom />
    </div>
  );
}

export default LeftNav;
