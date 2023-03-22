import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/Dashboard/Dashboard";
import HomePage from "./pages/Home/Home";
import SwapPage from "./pages/Swap/Swap";
import Assets from "./components/Assets/Assets";
import PendingSwaps from "./components/PendingSwaps/PendingSwaps";
import History from "./components/History/History";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardPage />}>
            <Route path="" element={<HomePage />}>
              <Route index element={<Assets />} />
              <Route path="pending" element={<PendingSwaps />} />
              <Route path="history" element={<History />} />
            </Route>
            <Route path="swap" element={<SwapPage />}>
              <Route path=":swapId" element={<SwapPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
