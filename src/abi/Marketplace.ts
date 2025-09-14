export const abi = [
    {
        "type": "function",
        "name": "payLarge",
        "inputs": [],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "paySmall",
        "inputs": [],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "event",
        "name": "PaymentReceived",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    }
];

export const address = "0x4a29E5098E5a744aeFc444c3F2C39dB200e08377";