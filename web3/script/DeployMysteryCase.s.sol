// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MysteryCaseManager.sol";

contract DeployMysteryCase is Script {
    function run() external {
        vm.startBroadcast();
        new MysteryCaseManager(0x31893F27c8461f68a1088e3208ff2edb6Bd0934F, 0xe1c84b7e216bc78F0A9Bc8D045aa4e7e37cB46Eb, 0xCe99350839F672286885aa0626372575B671e57E);
        vm.stopBroadcast();
    }
}
