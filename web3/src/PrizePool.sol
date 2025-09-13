// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Prize Pool
/// @notice Stores prize money for each mystery case
contract PrizePool {
    mapping(uint256 => uint256) public poolBalance;
    address public caseManager;

    modifier onlyCaseManager() {
        require(msg.sender == caseManager, "Not case manager");
        _;
    }

    constructor(address _caseManager) {
        caseManager = _caseManager;
    }

    function deposit(uint256 caseId) external payable onlyCaseManager {
        poolBalance[caseId] += msg.value;
    }

    function payout(uint256 caseId, address winner, uint256 amount) external onlyCaseManager {
        require(poolBalance[caseId] >= amount, "Insufficient pool");
        poolBalance[caseId] -= amount;
        payable(winner).transfer(amount);
    }
}
