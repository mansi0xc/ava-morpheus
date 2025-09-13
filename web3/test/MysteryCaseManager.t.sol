// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {MysteryCaseManager} from "../src/MysteryCaseManager.sol";
import {UserRegistry} from "../src/UserRegistry.sol";
import {PrizePool} from "../src/PrizePool.sol";
import {GameNFT} from "../src/GameNFT.sol";

contract MysteryCaseManagerTest is Test {
    UserRegistry registry;
    PrizePool prizePool;
    GameNFT nft;
    MysteryCaseManager manager;

    address owner = address(this);
    address alice = address(0xA11CE);
    address bob = address(0xB0B);
    address carol = address(0xCAaA1);

    function setUp() public {
    // Fund this test address to pay prizes
    vm.deal(address(this), 100 ether);

    // Pre-compute the address of the manager contract that will be deployed after three creations below
    uint256 nonce = vm.getNonce(address(this));
    address predictedManager = vm.computeCreateAddress(address(this), nonce + 3);

    // Deploy dependencies with the predicted manager address as caseManager
    registry = new UserRegistry(predictedManager);
    prizePool = new PrizePool(predictedManager);
    nft = new GameNFT();
    nft.setCaseManager(predictedManager);

    // Finally deploy manager at the computed address
    manager = new MysteryCaseManager(address(registry), address(prizePool), address(nft));
    }

    function test_createCase_requires_prize() public {
        vm.expectRevert(bytes("Prize required"));
        manager.createCase("Case 0", 1 days, 2);
    }

    function test_full_flow_single_winner() public {
        // create case with 3 ether prize and duration 1 day
        manager.createCase{value: 3 ether}("Find culprit", 1 days, 2);

        // Alice and Bob submit; Carol doesn't
        vm.prank(alice);
        manager.submit(0, 2); // correct
        vm.prank(bob);
        manager.submit(0, 1); // wrong

        // check participation recorded
    (,, uint256 pAlice) = registry.users(alice);
    (,, uint256 pBob) = registry.users(bob);
        assertEq(pAlice, 1);
        assertEq(pBob, 1);

        // cannot close before endTime
        address[] memory players = new address[](3);
        players[0] = alice;
        players[1] = bob;
        players[2] = carol;
        vm.expectRevert(bytes("Too early"));
        manager.closeCase(0, players);

        // fast forward
        vm.warp(block.timestamp + 2 days);

        // close and payout
        uint256 beforeAlice = alice.balance;
        manager.closeCase(0, players);

        // Alice winner gets entire pool, Bob gets nothing
        assertEq(alice.balance - beforeAlice, 3 ether, "alice prize");

        // registry updated
    (, uint256 rewardsAlice,) = registry.users(alice);
        assertEq(rewardsAlice, 3 ether, "registry reward");

        // NFT minted to Alice
        assertEq(nft.ownerOf(0), alice, "nft owner");
        uint256[] memory owned = registry.getOwnedNFTs(alice);
        assertEq(owned.length, 1, "registry nft tracked");
        assertEq(owned[0], 0, "token id tracked");
    }

    function test_full_flow_multiple_winners_even_split() public {
        manager.createCase{value: 5 ether}("Split prize", 1 days, 7);

        vm.prank(alice);
        manager.submit(0, 7);
        vm.prank(bob);
        manager.submit(0, 7);

        vm.warp(block.timestamp + 2 days);
        address[] memory players = new address[](2);
        players[0] = alice;
        players[1] = bob;

        uint256 beforeAlice = alice.balance;
        uint256 beforeBob = bob.balance;
        manager.closeCase(0, players);

        // 5 ether / 2 => 2.5 ether each; using integer division is fine since ether is 1e18
        assertEq(alice.balance - beforeAlice, 2.5 ether, "alice share");
        assertEq(bob.balance - beforeBob, 2.5 ether, "bob share");

        // NFTs minted sequentially
        assertEq(nft.ownerOf(0), alice);
        assertEq(nft.ownerOf(1), bob);
    }

    function test_submit_rules_and_reverts() public {
        manager.createCase{value: 1 ether}("Rules", 1 days, 1);

        // cannot resubmit
        vm.prank(alice);
        manager.submit(0, 1);
        vm.prank(alice);
        vm.expectRevert(bytes("Already submitted"));
        manager.submit(0, 2);

        // after close cannot submit
        vm.warp(block.timestamp + 2 days);
        address[] memory players = new address[](1);
        players[0] = alice;
        manager.closeCase(0, players);

        vm.prank(bob);
        vm.expectRevert(bytes("Case closed"));
        manager.submit(0, 1);
    }

    function test_closeCase_reverts_when_no_winners() public {
        manager.createCase{value: 1 ether}("No winners", 1 days, 9);
        vm.prank(alice);
        manager.submit(0, 1);

        vm.warp(block.timestamp + 2 days);
        address[] memory players = new address[](1);
        players[0] = alice;
        vm.expectRevert(bytes("No winners"));
        manager.closeCase(0, players);
    }
}
