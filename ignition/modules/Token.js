const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat");

// const JAN_1ST_2030 = 1893456000;
// const ONE_GWEI = 1_000_000_000n;

// const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
// const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);
module.exports = buildModule("TokenModule", (m) => {
  const Token = m.contract("Token", [100]);
  const Dex = m.contract("Dex", [Token, 100]);

  return { Token, Dex };
});

// TokenModule#Token - 0x5FbDB2315678afecb367f032d93F642f64180aa3
// TokenModule#Dex - 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

//AFTER DEPLOYING
/**
 npx hardhat ignition deploy ignition/modules/Token.js --network localhost
Hardhat Ignition 🚀

Deploying [ TokenModule ]

Batch #1
  Executed TokenModule#Token

Batch #2
  Executed TokenModule#Dex

[ TokenModule ] successfully deployed 🚀

Deployed Addresses

TokenModule#Token - 0x5FbDB2315678afecb367f032d93F642f64180aa3
TokenModule#Dex - 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
 */
