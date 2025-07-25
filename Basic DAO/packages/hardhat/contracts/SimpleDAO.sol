// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SimpleDAO
 * @dev A basic DAO contract with proposal creation, voting, and execution capabilities
 */
contract SimpleDAO {
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 amount; // Amount of ETH to transfer (if applicable)
        address payable recipient; // Recipient of funds (if applicable)
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool exists;
        mapping(address => bool) hasVoted;
        mapping(address => bool) voteChoice; // true = for, false = against
    }

    struct Member {
        bool isMember;
        uint256 joinedAt;
        uint256 votingPower; // Number of votes they can cast
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => Member) public members;
    
    uint256 public nextProposalId = 1;
    uint256 public memberCount;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_VOTING_POWER = 1;
    uint256 public quorum = 51; // 51% quorum required
    
    address public admin;
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string description
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 votingPower
    );
    
    event ProposalExecuted(uint256 indexed proposalId, bool success);
    
    event MemberAdded(address indexed member, uint256 votingPower);
    event MemberRemoved(address indexed member);
    
    error NotMember();
    error ProposalNotFound();
    error VotingEnded();
    error VotingNotEnded();
    error AlreadyVoted();
    error AlreadyExecuted();
    error QuorumNotMet();
    error ProposalFailed();
    error OnlyAdmin();
    error AlreadyMember();
    error TransferFailed();

    modifier onlyMember() {
        if (!members[msg.sender].isMember) revert NotMember();
        _;
    }

    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdmin();
        _;
    }

    modifier proposalExists(uint256 _proposalId) {
        if (!proposals[_proposalId].exists) revert ProposalNotFound();
        _;
    }

    constructor() {
        admin = msg.sender;
        // Add admin as first member
        members[msg.sender] = Member({
            isMember: true,
            joinedAt: block.timestamp,
            votingPower: 1
        });
        memberCount = 1;
    }

    /**
     * @dev Add a new member to the DAO (only admin can add members initially)
     */
    function addMember(address _member, uint256 _votingPower) external onlyAdmin {
        if (members[_member].isMember) revert AlreadyMember();
        require(_votingPower >= MIN_VOTING_POWER, "Voting power too low");

        members[_member] = Member({
            isMember: true,
            joinedAt: block.timestamp,
            votingPower: _votingPower
        });
        
        memberCount++;
        emit MemberAdded(_member, _votingPower);
    }

    /**
     * @dev Remove a member from the DAO
     */
    function removeMember(address _member) external onlyAdmin {
        if (!members[_member].isMember) revert NotMember();
        
        delete members[_member];
        memberCount--;
        emit MemberRemoved(_member);
    }

    /**
     * @dev Create a new proposal
     */
    function createProposal(
        string memory _description,
        uint256 _amount,
        address payable _recipient
    ) external onlyMember returns (uint256) {
        uint256 proposalId = nextProposalId++;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.description = _description;
        newProposal.amount = _amount;
        newProposal.recipient = _recipient;
        newProposal.startTime = block.timestamp;
        newProposal.endTime = block.timestamp + VOTING_PERIOD;
        newProposal.exists = true;

        emit ProposalCreated(proposalId, msg.sender, _description);
        return proposalId;
    }

    /**
     * @dev Vote on a proposal
     */
    function vote(uint256 _proposalId, bool _support) 
        external 
        onlyMember 
        proposalExists(_proposalId) 
    {
        Proposal storage proposal = proposals[_proposalId];
        
        if (block.timestamp > proposal.endTime) revert VotingEnded();
        if (proposal.hasVoted[msg.sender]) revert AlreadyVoted();

        proposal.hasVoted[msg.sender] = true;
        proposal.voteChoice[msg.sender] = _support;
        
        uint256 votingPower = members[msg.sender].votingPower;
        
        if (_support) {
            proposal.votesFor += votingPower;
        } else {
            proposal.votesAgainst += votingPower;
        }

        emit VoteCast(_proposalId, msg.sender, _support, votingPower);
    }

    /**
     * @dev Execute a proposal after voting period ends
     */
    function executeProposal(uint256 _proposalId) 
        external 
        proposalExists(_proposalId) 
    {
        Proposal storage proposal = proposals[_proposalId];
        
        if (block.timestamp <= proposal.endTime) revert VotingNotEnded();
        if (proposal.executed) revert AlreadyExecuted();

        // Calculate total votes and check quorum
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 totalVotingPower = getTotalVotingPower();
        
        if (totalVotes * 100 < totalVotingPower * quorum) revert QuorumNotMet();
        if (proposal.votesFor <= proposal.votesAgainst) revert ProposalFailed();

        proposal.executed = true;

        bool success = true;
        // Execute the proposal (transfer funds if specified)
        if (proposal.amount > 0 && proposal.recipient != address(0)) {
            if (address(this).balance >= proposal.amount) {
                (bool sent, ) = proposal.recipient.call{value: proposal.amount}("");
                if (!sent) success = false;
            } else {
                success = false;
            }
        }

        emit ProposalExecuted(_proposalId, success);
    }

    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 _proposalId) external view returns (
        uint256 id,
        address proposer,
        string memory description,
        uint256 amount,
        address recipient,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 startTime,
        uint256 endTime,
        bool executed,
        bool isActive
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.description,
            proposal.amount,
            proposal.recipient,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.startTime,
            proposal.endTime,
            proposal.executed,
            block.timestamp <= proposal.endTime && !proposal.executed
        );
    }

    /**
     * @dev Check if an address has voted on a proposal
     */
    function hasVoted(uint256 _proposalId, address _voter) 
        external 
        view 
        returns (bool voted, bool choice) 
    {
        return (
            proposals[_proposalId].hasVoted[_voter],
            proposals[_proposalId].voteChoice[_voter]
        );
    }

    /**
     * @dev Get total voting power of all members
     */
    function getTotalVotingPower() public view returns (uint256) {
        // In a real implementation, you'd want to track this more efficiently
        // For simplicity, this assumes each member has equal voting power
        // You could extend this to sum up all members' voting power
        uint256 total = 0;
        // Note: This is a simplified version. In practice, you'd need to iterate
        // through all members or maintain a running total
        return memberCount; // Simplified - assumes each member has 1 vote
    }

    /**
     * @dev Set quorum percentage (only admin)
     */
    function setQuorum(uint256 _quorum) external onlyAdmin {
        require(_quorum > 0 && _quorum <= 100, "Invalid quorum percentage");
        quorum = _quorum;
    }

    /**
     * @dev Allow the DAO to receive ETH
     */
    receive() external payable {}

    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Emergency withdraw (only admin) - for initial setup phase
     */
    function emergencyWithdraw() external onlyAdmin {
        (bool success, ) = payable(admin).call{value: address(this).balance}("");
        if (!success) revert TransferFailed();
    }
}