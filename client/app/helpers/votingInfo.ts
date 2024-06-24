export const VotingInfo = (_ballotType : number) => {
    if (_ballotType == 1) {
            return "General Voting"
        }
        if (_ballotType == 2) {
            return "Ranked Voting"
        }
        if (_ballotType == 3) {
            return "IRV Voting"
        }
        if (_ballotType == 4) {
            return "Borda Voting"
        }
        if (_ballotType == 5) {
            return "Quadratic Voting"
        }
        if (_ballotType == 6) {
            return "Score Voting"
        }
        if (_ballotType == 7) {
            return "KemenyYoung Voting"
        }
        if (_ballotType == 8) {
            return "Schulze Voting"
        }
    else return "General Voting"
} 