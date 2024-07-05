// import { ethers } from "hardhat";
// const { getAbi } = require("../abi");
// const { ethers } = require("hardhat");

const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;

let tokenAbi = [
  "constructor (uint256 initialSupply)",
  "event Approval (address indexed owner, address indexed spender, uint256 value)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf (address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function decreaseAllowance(address spender, uint256 subtractedvalue) returns (bool)",
  "function increaseAllowance(address spender, uint256 addedvalue) returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function transfer (address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
];
let tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let tokenContract = null;

let dexAbi = [
  "constructor (address _token, uint256 _price)",
  "function associatedToken() view returns (address)",
  "function buy (uint _numTokens) payable",
  "function getPrice(uint _numTokens) view returns (uint256)",
  "function getBalance() view returns (uint256)",
  "function sell()",
  "function withdrawFunds()",
  "function withdrawToken()",
];
let dexAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
let dexContract = null;

async function getAccess() {
  if (tokenContract) {
    return;
  }
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
  dexContract = new ethers.Contract(dexAddress, dexAbi, signer);
}
async function getPrice() {
  await getAccess();
  const price = await dexContract.getPrice(1);
  document.getElementById("tokenPrice").innerHTML = price;
  return price;
}
async function getTokensBalance() {
  await getAccess();
  const tokenBalance = await tokenContract.balanceOf(await signer.getAddress());
  document.getElementById("tokenBalance").innerHTML = tokenBalance;
  return tokenBalance;
}
async function getAvailableTokens() {
  await getAccess();
  const tokenAvailable = await dexContract.getBalance();
  document.getElementById("tokenAvailable").innerHTML = tokenAvailable;
}

async function grantAccess() {
  await getAccess();
  const value = Number(document.getElementById("tokenGrant").value);
  console.log(typeof value);
  await tokenContract
    .approve(dexAddress, value)
    .then(() => alert("success"))
    .catch((error) => alert(error));
}
