import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import constants from "./constants";
import winnerImage from "./assets/images/winner.png"; // Adjust the path based on your structure
import lotteryImage from "./assets/images/lottery.png"; // Adjust the path based on your structure

function Home() {
    const [currentAccount, setCurrentAccount] = useState("");
    const [contractInstance, setContractInstance] = useState(null);
    const [status, setStatus] = useState(false);
    const [isWinner, setIsWinner] = useState(false);

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.BrowserProvider(window.ethereum);
                try {
                    const signer = await provider.getSigner();
                    const address = await signer.getAddress();
                    console.log(address);
                    setCurrentAccount(address);
                    window.ethereum.on("accountsChanged", (accounts) => {
                        setCurrentAccount(accounts[0]);
                        console.log(currentAccount);
                    });
                } catch (err) {
                    console.error(err);
                }
            } else {
                alert("Please install Metamask to use this application");
            }
        };

        const loadContract = async () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractIns = new ethers.Contract(
                constants.contractAddress,
                constants.contractAbi,
                signer
            );
            setContractInstance(contractIns);
            const status = await contractIns.isComplete();
            setStatus(status);
            const winner = await contractIns.getWinner();
            setIsWinner(winner === currentAccount);
        };

        loadBlockchainData();
        if (currentAccount) {
            loadContract();
        }
    }, [currentAccount]);

    const enterLottery = async () => {
        const amountToSend = ethers.parseEther("0.001");
        const tx = await contractInstance.enter({ value: amountToSend });
        await tx.wait();
    };

    const claimPrize = async () => {
        const tx = await contractInstance.claimPrize();
        await tx.wait();
    };

    return (
        <div className="min-h-screen  flex flex-col items-center justify-center text-white">
            <div className="bg-white bg-opacity-10 p-10 rounded-3xl shadow-2xl">
                <h1 className="text-5xl font-bold mb-8 text-center tracking-wide">
                    Lottery Page
                </h1>
                <div className="relative mb-8 left-5">
                    <img
                        src={status ? winnerImage : lotteryImage}
                        alt="Lottery Visual"
                        className="w-64 h-64 object-cover rounded-full shadow-lg"
                    />
                    {status && isWinner && (
                        <div className="absolute inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center rounded-full right-10">
                            <p className="text-2xl font-bold animate-pulse">You Won!</p>
                        </div>
                    )}
                </div>
                <div className="button-container text-center">
                    {status ? (
                        isWinner ? (
                            <button
                                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-lg font-semibold rounded-full shadow-md transform hover:scale-105 transition-transform right-5"
                                onClick={claimPrize}
                            >
                                Claim Prize
                            </button>
                        ) : (
                            <p className="text-xl">You are not the winner</p>
                        )
                    ) : (
                        <button
                            className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-lg font-semibold rounded-full shadow-md transform hover:scale-105 transition-transform"
                            onClick={enterLottery}
                        >
                            Enter Lottery
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;