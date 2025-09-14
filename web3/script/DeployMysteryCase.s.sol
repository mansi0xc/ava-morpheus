// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MysteryCaseManager.sol";

contract DeployMysteryCase is Script {
    function run() external {
        vm.startBroadcast();
        new MysteryCaseManager(0xfD4dfA0279Dc5466ead1733Ab4b96b817f9Bb6Cb, 0xEA8Fdf5b6B29157f177B4Fe9234Caf2A684DAfa5, 0xCe99350839F672286885aa0626372575B671e57E);
        vm.stopBroadcast();
    }
}
