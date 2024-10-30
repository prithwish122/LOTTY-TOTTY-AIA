import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import constants from './constants';

function PickWinner() {
    const [owner, setOwner] = useState('');
    const [contractInstance, setContractInstance] = useState(null);
    const [currentAccount, setCurrentAccount] = useState('');
    const [isOwnerConnected, setIsOwnerConnected] = useState(false);
    const [winner, setWinner] = useState('');
    const [status, setStatus] = useState(false);

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.BrowserProvider(window.ethereum);
                try {
                    const signer = await provider.getSigner();
                    const address = await signer.getAddress();
                    setCurrentAccount(address);
                    window.ethereum.on('accountsChanged', (accounts) => {
                        setCurrentAccount(accounts[0]);
                    });
                } catch (err) {
                    console.error(err);
                }
            } else {
                alert('Please install Metamask to use this application');
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
            setWinner(winner);
            const owner = await contractIns.getManager();
            setOwner(owner);
            setIsOwnerConnected(owner === currentAccount);
        };

        loadBlockchainData();
        if (currentAccount) {
            loadContract();
        }
    }, [currentAccount]);

    const pickWinner = async () => {
        const tx = await contractInstance.pickWinner();
        await tx.wait();
        // Refresh contract data after picking a winner
        const winner = await contractInstance.getWinner();
        setWinner(winner);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center  text-white">
            <div className=" bg-opacity-80 p-10 rounded-3xl shadow-xl w-full max-w-md">
                <h1 className="text-4xl font-bold mb-6 text-center">Result Page</h1>
                <div className="text-center mb-6">
                    {status ? (
                        <p className="text-xl">
                            <span className="font-semibold">Lottery Winner:</span> {winner || 'No winner yet'}
                        </p>
                    ) : isOwnerConnected ? (
                        <button
                            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-lg font-semibold rounded-full shadow-md transform hover:scale-105 transition-transform"
                            onClick={pickWinner}
                        >
                            Pick Winner
                        </button>
                    ) : (
                        <p className="text-xl">You are not the owner</p>
                    )}
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Current Account: {currentAccount}</p>
                </div>
            </div>
        </div>
    );
}

export default PickWinner;
