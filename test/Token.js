const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GerryToken", () => {
  let owner;
  let addr1;
  let addr2;
  let token;
  let totalSupply = "1000";

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(totalSupply);
  });

  describe("Deployment", () => {
    it("should assign all tokens to owner or deployer", async () => {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("should allow transfer of tokens", async () => {
      await token.connect(owner).transfer(addr1.address, 50);
      const addr1balance = await token.balanceOf(addr1.address);
      expect(addr1balance).to.equal(50);
    });
    it("does not allow token transfer with insulficient balance", async () => {
      await expect(token.connect(addr1).transfer(addr2.address, 51)).to.be
        .reverted;
    });
  });
});
