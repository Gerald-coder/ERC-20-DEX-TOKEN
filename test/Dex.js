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
    const dex = await Dex.deploy(token.getAddress(), price);
    return { dex, token, owner, addr1, addr2 };
  }

  async function deployDexWithAllowance() {
    const { addr1, addr2, dex, owner, token } = await loadFixture(deployDex);
    await token.approve(dex.getAddress(), 100);
    const bal = await token.allowance(owner.address, dex.getAddress());
    return { addr1, addr2, dex, owner, token, bal };
  }

  async function deployDexWithValue(value) {
    const { dex } = await deployDexWithAllowance();
    await dex.sell();
    const numTokens = value;
    const tokenPrice = numTokens * price;
    return { tokenPrice, numTokens };
  }

  describe("Selling", () => {
    it("should fail to sell", async () => {
      const { dex, owner } = await loadFixture(deployDex);
      await expect(dex.connect(owner).sell()).to.be.reverted;
    });
    it("should allow Dex to sell token", async () => {
      const { dex, owner, token } = await loadFixture(deployDex);
      await token.connect(owner).approve(dex, 100);
    });
    it("should not allow non-owners to sell", async () => {
      const { dex, addr1 } = await loadFixture(deployDex);
      await expect(dex.connect(addr1).sell()).to.be.reverted;
    });
    it("should send token from owner to contract", async () => {
      const { dex, owner, token } = await deployDexWithAllowance();
      await expect(dex.sell()).to.changeTokenBalances(
        token,
        [owner, dex],
        [-100, 100]
      );
    });
  });

  describe("Getters", () => {
    it("should return correct token balance", async () => {
      const { dex } = await deployDexWithAllowance();
      await dex.sell();
      // const price = await dex.getPrice();
      // console.log(price, "price2");
      expect(await dex.getBalance()).to.be.equal(100);
    });
    it("should return the correct token price", async () => {
      const { dex, owner, token } = await loadFixture(deployDex);
      expect(await dex.getPrice(10)).to.be.equal(price * 10);
    });
  });
  //Fail
  describe("Buy", () => {
    it("should allow user to buy", async () => {
      const { dex, addr1, token } = await deployDexWithAllowance();

      const { tokenPrice, numTokens } = await deployDexWithValue(10);
      await expect(
        dex.connect(addr1).buy(numTokens, { value: tokenPrice })
      ).to.changeTokenBalances(token, [dex, addr1.address], [-10, 10]);
    });
    it("should not allow user to buy invalid number of tokens", async () => {
      const { addr1, dex } = await deployDexWithAllowance();
      await expect(dex.connect(addr1).buy(10000)).to.be.reverted;
    });
    it("should not allow user to buy with invalid value", async () => {
      const { addr1, dex } = await deployDexWithAllowance();
      await expect(dex.connect(addr1).buy(6, { value: 610 })).to.be.reverted;
    });
  });
  describe("Withdraw Tokens", () => {
    it("Non owner should not be able to withdraw tokens", async () => {
      const { addr1, dex } = await deployDexWithAllowance();
      await expect(dex.connect(addr1).withdrawToken()).to.be.reverted;
    });
    it("owner should be able to withdraw tokens", async () => {
      const { dex, token, owner, addr1 } = await deployDexWithAllowance();
      const { tokenPrice, numTokens } = await deployDexWithValue(10);
      await dex.connect(addr1).buy(numTokens, { value: tokenPrice });
      await expect(dex.withdrawToken()).to.changeTokenBalances(
        token,
        [dex, owner.address],
        [-90, 90]
      );
    });
    it("should allow owner to withdraw funds", async () => {
      const { owner, dex, addr1 } = await deployDexWithAllowance();
      const { tokenPrice, numTokens } = await deployDexWithValue(10);
      await dex.connect(addr1).buy(numTokens, { value: tokenPrice });
      await expect(dex.connect(owner).withdrawFunds()).to.changeEtherBalances(
        [owner.address, dex],
        [tokenPrice, -tokenPrice]
      );
    });
  });
});

// 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512,0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
