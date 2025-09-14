// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleMarketplace {
    event PaymentReceived(address indexed from, uint256 amount);

    /// @notice Function that requires exactly 0.2 AVAX
    function paySmall() external payable {
        require(msg.value == 0.2 ether, "Must send exactly 0.2 AVAX");
        emit PaymentReceived(msg.sender, msg.value);
    }

    /// @notice Function that requires exactly 10 AVAX
    function payLarge() external payable {
        require(msg.value == 10 ether, "Must send exactly 10 AVAX");
        emit PaymentReceived(msg.sender, msg.value);
    }
}
