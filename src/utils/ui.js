import Swal from "sweetalert2";

const ui = {
  etherScanUrl: "https://goerli.etherscan.io",
  openSeaUrl: "https://testnets.opensea.io", // /assets/[ethereum/goerli]/0x394e3d3044fc89fcdd966d3cb35ac0b32b0cda91/1534",

  getEtherScanContractNftUrl: function (token, nftId) {
    return `${this.etherScanUrl}/token/${token}?a=${nftId}`;
  },

  getOpenSeaNftUrl: function (token, nftId) {
    return `${this.openSeaUrl}/assets/goerli/${token}/${nftId}`;
  },

  alert: function (msg) {
    Swal.fire({
      position: "top",
      title: msg,
      timer: 5000,
      timerProgressBar: true,
    });
  },
};

export default ui;
