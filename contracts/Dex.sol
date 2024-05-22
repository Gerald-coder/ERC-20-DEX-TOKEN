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
        require(msg.sender == owner, "only owner can call this this");
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

    function withdrawToken() external onlyOwner {
        uint balance = associatedToken.balanceOf(address(this));
        bool sent = associatedToken.transfer(msg.sender, balance);
        require(sent, "transfer failed");
    }

    function withdrawFunds() external onlyOwner {
        (bool sent, ) = payable(owner).call{value: address(this).balance}("");
        require(sent, "not sent");
    }

    function getPrice(uint _numTokens) public returns (uint256) {
        return _numTokens * price;
    }

    function buy(uint _numTokens) external payable {
        uint256 balance = associatedToken.balanceOf(address(this));
        require(_numTokens <= balance, "no enough token to buy");
        uint256 tokenPrice = getPrice(_numTokens);
        require(msg.value == tokenPrice, "you need to pay for the token fully");

        bool sent = associatedToken.transfer(msg.sender, _numTokens);
        require(sent, "token not sent to buyer");
    }

    function getBalance() public view returns (uint256) {
        return associatedToken.balanceOf(address(this));
    }
}
