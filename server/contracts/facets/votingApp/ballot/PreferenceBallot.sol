// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Ballot.sol';
import '../../Election.sol';

/*
    Each voter gives preferences to, or ranks the candidates.
    Each vote has a weight - the preference
*/

contract PreferenceBallot is Ballot{

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------

    // preference => (candidateID => vote count)
    // gives the number of votes of a candidate in each preference
    mapping (uint=> mapping (uint => uint)) votes;

    // voter => (candidateID => vote status)
    mapping (address => mapping (uint => bool))voterCandidateVoteStatus;
    
    mapping (address => uint)voterVoteCount;

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------
    
    function vote(address _voter, uint _candidate, uint _preference,uint[] memory voteArr) external  override{
        require(voteStatus[_voter]==false,"Voter already voted");
        require(voterCandidateVoteStatus[_voter][_candidate]==false,"Voter already voted for this candidate");
        require(voterVoteCount[_voter]<candidates.length,"Max votes already casted by voter");
        
        votes[_preference][_candidate]+=1;

        voterVoteCount[_voter]+=1;
        voterCandidateVoteStatus[_voter][_candidate]=true;
        if(voterVoteCount[_voter]==candidates.length) {
            voteStatus[_voter]=true;
        }
    }
    
    function getVoteCount(uint _candidate, uint _preference) external  override view returns(uint){
        return votes[_preference][_candidate];
    }
    
    function getVoteArr() external override returns(uint[][] memory  ){
        uint [][] memory arr;
        return arr;
    }
}