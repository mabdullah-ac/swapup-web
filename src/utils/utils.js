const utils = {
  etherscanUrl: "https://goerli.etherscan.io/tx",

  shortenWalletAddress: function (address) {
    let left = address.substring(0, 8).concat("...");
    let right = address.slice(-6);
    return left.concat(right);
  },

  formatDate: function (input) {
    const date = new Date(input);
    const formatted = date.toLocaleString();
    return formatted;
  },
};

export default utils;
