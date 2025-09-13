// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Game NFT Contract
/// @notice NFTs rewarded to winners of mystery cases
contract GameNFT is ERC721, Ownable {
    uint256 public nextId;
    address public caseManager;

    constructor() ERC721("Whisper Game NFT", "WGN") Ownable(msg.sender) {}

    modifier onlyCaseManager() {
        require(msg.sender == caseManager, "Not case manager");
        _;
    }

    function setCaseManager(address _caseManager) external onlyOwner {
        caseManager = _caseManager;
    }

    function mint(address to) external onlyCaseManager returns (uint256) {
        uint256 tokenId = nextId++;
        _safeMint(to, tokenId);
        return tokenId;
    }
}
