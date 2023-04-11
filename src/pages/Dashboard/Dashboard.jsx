import "./Dashboard.scss";
import { Outlet } from "react-router-dom";
import LeftNav from "../../components/LeftNav/LeftNav";

function DashboardPage() {
  return (
    <div className="container">
      <div className="sidenav-container">
        <LeftNav />
      </div>
      <div className="outlet-container">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardPage;
