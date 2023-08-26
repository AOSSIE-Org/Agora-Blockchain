import React from "react";
import { useTimer } from 'react-timer-hook';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Authentication from '../../build/Authentication.json'
import ElectionABI from '../../build/Election.json'
import ElectionOrganiser from "../../build/ElectionOrganizer.json";
import { ethers } from "ethers";


import {
	AddCandidateModal,
	Candidate,
	VoteModal,
	DeleteModal,
	UpdateElectionModal,
	InviteOrganizer
} from './modals'

import { OklahomaModal } from "./modals/OklahomaModal";
import { BordaModal } from './modals/BordaModal';
import { SchulzeModal } from "./modals/SchulzeModal";
import { IRVModal } from "./modals/IRVModal";
import { KemengYoungModal } from './modals/KemengYoungModal'


import { AVATARS, STATUS } from '../constants'
import { Status, CardItem, TimerStyled } from "./utilities";

import Navbar from './Navbar';

import '../styles/Election.scss';
import '../styles/Layout.scss';
import { Update } from "rimble-ui";
import { CONTRACTADDRESS } from "../constants";

function Election() {
	const navigate = useNavigate();
	const [isAdmin, setAdmin] = useState(false);
	const [status, setStatus] = useState(STATUS.PENDING)
	const [authStatus, setAuthStatus] = useState(false);
	const [address, setAddress] = useState();

	const search = useLocation().search;
	const electionAddress = new URLSearchParams(search).get('contractAddress');
	const organizerAddress = new URLSearchParams(search).get('organizerAddress');
	const name = new URLSearchParams(search).get('name');
	const publicAddress = new URLSearchParams(search).get('publicAddress');
	const [electionDetails, setElectionDetails] = useState({});
	const [candidates, setCandidates] = useState([])
	const [voterscount, setVotersCount] = useState(0);
	const [ballotAddress,setBallotAddress] = useState('');
	const [ballotType,setBallotType] = useState(-1);
	//to support Borda Election
	const [supportVar,setSupportVar] = useState(0);
	const [winnerDetails, setWinnerDetails] = useState([]);

	const [electionAlgorithm, setElectionAlgorithm] = useState('General');
	const [isOpenBasedElection, setIsOpenBasedElection] = useState(false);
	


	const fetchElectionDetails = async () => {
		try{
			const { ethereum } = window;
    		if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const electionContract = new ethers.Contract(
					electionAddress,
					ElectionABI.abi,
					signer
				);
						
				//fetched election details
				const electionDetail =await electionContract.getElectionInfo();
				console.log(electionDetail);
				setElectionDetails(electionDetail);

				//Election Type - Open/Invite
				const electionType  = await electionContract.getElectionType();
				console.log("Election Type - ",electionType ? "Open " : "Invite ", "Based Election");
				setIsOpenBasedElection(electionType);

				//set election status
				updateStatus(Number(electionDetail.startDate._hex), Number(electionDetail.endDate._hex));

				//set ballot type and algorithm type
				const ballotType = Number((await electionContract.getBallotType())._hex);
				setBallotType(ballotType);
				console.log("Ballot Type - ", ballotType);
				if(ballotType == 2) setElectionAlgorithm("Okalhoma");
				else if(ballotType == 4) setElectionAlgorithm("Borda");
				else if(ballotType == 5) setElectionAlgorithm("Schulze");
				else if(ballotType == 6) setElectionAlgorithm("Instant Run Off");
				else if(ballotType == 6) setElectionAlgorithm("Kemeny Young");
				else setElectionAlgorithm("General");


				//fetched all candidates
				const cand =await electionContract.getCandidates();
				setCandidates(cand);
				console.log("Candidate Details - ", cand);
				
				//total voters
				const no  = await electionContract.getVoterCount();
				setVotersCount(Number(no._hex));	
			}
		}catch(err){
			console.log(err);
		}
	}



	const getElectionOrganizer = async () => {
		try{
			const { ethereum } = window;
    		if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const organizerContract = new ethers.Contract(
					CONTRACTADDRESS,
					ElectionOrganiser.abi,
					signer
				);
						
				//fetched election details
				const electionOrg =await organizerContract.getElectionOwner(electionAddress);
				console.log("Election Organizer - ",electionOrg);
				setAdmin(electionOrg);
			}
		}catch(err){
			console.log(err);
		}
	}




	const getWinnerDetails = async () => {
		const { ethereum } = window;
		if (ethereum) {
		  const provider = new ethers.providers.Web3Provider(ethereum);
		  const signer = provider.getSigner();
		  const electionContract = new ethers.Contract(
			electionAddress,
			ElectionABI.abi,
			signer
		  );
		  let _winnerDetails = [];
		  let winners = await electionContract.getWinners();
		  console.log('winner',winners);
		  for(let winner of winners){
			console.log(Number(winner))
		  }
		  _winnerDetails.push(Number(winners[0]))
		  console.log("set winner", Number(winners[0]))

		  setWinnerDetails(_winnerDetails);
		}
	}

	const getResults = async () => {
		const edate = electionDetails.endDate;
		if(Date.now() >= edate) {
			const { ethereum } = window;
			if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const electionContract = new ethers.Contract(
				electionAddress,
				ElectionABI.abi,
				signer
			);
			await electionContract.getResult();	
			}		
		}
	}

	const updateStatus = (sdate,edate) => {
		sdate = sdate * 1000;
		edate = edate * 1000;
		const timestamp = Date.now();
		if(timestamp < sdate) {
			setStatus(STATUS.PENDING);
		} else if(timestamp < edate) {
			setStatus(STATUS.ACTIVE);
		} else {
			setStatus(STATUS.CLOSED);
		}
	}

	const getAuthStatus = async () => {
		try {
		  const { ethereum } = window;
		  if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const add  = await signer.getAddress();
			setAddress(add);
			const contract = new ethers.Contract(
			  CONTRACTADDRESS,
			  Authentication.abi,
			  signer
			);
	
			const myPass = localStorage.getItem(add);
			if(myPass == null){ 
			  navigate('/')
			}
			else{          
			  const loggedStatus = await contract.getLoggedInStatus(add, myPass); 
			  if(loggedStatus == false) {
				navigate('/'); 
			  }
			  else {
				setAuthStatus(loggedStatus);
			  }
			  console.log('Auth Status - ',loggedStatus);
			} 
		  }
		} catch (err) {
		  console.log(err);
		}
	  }

	const functionCall = async () => {
		if(authStatus){
			await fetchElectionDetails();
			await getElectionOrganizer();
		}
		else {
			await getAuthStatus();
		}
	}

	useEffect(() => {
		functionCall();
	},[authStatus])

	const MyTimer = ({ sdate, edate }) => {
		sdate *= 1000;
		edate *= 1000;
		
		let expiryTimestamp = 0;
		if(Date.now() < sdate) {
			expiryTimestamp = sdate;
		} else {
			expiryTimestamp = edate;
		}
		
		const {
			seconds,
			minutes,
			hours,
			days,
			start
		} = useTimer({ expiryTimestamp, onExpire: () => {expiryTimestamp = edate;
			//  Date.now() >= edate && winnerDetails.length === 0 && getResults()
			}, 
			 autostart: "false"});
		
		useEffect(() => {
			start();
		}, [expiryTimestamp])
		
		return (
			<TimerStyled seconds={seconds} minutes={minutes} hours={hours} days={days} />
		);
	}

	return (
		<div style={{backgroundColor: "#f7f7f7", minHeight: "100%"}}>
			<Navbar header={name} infoText={publicAddress} organizerAddress={organizerAddress} pictureUrl="/assets/avatar.png" address={address}/>
			
			<div style={{padding: "30px"}}>
				<div style={{width: "100%"}}>
					<div style={{float: "left"}}>
						<div style={{display: "flex"}}>
							<h5 style={{marginBottom: "0px", width: "max-content"}}>{electionDetails.name}</h5>
							<Status
								status={status}
								text={status.charAt(0).toUpperCase() + status.slice(1)}
							/>
						</div>
						<font size="2" className="text-muted" style={{marginTop: "0px"}}>{electionAddress}</font>
					</div>

					<div style={{float: "right", display: "flex"}}>
						<MyTimer style={{marginRight:"15%"}} sdate = {electionDetails.startDate} edate = {electionDetails.endDate}/>
						{isAdmin === publicAddress && status == STATUS.PENDING &&
							<div style={{display:'flex'}}>
								{isOpenBasedElection == true && <DeleteModal orgnizerAddress={organizerAddress} electionAddress={electionAddress}/>}
								<UpdateElectionModal contractAddress={electionAddress} electionDetails={electionDetails} functionCall={functionCall}/>
								<InviteOrganizer organizerAddress={organizerAddress} electionAddress={electionAddress}/>
							</div>
						}
						
						{ballotType===1 &&
							<VoteModal Candidate = {Candidate} candidates = { candidates } status = { status } contractAddress = {electionAddress} ballotAddress={ballotAddress}/>
						}
						{ballotType===2 &&
							<OklahomaModal Candidate = {Candidate} candidates = { candidates } status = { status } contractAddress = {electionAddress} ballotAddress={ballotAddress}/>
						}
						{ballotType===4 &&
							<BordaModal Candidate = {Candidate} candidates = { candidates } status = { status } contractAddress = {electionAddress} ballotAddress={ballotAddress}/>
						}
						{ballotType===5 &&
							<SchulzeModal Candidate = {Candidate} candidates = { candidates } status = { status } contractAddress = {electionAddress} ballotAddress={ballotAddress}/>
						}
						{ballotType===6 &&
							<IRVModal Candidate = {Candidate} candidates = { candidates } status = { status } contractAddress = {electionAddress} ballotAddress={ballotAddress}/>
						}
						{ballotType===7 &&
							<KemengYoungModal Candidate = {Candidate} candidates = { candidates } status = { status } contractAddress = {electionAddress} ballotAddress={ballotAddress}/>
						}
					</div>
				</div>

				<br/><br/><br/>

				<div className="cardContainer row">
					<CardItem headerValue={electionAlgorithm} descriptor="Algorithm" imgUrl="/assets/totalElections.png"/>

					<CardItem headerValue={new Date(electionDetails?.startDate * 1000).toLocaleString()} descriptor="Start date" imgUrl="/assets/activeElections.png" imgBackground="#eaffe8"/>

					<CardItem headerValue={new Date(electionDetails?.endDate * 1000).toLocaleString()} descriptor="End date" imgUrl="/assets/endedElections.png" imgBackground="#ffe8e8"/>

					<CardItem headerValue={voterscount } descriptor="Total voters" imgUrl="/assets/pendingElections.png" imgBackground="#fffbd1"/>
				</div>

				<div className="layoutBody row">
					<div className="lhsLayout" style={{overflowY: "scroll"}}>
						{
							status == STATUS.CLOSED
							?
							<div>
								<span onClick={getResults} className="voteButton" style={{float: "right", marginTop: "10px", width: "100px"}}>Get Results</span>
								<span onClick={getWinnerDetails} className="voteButton" style={{float: "right", marginTop: "10px", width: "100px"}}>Show Winner</span>
							</div>

							:
							<span onClick={() => {console.log("Result only calculated after election ends");}} className="voteButton voteButtonDisabled" style={{float: "right", marginTop: "10px", width: "100px"}}>Get Result</span>
						}

						{
							winnerDetails.length > 0 && 
							<>
								<div className="lhsHeader" style={{marginTop: "10px"}}>
									<h5>Results</h5>
								</div>

								<br/>

								<div style={{display: "flex", justifyContent: "space-around", flexWrap: "wrap"}}>
									{
										winnerDetails?.map((candidate) => (
											candidate?.name !== ""
											&&
									
											<Candidate
												name={candidate?.name}
												id={candidate}
												about={candidate?.about}
												imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'}
											/> 
										))
									}	
								</div>

								<hr/>
							</>
						}

						<div className="lhsHeader" style={{marginTop: "10px"}}>
							<h5>Election Details</h5>
						</div>

						<div className="lhsBody" style={{textAlign: "justify"}}>
							<font size="2" className="text-muted">
								<p>
									{electionDetails.description}
								</p>
							</font>

							<br/>

							<h5>About {electionAlgorithm} Algorithm</h5>
							<font size="2" className="text-muted">
								{ballotType===1?`In General or Regular voting algorithm, winner(s) is(are) chosen
								from the list of candidates according to the number of votes they
								get. Those with the maximum number of votes are chosen as the winner
								of the candidates. If 2 or more candidates are eligible for winning,
								then it depends upon the organization to whether choose a candidate by
								a draw or by any other means`:ballotType==2?`The Oklahoma primary electoral system is
								a voting system used to elect one winner from a pool of candidates using preferential
								voting. Voters rank candidates in order of preference, and their votes are initially 
								allocated to their first-choice candidate. If, after this initial count, 
								no candidate has a majority of votes cast, a mathematical formula comes into play.
								`:ballotType==4?`The Borda count method is a point-based election system in which voters number their 
								preferred choices in order. The Borda count method does not rely on the majority criterion
								 or Condorcet criterion. The majority criterion states if one choice gets the majority of
								  the first-place votes, that choice should be declared the winner. In the Borda count 
								  method it is possible, and sometimes happens, that the first choice option would get 
								  the majority of the votes, but once all of the votes are considered, that choice is not the 
								  winner.`:ballotType==5?`The Schulze method is a Condorcet method, which means that if there 
								  is a candidate who is preferred by a majority over every other candidate in pairwise comparisons,
								   then this candidate will be the winner when the Schulze method is applied. The output of the 
								   Schulze method gives an ordering of candidates.`:ballotType==6?`Instant-runoff voting (IRV), 
								   also called ranked-choice voting, is a type of ranked preferential voting method used in single-member
								    districts in which there are more than two candidates. In IRV elections, voters rank the candidates 
									in order of preference. Ballots are initially counted to establish the number of votes for each candidate. 
									If a candidate has more than half of the first-choice votes, that candidate wins. If not, then the candidate 
									with the fewest votes is eliminated, and the voters who selected that candidate as their first choice 
									have their votes added to the total of the candidate who was their next choice. That process continues 
									until one candidate has more than half of the votes, and that person is declared the winner.`:
									`The Kemeny–Young method is an electoral system that uses preferential ballots and pairwise comparison counts 
									to identify the most popular choices in an election. It is a Condorcet method because if there is a 
									Condorcet winner, it will always be ranked as the most popular choice.`}
								
							</font>
						</div>
					</div>

					<div className="rhsLayout" style={{overflowY: "scroll"}}>
						<div className="lhsHeader" style={{marginTop: "10px", display: 'flex', justifyContent: 'space-between'}}>
							<h5 style={{width: "60%"}}>Candidates ({candidates.length})</h5>
							{
								isAdmin == publicAddress && status == STATUS.PENDING &&	<AddCandidateModal organizerAddress={organizerAddress}  electionAddress={electionAddress} functionCall={functionCall}/>
							}
						</div>

						<br/>

						{
							candidates?.map((candidate, index) => (
								<Candidate
									name={candidate?.name}
									id={Number(candidate?.candidateID._hex)}
									about={candidate?.description}
									imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'}
									index={index}
									electionAddress={electionAddress}
									functionCall = {functionCall}
								/> 
								//name, id, about, imageUrl, index, electionAddress, functionCall
							))
						}
					</div>
				</div>

				<br/>
			</div>
		</div>
	)
}

export default Election;