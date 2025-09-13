// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {PrizePool} from "../src/PrizePool.sol";

contract PrizePoolTest is Test {
    PrizePool pool;
    address manager = address(this);
    address alice = address(0xA11CE);

    function setUp() public {
        pool = new PrizePool(manager);
    vm.deal(address(this), 10 ether);
    vm.deal(alice, 1 ether);
    }

    function test_onlyCaseManager_deposit_and_payout() public {
        // Non-manager cannot deposit
        vm.prank(alice);
        vm.expectRevert(bytes("Not case manager"));
        pool.deposit{value: 1 ether}(1);

        // Manager deposits
    pool.deposit{value: 2 ether}(1);
        assertEq(pool.poolBalance(1), 2 ether, "pool balance after deposit");

        // Non-manager cannot payout
        vm.prank(alice);
        vm.expectRevert(bytes("Not case manager"));
        pool.payout(1, alice, 1 ether);

        // Insufficient pool reverts
        vm.expectRevert(bytes("Insufficient pool"));
        pool.payout(1, alice, 3 ether);

        // Payout ok
        uint256 beforeBal = alice.balance;
        pool.payout(1, alice, 1 ether);
        assertEq(pool.poolBalance(1), 1 ether, "pool balance after payout");
        assertEq(alice.balance - beforeBal, 1 ether, "alice received");
    }

    receive() external payable {}
}
