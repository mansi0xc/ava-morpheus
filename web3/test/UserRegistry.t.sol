// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {UserRegistry} from "../src/UserRegistry.sol";

contract UserRegistryTest is Test {
    UserRegistry registry;
    address caseManager;
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    function setUp() public {
        caseManager = address(this); // test contract acts as case manager
        registry = new UserRegistry(caseManager);
    }

    function test_register_once() public {
        vm.prank(alice);
        registry.register();
    (bool registered,,) = registry.users(alice);
        assertTrue(registered, "Alice should be registered");

        vm.prank(alice);
        vm.expectRevert(bytes("Already registered"));
        registry.register();
    }

    function test_onlyCaseManager_gates() public {
        // Non-caseManager cannot call restricted functions
        vm.prank(alice);
        vm.expectRevert(bytes("Not case manager"));
        registry.addReward(bob, 1 ether);

        vm.prank(alice);
        vm.expectRevert(bytes("Not case manager"));
        registry.incrementParticipation(bob);

        vm.prank(alice);
        vm.expectRevert(bytes("Not case manager"));
        registry.addNFT(bob, 1);
    }

    function test_caseManager_updates_state() public {
        // as caseManager (this)
    registry.addReward(alice, 2 ether);
    (, uint256 rewards,) = registry.users(alice);
        assertEq(rewards, 2 ether, "rewards");

        registry.incrementParticipation(alice);
    (,, uint256 participated) = registry.users(alice);
        assertEq(participated, 1, "participation count");

        registry.addNFT(alice, 42);
        uint256[] memory owned = registry.getOwnedNFTs(alice);
        assertEq(owned.length, 1, "nfts length");
        assertEq(owned[0], 42, "first token id");
    }
}
