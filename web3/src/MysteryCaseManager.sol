// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {UserRegistry} from "./UserRegistry.sol";
import {PrizePool} from "./PrizePool.sol";
import {GameNFT} from "./GameNFT.sol";

/// @title Mystery Case Manager
/// @notice Main contract that handles cases, submissions, rewards, NFTs, and registry updates
contract MysteryCaseManager {
    struct Case {
        string description;
        uint256 endTime;
        uint8 correctAnswer;
        bool active;
        uint256 totalPrize;
    }

    struct Submission {
        bool submitted;
        uint8 answer;
    }

    mapping(uint256 => Case) public cases;
    mapping(uint256 => mapping(address => Submission)) public submissions;
    uint256 public nextCaseId;

    UserRegistry public registry;
    PrizePool public prizePool;
    GameNFT public nft;
    address public manager;

    modifier onlyManager() {
        require(msg.sender == manager, "Not manager");
        _;
    }

    constructor(address _registry, address _prizePool, address _nft) {
        registry = UserRegistry(_registry);
        prizePool = PrizePool(_prizePool);
        nft = GameNFT(_nft);
        manager = msg.sender;
    }

    function createCase(
        string memory desc,
        uint256 duration,
        uint8 correctAnswer
    ) external payable onlyManager {
        require(msg.value > 0, "Prize required");

        cases[nextCaseId] = Case({
            description: desc,
            endTime: block.timestamp + duration,
            correctAnswer: correctAnswer,
            active: true,
            totalPrize: msg.value
        });

        prizePool.deposit{value: msg.value}(nextCaseId);
        nextCaseId++;
    }

    function submit(uint256 caseId, uint8 answer) external {
        Case storage c = cases[caseId];
        require(c.active && block.timestamp < c.endTime, "Case closed");
        require(!submissions[caseId][msg.sender].submitted, "Already submitted");

        submissions[caseId][msg.sender] = Submission(true, answer);
        registry.incrementParticipation(msg.sender);
    }

    function closeCase(uint256 caseId, address[] calldata players) external onlyManager {
        Case storage c = cases[caseId];
        require(c.active, "Already closed");
        require(block.timestamp >= c.endTime, "Too early");
        c.active = false;

        uint256 winners;
        for (uint256 i = 0; i < players.length; i++) {
            if (
                submissions[caseId][players[i]].submitted &&
                submissions[caseId][players[i]].answer == c.correctAnswer
            ) {
                winners++;
            }
        }
        require(winners > 0, "No winners");

        uint256 share = c.totalPrize / winners;

        for (uint256 i = 0; i < players.length; i++) {
            if (
                submissions[caseId][players[i]].submitted &&
                submissions[caseId][players[i]].answer == c.correctAnswer
            ) {
                // pay reward
                prizePool.payout(caseId, players[i], share);
                registry.addReward(players[i], share);

                // mint NFT
                uint256 tokenId = nft.mint(players[i]);
                registry.addNFT(players[i], tokenId);
            }
        }
    }
}
