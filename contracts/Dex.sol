// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GerryToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("GerryCoin", "Gerry") {
        _mint(msg.sender, initialSupply);
    }
}
