// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LotteryContract {
    address public owner;
    address public winner;
    uint public tokenAmount;
    IERC20 public token;

    constructor(address _tokenAddress) {
        owner = msg.sender;
        token = IERC20(_tokenAddress);
    }

    function startLottery(uint _tokenAmount) external {
        require(msg.sender == owner, "Only owner can start the lottery");
        tokenAmount = _tokenAmount;
    }

    function chooseWinner(address _winner) external {
        require(msg.sender == owner, "Only owner can choose the winner");
        winner = _winner;
    }

    function sendTokens() external {
        require(msg.sender == owner, "Only owner can send tokens");
        require(winner != address(0), "Winner not chosen yet");

        token.transfer(winner, tokenAmount);
        token.transfer(owner, token.balanceOf(address(this)));

        // Reset the winner after sending tokens
        winner = address(0);
    }
}