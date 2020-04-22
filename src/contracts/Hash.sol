pragma solidity ^0.5.16;

contract Hash {
    string hash;

    function set(string memory _hash) public {
        hash = _hash;
    }

    function get() public view returns (string memory) {
        return hash;
    }
}

