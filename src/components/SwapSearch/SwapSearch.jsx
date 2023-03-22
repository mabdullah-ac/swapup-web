import "./SwapSearch.scss";

function SwapSearch({ wallet, setWallet, disabled }) {
  const handleChange = (e) => {
    setWallet(e.target.value);
  };

  return (
    <div className="wallet-search">
      <input type="text" placeholder="wallet" value={wallet} onChange={handleChange} disabled={disabled} />
    </div>
  );
}

export default SwapSearch;
