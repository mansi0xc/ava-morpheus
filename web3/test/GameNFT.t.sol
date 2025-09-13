// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {GameNFT} from "../src/GameNFT.sol";

contract GameNFTTest is Test {
    GameNFT nft;
    address owner = address(this);
    address manager = address(0xCA5E);
    address alice = address(0xA11CE);

    function setUp() public {
        nft = new GameNFT();
        // only owner can set case manager; owner is this contract via Ownable(msg.sender)
        nft.setCaseManager(manager);
    }

    function test_onlyOwner_can_set_case_manager() public {
        vm.prank(alice);
        vm.expectRevert(); // Ownable revert
        nft.setCaseManager(alice);

        // owner can update
        nft.setCaseManager(alice);
        // set back to manager for other tests
        nft.setCaseManager(manager);
    }

    function test_onlyCaseManager_can_mint() public {
        vm.prank(alice);
        vm.expectRevert(bytes("Not case manager"));
        nft.mint(alice);

        vm.prank(manager);
        uint256 id0 = nft.mint(alice);
        assertEq(id0, 0, "first id");
        assertEq(nft.ownerOf(id0), alice, "owner of id0");

        vm.prank(manager);
        uint256 id1 = nft.mint(alice);
        assertEq(id1, 1, "second id");
    }
}
