import { useEffect, useState } from "react";
import {
  ELECTION_CONTRACT,
  CURRENT_ELECTION
} from "./constants";

export default function ElectionCall({
  drizzleVariables,
  pushNewContracts,
  eId,
  UserContract,
  userInfo,
  addElectionContract,
}) {
  const {drizzle, drizzleState, contracts, account} = drizzleVariables;

  // List of ElectionContract instances
  const ElectionContracts = Object.keys(drizzle?.contracts)
    ?.filter((contract) => contract.split(".")[0] === ELECTION_CONTRACT)
    .reduce((obj, key, index) => {
      obj[key] = drizzle?.contracts[key]?.methods;
      obj[key].contractAddress = drizzle?.contracts[key]?.address;
      return obj;
    }, {});
  const ElectionSubscribers = drizzleState
    ? Object.keys(drizzleState?.contracts)
        ?.filter((subscriber) => subscriber.split(".")[0] === ELECTION_CONTRACT)
        .reduce((obj, key) => {
          obj[key] = drizzleState?.contracts[key];
          return obj;
        }, {})
    : {};

  // Current election contract instance
  const CurrentElection = drizzle?.contracts[CURRENT_ELECTION]?.methods;
  const CurrentElectionSubscriber = drizzleState?.contracts[CURRENT_ELECTION];

  // Cache keys
  const [electionDetailKeys, setElectionDetailKeys] = useState([]);
  const [currentElectionKey, setCurrentElectionKey] = useState(null);

  // Cache calls (values)
  const [electionDetails, setElectionDetails] = useState([]);
  const [currentElectionDetails, setCurrentElectionDetails] = useState(null);

  // Setting up election contract key and value
  useEffect(() => {
    let newKeys = [];
    for (let i = 0; i < eId; i++) {
      newKeys[i] = ElectionContracts[
        `${ELECTION_CONTRACT}.${userInfo.id}.${i}`
      ]?.getElectionDetails?.cacheCall({ from: account });
      setElectionDetailKeys(newKeys);
    }

    let newInfos = [];
    for (let i = 0; i < eId; i++) {
      newInfos[i] =
        ElectionSubscribers[
          `${ELECTION_CONTRACT}.${userInfo.id}.${i}`
        ]?.getElectionDetails[electionDetailKeys[i]]?.value;
      if (newInfos[i]) {
        newInfos[i] = {
          ...newInfos[i],
          contractAddress:
            ElectionContracts[`${ELECTION_CONTRACT}.${userInfo.id}.${i}`]
              ?.contractAddress,
        };
      }
      setElectionDetails(newInfos);
    }
  }, [JSON.stringify(ElectionSubscribers)]);

  // Setting up current election contract cache key and value
  useEffect(() => {
    setCurrentElectionKey(
      CurrentElection?.getElectionDetails?.cacheCall({ from: account })
    );
    setCurrentElectionDetails(
      CurrentElectionSubscriber?.getElectionDetails[currentElectionKey]?.value
    );
  }, [CurrentElectionSubscriber]);

  // Function to push election contracts to contract array
  const pushElectionContracts = async () => {
    let electionAddresses;
    let promises = [];
    for (let i = 0; i < eId; i++) {
      promises.push(UserContract?.Elections(i)?.call());
    }
    electionAddresses = await Promise.all(promises);
    for (let i = 0; i < eId; i++) {
      pushNewContracts(
        `${ELECTION_CONTRACT}.${userInfo.id}.${i}`,
        electionAddresses[i],
        ELECTION_CONTRACT
      );
    }
  };

  // Calling the pushElectionConracts() function whenever there is new election
  useEffect(() => {
    if (!isNaN(eId)) {
      pushElectionContracts();
    }
  }, [eId]);

  const getCurrentElection = (contractAddress) => {
    addElectionContract(CURRENT_ELECTION, contractAddress);
  };

  return {
    electionDetails,
    getCurrentElection,
    CurrentElection,
    currentElectionDetails,
  };
}
