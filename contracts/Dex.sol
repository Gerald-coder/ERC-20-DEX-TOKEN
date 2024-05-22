// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// who ever deploys the contract can sell the token, and they can sell any token they want
// and they way the will specify what they are selling is by sending the address of that token contract to this contract
// we need to store the token we are selling and the price the user wants to sell the token for

contract Dex {
    IERC20 public associatedToken;
    uint256 price;
    address owner;

    constructor(IERC20 _token, uint256 _price) {
        associatedToken = _token;
        price = _price;
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can call this contract");
        _;
    }
    function sell() external onlyOwner {
        uint256 allowance = associatedToken.allowance(
            msg.sender,
            address(this)
        );
        require(allowance > 0, "you need to allow at least one token");
        bool sent = associatedToken.transferFrom(
            msg.sender,
            address(this),
            allowance
        );
        require(sent, "transfer failed");
    }
}
