// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ReputeChainAttestation
 * @dev Stores an immutable record of user reputation scores anchored to IPFS metadata.
 */
contract ReputeChainAttestation {
    struct Attestation {
        uint256 score;
        string ipfsHash;
        uint256 timestamp;
        address issuer;
    }

    // Mapping of user wallet addresses to their attestations
    mapping(address => Attestation) public attestations;

    // Admin address (usually the backend server's wallet)
    address public admin;

    event AttestationCreated(
        address indexed user,
        uint256 score,
        string ipfsHash,
        uint256 timestamp
    );

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can create attestations");
        _;
    }

    /**
     * @dev Anchors a reputation score and metadata hash for a user.
     * @param user The user's wallet address
     * @param score The 0-100 composite score
     * @param ipfsHash The IPFS CID containing the detailed JSON metadata
     */
    function anchorReputation(address user, uint256 score, string memory ipfsHash) external onlyAdmin {
        require(score <= 100, "Score must be between 0 and 100");

        attestations[user] = Attestation({
            score: score,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            issuer: msg.sender
        });

        emit AttestationCreated(user, score, ipfsHash, block.timestamp);
    }

    /**
     * @dev Gets the latest attestation for a user
     * @param user The user's wallet address
     */
    function getAttestation(address user) external view returns (Attestation memory) {
        return attestations[user];
    }
}
