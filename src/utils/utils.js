const utils = {
  etherscanUrl: "https://goerli.etherscan.io/tx",

  shortenWalletAddress: function (address) {
    let left = address.substring(0, 6).concat("...");
    let right = address.slice(-4);
    return left.concat(right);
  },

  formatDate: function (input) {
    const date = new Date(input);
    const formatted = date.toLocaleString();
    return formatted;
  },
};

export default utils;
