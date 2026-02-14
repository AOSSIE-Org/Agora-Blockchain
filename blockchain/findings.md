# Findings

### [C-1] There is no way add Validated User, Leading to result manipulation.

**Description:**
There is NO function for OWNER to add a USER with valid credentials. As of now anyone can come and vote.
```javascript 
function userVote(uint[] memory voteArr) external electionInactive {
        if (userVoted[msg.sender]) revert Election_AlreadyVoted();
        if (ballotInitialized == false) {
            ballot.init(candidates.length);
            ballotInitialized = true;
        }
        ballot.vote(voteArr);
        userVoted[msg.sender] = true;
        totalVotes++;
    }
```
Creating a new metamask account is free. A single user can create multiple accounts and vote.

**Impact**
Result can be influenced, Winners can be changed.  As the election is expected to be held fair but in this case a single user can change the entire result.

**Recommended Mitigation:**
- Add a function `addUser()`, only OWNER or specific user can add users
- `mapping(address => bool)`, it should be checked if user initiate the vote. 

This will ensure fair voting. Only selected candidates will be able to vote.




### [L-1] Function `Election::removeCandidate` - There is no proper way for owner to get the Candidate Id. 

**Description:** 
```javascript 
function removeCandidate(uint _id) external onlyOwner electionStarted {
    if (_id >= candidates.length) revert Election_InvalidCandidateID();
    candidates[_id] = candidates[candidates.length - 1]; // Replace with last element
    candidates.pop(); 
}
```
Function `Election::removeCandidate`  allows the contract owner to remove a candidate by their index in the candidates array. However, the contract does not maintain a mapping from candidate address or name to their array index. This forces the owner to manually track the index of candidates in a dynamic array, which is error-prone and inefficient, especially as the array grows.

**Impact**
- Searching `_id` will take more time and will be inefficient for owner to look over a large number of list. 

**Recommended Mitigation:** 
Use mapping instead of as it is more gas efficeint and efficient searching.
`mapping(candidateAddress => CandidateStruct)`

## Gas Optimization 


### [G-1]  Reading Storage variable again and again in `Election` contract, increases gas cost. 

**Description**
```javascript 
   modifier electionInactive() {
        if (
            block.timestamp < electionInfo.startTime ||
            block.timestamp > electionInfo.endTime
        ) revert Election_ElectionInactive();
        _;
    }

    modifier electionStarted() {
        if (block.timestamp > electionInfo.startTime) revert Election_ElectionInactive();
        _;
    }
```

`electionInfo.startTime and electionInfo.startTime ` are read again and again whenever `electionInactive()` and  `electionStarted()`. Reading storage variable costs gas. Modifiers are executed every time a function using them is called.

**Recommended Mitigation:** 
In order to reolve this we can have IMMUTABLE variable but that can be only defined in `constructor()` and `Election` contract does not have any constructor. 
For this we need to change a bit architecture. 
Some variables that can be declared IMMUTABLE - 
- uint _resultType,
- uint _electionId,
- address _ballot,
- address _owner,
- address _resultCalculator

Contract architecture needs to be changed too inorder to make it more gas optimized - like using `mapping` instead of array. 

### [G-2] Reading `Election::removeCandidate::candidates.length` twice, increases gas cost.

**Description**
```javascript 
function removeCandidate(uint _id) external onlyOwner electionStarted {
    if (_id >= candidates.length) revert Election_InvalidCandidateID();
    candidates[_id] = candidates[candidates.length - 1]; // Replace with last element
    candidates.pop(); 
}
```
`candidates.length` is read twice. 

**Recommended Mitigation:** Use a cache variable 
```diff 
+ uint256 candidatesLength = candidates.length 
-  if (_id >= candidates.length)
+  if (_id >= candidatesLength)
- candidates[_id] = candidates[candidates.length - 1];
+ candidates[_id] = candidates[candidatesLength - 1];

```javascript 
function removeCandidate(uint _id) external onlyOwner electionStarted {

@>  uint256 candidatesLength = candidates.length 
@>    if (_id >= candidatesLength) revert Election_InvalidCandidateID();
@>    candidates[_id] = candidates[candidatesLength - 1]; // Replace with last element
    candidates.pop(); 
}
```

### [I-1] Adding events in `ElectionFactory` contract. As it will be helpful in frontend integration. 

**Description**
```diff 
+  L19 event ElectionFactory_electionCreated(address indexed owner);
+  L20 event ElectionFactory_electionDeleted(uint256 indexed electionId);
+  L87 emit ElectionFactory_electionCreated(msg.sender);
+  L90 emit ElectionFactory_electionDeleted(_electionId);
```


### [I-2]  Floating pragmas

**Description:** 
Contracts should use strict versions of solidity. Locking the version ensures that contracts are not deployed with a different version of solidity than they were tested with. An incorrect version could lead to uninteded results.

https://swcregistry.io/docs/SWC-103/ 

**Recommended Mitigation:** 
Lock up pragma versions-

``` diff
- pragma solidity ^0.8.24;
+ pragma solidity 0.8.24;

- pragma solidity 0.8.20;
+ pragma solidity 0.8.24;
```

### [I-3] Non-Namespaced Custom Error Declarations Reduce Code Maintainability and Clarity

**Description:** 
The codebase currently uses simple error declarations (e.g., error OnlyOwner();) without contract name prefixes. This approach lacks the contextual information that namespaced errors provide, which is especially important in larger codebases with multiple contracts.

**Impact**
- Increased risk of error name collisions as the project scales
- More difficult to trace error sources during code review 

**Recommended Mitigation:** 
Use Namespaced Custom Error 
```javascript 
contract ElectionFactory is CCIPReceiver {
    error OnlyOwner();
    
}
```

``` diff 
- error OnlyOwner();
+ error ElectionFactory_OnlyOwner();
```