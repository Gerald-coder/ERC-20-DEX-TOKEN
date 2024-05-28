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
    const dex = await Dex.deploy(token, price);
    return { dex, token, owner, addr1, addr2 };
  }

  describe("Selling", () => {
    it("should fail to sell", async () => {
      const { dex, owner, token, addr1 } = await loadFixture(deployDex);
      await expect(dex.connect(owner).sell()).to.be.reverted;
      //STOP
    });
    // it("should allow Dex to sell token", async () => {
    //   const { dex, owner, token, addr1 } = await loadFixture(deployDex);
    //   await token.connect(owner).approve(dex.address, 100);
    // });
    // it("should not allow non-owners to sell", async () => {
    //   const { dex, owner, token, addr1 } = await loadFixture(deployDex);
    //   await expect(dex.connect(addr1).sell()).to.be.reverted;
    // });
    // it("should send token from owner to contract", async () => {
    //   const { dex, owner, token, addr1 } = await loadFixture(deployDex);
    //   await expect(dex.sell()).to.changeTokenBalances(
    //     token,
    //     [owner.address, dex.address],
    //     [-100, 100]
    //   );
    // });
  });
});
