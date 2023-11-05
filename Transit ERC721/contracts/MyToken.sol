// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC721, ERC721URIStorage, ERC721Burnable {
    uint256 public mintFee;  // Amount required to pay for minting an NFT
    uint256 public mintTimeout;  // Time after which minted NFTs will be burned
    string public fixedImageURI = "https://gateway.pinata.cloud/ipfs/Qmb8hKSKakGqVk7h877xdyzVJhnb6cmzfjpVfS6xCFLqNg/0.jpg";  // Fixed IPFS link for the image

    constructor(uint256 _mintFee, uint256 _mintTimeout)
    ERC721("MyToken", "MTK")
{
    mintFee = _mintFee;
    mintTimeout = _mintTimeout;
}


    function setMintFee(uint256 _newMintFee) public {
        mintFee = _newMintFee;
    }

    function setMintTimeout(uint256 _newMintTimeout) public  {
        mintTimeout = _newMintTimeout;
    }

    function setFixedImageURI(string memory _newImageURI) public  {
        fixedImageURI = _newImageURI;
    }

    function mintNFT(address to, uint256 tokenId, string memory metadata)
        public
        payable
    {
        require(msg.value >= mintFee, "Insufficient payment");
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadata);

        // Schedule the burn of the NFT after mintTimeout
        _burnAfterTimeout(to, tokenId);
    }

    function _burnAfterTimeout(address owner, uint256 tokenId) internal {
        uint256 burnTime = block.timestamp + mintTimeout;
        _mintTimeouts[tokenId] = burnTime;
    }

    function burnNFT(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You don't own this NFT");
        require(_mintTimeouts[tokenId] != 0 && _mintTimeouts[tokenId] < block.timestamp, "NFT cannot be burned yet");
        _burn(tokenId);
    }

    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    mapping(uint256 => uint256) private _mintTimeouts; // Mapping for NFT mint timeouts
}
