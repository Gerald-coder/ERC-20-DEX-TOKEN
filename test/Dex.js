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
    return { addr1, addr2, dex, owner, token };
  }

  describe("Selling", () => {
    it("should fail to sell", async () => {
      const { dex, owner } = await loadFixture(deployDex);
      await expect(dex.connect(owner).sell()).to.be.reverted;
      //STOP
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
      expect(await dex.getBalance()).to.be.equal(100);
    });
    it("should return the correct token price", async () => {
      const { dex, owner, token } = await loadFixture(deployDex);
      expect(await dex.getPrice(10)).to.be.equal(price * 10);
    });
  });
});
