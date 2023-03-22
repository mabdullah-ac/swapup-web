import "./Dashboard.scss";
import { Outlet } from "react-router-dom";
import LeftNav from "../../components/LeftNav/LeftNav"

function DashboardPage() {
  return (
    <div className="container">
      <LeftNav className="sidenav" />
      <Outlet className="outlet" />
    </div>
  );
}

export default DashboardPage;
