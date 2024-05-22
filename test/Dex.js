const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dex", () => {
  let price = 20;
  let totalSupply = "1000";

  async function deployDex() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy(totalSupply);

    const Dex = await ethers.getContractFactory("Dex");
    const dex = await Dex.deploy(token.address, price);
    return { dex, token, owner, addr1, addr2 };
  }
});
