const { readFile } = require("fs/promises");

const abi = "./ignition/deployments/chain-31337/artifacts/TokenModule#Dex.json";
async function getAbi() {
  const data = await readFile(abi, "utf-8");
  const ABI = JSON.parse(data)["abi"];
  return ABI;
}
module.exports = { getAbi };
