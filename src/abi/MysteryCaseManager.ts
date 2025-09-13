export const abi = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "_registry",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_prizePool",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_nft",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "cases",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "description",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "endTime",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "correctAnswer",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "active",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "totalPrize",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "closeCase",
        "inputs": [
            {
                "name": "caseId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "players",
                "type": "address[]",
                "internalType": "address[]"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "createCase",
        "inputs": [
            {
                "name": "desc",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "duration",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "correctAnswer",
                "type": "uint8",
                "internalType": "uint8"
            }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "manager",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "nextCaseId",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "nft",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract GameNFT"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "prizePool",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract PrizePool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "registry",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract UserRegistry"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "submissions",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "submitted",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "answer",
                "type": "uint8",
                "internalType": "uint8"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "submit",
        "inputs": [
            {
                "name": "caseId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "answer",
                "type": "uint8",
                "internalType": "uint8"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    }
];

// export const address = ""