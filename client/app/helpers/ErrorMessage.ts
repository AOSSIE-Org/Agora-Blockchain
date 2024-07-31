const errorMessages = {
  ElectionInactive: "Election is Not Active",
  OwnerPermissioned: "Must be Owner of Election",
  AlreadyVoted: "Vote Already Casted",
  GetVotes: "Error in Getting Voted",
  ElectionIncomplete: "Election is still Active",
  OnlyOwner: "Must be Owner of Election",
  NotEnoughBalance: "Link Tokens exhausted",
  VoteInputLength: "Incorrect Length of Vote ",
  IncorrectCredits: " Incorrect Credits Given",
  NoCandidates: "No Candidates to Vote",
  ChainMismatchError: "Switch to Mainnet!",
};

export const ErrorMessage = (error: any) => {
  for (const [key, message] of Object.entries(errorMessages)) {
    if (error.message.includes(key)) {
      return message;
    }
  }
  return "Something went wrong. Please try again.";
};
