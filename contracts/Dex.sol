// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Token {
    IERC20 public associatedToken;
    uint256 price;
    address owner;

    constructor(IERC20 _token, uint256 _amount) {
        owner = msg.sender;
        price = _amount;
        associatedToken = _token;
    }

    modifier onlywner() {
        require(msg.sender == owner);
        _;
    }
    function sell() external onlywner {
        uint256 allowance = associatedToken.allowance(owner, address(this));
        require(allowance > 0, "must allow at least one token");
        bool sent = associatedToken.transferFrom(
            owner,
            address(this),
            allowance
        );
        require(sent);
    }

    function withdrawToken() external onlywner {
        uint balance = associatedToken.balanceOf(address(this));
        associatedToken.transfer(owner, balance);
    }
}
