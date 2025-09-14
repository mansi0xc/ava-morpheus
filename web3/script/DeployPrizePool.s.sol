// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PrizePool.sol";

contract DeployPrizePool is Script {
    function run() external {
        vm.startBroadcast();
        new PrizePool(0x603AB1b3E019F9b80eD0144D5AbE68ebb1Dc158A);
        vm.stopBroadcast();
    }
}
