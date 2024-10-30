// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery2 {
    address public manager;
    address payable[] public players;
    address payable public winner;
    bool public isComplete;
    bool public claimed;
    uint public round;
    uint public currentRound;
    mapping(uint => address payable) public roundWinners;

    constructor() {
        manager = msg.sender;
        round = 1;
        isComplete = false;
        claimed = false;
        currentRound = round;
    }

    modifier restricted() {
        require(msg.sender == manager, "Only manager can perform this action");
        _;
    }

    modifier onlyWinner() {
        require(msg.sender == winner, "Only winner can claim the prize");
        _;
    }

    function getManager() public view returns (address) {
        return manager;
    }

    function getWinner() public view returns (address) {
        return winner;
    }

    function status() public view returns (bool) {
        return isComplete;
    }

    function enter() public payable {
        require(msg.value >= 0.001 ether, "Minimum entry fee is 0.001 ETH");
        require(!isComplete, "Lottery is complete");
        players.push(payable(msg.sender));
    }

    function pickWinner() public restricted {
        require(players.length > 0, "No players to pick from");
        require(!isComplete, "Lottery is already complete");

        // Pick a random winner
        winner = players[randomNumber() % players.length];
        roundWinners[currentRound] = winner;
        isComplete = true;
        currentRound++;
    }

    function claimPrize() public onlyWinner {
        require(isComplete, "Lottery is not complete");
        require(!claimed, "Prize has already been claimed");
        
        // Transfer prize to the winner
        payable(winner).transfer(address(this).balance);
        claimed = true;
    }

    function startNewRound() public restricted {
        require(isComplete, "Current round is not complete");
        
        // Reset the state for the new round
        delete players; // Correct way to reset the array
        isComplete = false;
        claimed = false;
        round++;
        currentRound = round;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function getRoundWinner(uint _round) public view returns (address) {
        return roundWinners[_round];
    }

    function randomNumber() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players.length)));
    }
}
