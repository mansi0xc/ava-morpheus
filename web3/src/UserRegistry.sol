// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title User Registry
/// @notice Tracks registration, rewards, NFTs, and mystery participation
contract UserRegistry {
    struct User {
        bool registered;
        uint256 totalRewards;
        uint256 mysteriesParticipated;
        uint256[] ownedNFTs;
    }

    mapping(address => User) public users;
    address public caseManager;

    modifier onlyCaseManager() {
        require(msg.sender == caseManager, "Not case manager");
        _;
    }

    constructor(address _caseManager) {
        caseManager = _caseManager;
    }

    function register() external {
        require(!users[msg.sender].registered, "Already registered");
        users[msg.sender].registered = true;
    }

    function addReward(address user, uint256 amount) external onlyCaseManager {
        users[user].totalRewards += amount;
    }

    function incrementParticipation(address user) external onlyCaseManager {
        users[user].mysteriesParticipated += 1;
    }

    function addNFT(address user, uint256 tokenId) external onlyCaseManager {
        users[user].ownedNFTs.push(tokenId);
    }

    function getOwnedNFTs(address user) external view returns (uint256[] memory) {
        return users[user].ownedNFTs;
    }
}
