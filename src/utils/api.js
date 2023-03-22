import axios from "axios";

const api = {
  //TODO: Make this dynamic js from server side and load environment variables
  apiUrl: "https://swapup-api-dev.azurewebsites.net",
  //apiUrl : "http://localhost",

  fetchJson: async function (jsonFile) {
    fetch(jsonFile)
      .then((response) => response.json())
      .then((json) => console.log(json));
  },

  //fetch nfts for a given wallet
  getNftsForWallet: async function (walletId) {
    try {
      // ui.showloadingScreen();
      const response = await axios.get(`${this.apiUrl}/api/nfts/${walletId}`);
      // console.log(`NFTs`, response.data);
      // ui.showloadingScreen(false);
      return response.data;
    } catch (err) {
      console.error(err);
      // ui.showloadingScreen(false);
    }
  },

  //fetch pending swaps against a wallet address
  getPendingSwapsForWallet: async function (walletId) {
    try {
      // ui.showloadingScreen();
      const response = await axios.get(`${this.apiUrl}/api/swaps/pending/?address=${walletId}`);
      // console.log(`Pending Swaps`, response.data);
      // ui.showloadingScreen(false);
      return response.data;
    } catch (err) {
      console.error(err);
      // ui.showloadingScreen(false);
    }
  },

  //fetch previous swaps against a wallet address
  getSwapHistoryForWallet: async function (walletId) {
    try {
      // ui.showloadingScreen();
      const response = await axios.get(`${this.apiUrl}/api/swaps/history/?address=${walletId}`);
      // console.log(`History`, response.data);
      // ui.showloadingScreen(false);
      return response.data;
    } catch (err) {
      console.error(err);
      // ui.showloadingScreen(false);
    }
  },

  //create a new swap offer
  createSwapOffer: async function (swap) {
    try {
      console.log(swap);
      // ui.showloadingScreen();
      const response = await axios.post(`${this.apiUrl}/api/swaps/`, swap);
      console.log(`New Swap`, response.data);
      // ui.showloadingScreen(false);
      return response.data;
    } catch (err) {
      console.error(err);
      // ui.showloadingScreen(false);
    }
  },

  //update existing swap offer
  updateSwapOffer: async function (swap) {
    try {
      console.log(swap);
      // ui.showloadingScreen();
      const response = await axios.put(`${this.apiUrl}/api/swaps/`, swap);
      console.log(`Update Swap`, response.data);
      // ui.showloadingScreen(false);
      return response.data;
    } catch (err) {
      console.error(err);
      // ui.showloadingScreen(false);
    }
  },

  //update the swap status of existing offer
  updateSwapStatus: async function (swapStatus) {
    try {
      console.log(swapStatus);
      // ui.showloadingScreen();
      const response = await axios.patch(`${this.apiUrl}/api/swaps/status`, swapStatus);
      console.log(`Swap Status Updated`, response.data);
      // ui.showloadingScreen(false);
      return response.data;
    } catch (err) {
      console.error(err);
      // ui.showloadingScreen(false);
    }
  },

  //get swap details of existing swap
  getSwapDetails: async function (swapId, walletId) {
    try {
      // ui.showloadingScreen();
      const response = await axios.get(`${this.apiUrl}/api/swaps?swapId=${swapId}&walletId=${walletId}`);
      // console.log(`Swap Details`, response.data);
      // ui.showloadingScreen(false);
      return response.data;
    } catch (err) {
      console.error(err);
      // ui.showloadingScreen(false);
    }
  },
};

export default api;
