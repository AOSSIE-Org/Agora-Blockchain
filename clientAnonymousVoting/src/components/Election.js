import React from "react";
import { useTimer } from 'react-timer-hook';
import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import ElectionABI from '../build/Election.sol/Election.json'
import ElectionOrganiser from "../build/ElectionOrganizer.json";
import { ToastContainer ,toast} from 'react-toastify';
import { successtoast,dangertoast } from "./utilities/Toasts";

import { ethers } from "ethers";


import {
	AddCandidateModal,
	Candidate,
	VoteModal,
	DeleteModal,
	UpdateElectionModal,
} from './modals'

import { OklahomaModal } from "./modals/OklahomaModal";
import {BordaModal} from './modals/BordaModal';

import { AVATARS, STATUS } from './constants'
import { Status, CardItem, TimerStyled } from "./utilities";

import Navbar from './Navbar';

import './styles/Election.scss';
import './styles/Layout.scss';
import { Update } from "rimble-ui";
import { getVotingProcess ,getSignalsForNullifier } from '../web3/contracts';
// import { getVotingProcessContract } from '../../web3/contracts';


function Election() {
	const [isAdmin, setAdmin] = useState(false);
	const [status, setStatus] = useState(STATUS.PENDING)

	const search = useLocation().search;
	const electionId = new URLSearchParams(search).get('electionId');

	const [electionDetails, setElectionDetails] = useState({});
	const [candidates, setCandidates] = useState([])
	const [voterscount, setVotersCount] = useState(0);
	const [ballotAddress,setBallotAddress] = useState('');
	const [ballotType,setBallotType] = useState(1);
	//to support Borda Election
	const [supportVar,setSupportVar] = useState(0);
	const [votingProcess,setVotingProcess] = useState({});
	const [votesPerProposal, setVotesPerProposal] = useState(null);

	



	const fetchElectionDetails = async () => {
		try{

			let electionDetail = await getVotingProcess(electionId);
			updateStatus(Number(electionDetail.startDate._hex), Number(electionDetail.endDate._hex));
			setElectionDetails(electionDetail);

			console.log('electionDetail',electionDetail);

		}catch(err){
			console.log(err);
		}
	}



	const [winnerDetails, setWinnerDetails] = useState([
		
	]);

	const getWinnerDetails = async () => {
		let id ;
		try{

			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
			
				}
			}catch(e){
				dangertoast(id ,"Falied to get winner details");
				console.log(e);
			}
		}
			
			const getResults = async () => {
				let id ;
				try{
					
			const edate = electionDetails.endDate;
			if(Date.now() >= edate) {
				const { ethereum } = window;
				if (ethereum) {
					const provider = new ethers.providers.Web3Provider(ethereum);
					const signer = provider.getSigner();
					id = toast.loading("Processing Your Request",{theme: "dark",position: "top-center"})
					
						successtoast(id ,"Results has been Calculated");
						
					}
					
				}
			}catch(e){
				dangertoast(id ,"Falied to get results");
				console.log(e);
			}
		}

	useEffect(() => {
		if(1) {
			setAdmin(true);
		}
	}, [])
	useEffect(() => {
        getVotingProcess(electionId).then((result) => {
            console.log("Voting process electionId: ", electionId);
            console.log("Voting process: ", result);
            setVotingProcess(result);
        })
		getSignalsForNullifier(electionId).then((result) => {
			setVotesPerProposal(result);
		});
		
	},[])

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

	
	useEffect(() => {
		fetchElectionDetails();
	},[])

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
			// updateStatus((electionDetails?.startDate._hex), Number(electionDetails?.endDate._hex)); 
		}, [expiryTimestamp])
		
		return (
			<TimerStyled seconds={seconds} minutes={minutes} hours={hours} days={days} />
		);
	}

	return (
		<div style={{backgroundColor: "#f7f7f7", minHeight: "100%"}}>
			<ToastContainer style={{zIndex:"99999"}} />
			<Navbar header={''} infoText={''}  pictureUrl="/assets/avatar.png"/>
			<div style={{padding: "30px"}}>
				<div style={{width: "100%"}}>
					<div style={{float: "left"}}>
						<div style={{display: "flex"}}>
							<h5 style={{marginBottom: "0px", width: "max-content"}}>{"Test Election"}</h5>
							<Status
								status={status}
								text={status.charAt(0).toUpperCase() + status.slice(1)}
							/>
						</div>
						{/* <font size="2" className="text-muted" style={{marginTop: "0px"}}>{contractAddress}</font> */}
					</div>


					<div style={{float: "right", display: "flex"}}>
						<MyTimer style={{marginRight:"15%"}} sdate = {electionDetails.startDate} edate = {electionDetails.endDate}/>
						<DeleteModal Candidate = {Candidate} isAdmin = {isAdmin} isPending = {true}/>
						<UpdateElectionModal  electionDetails={electionDetails} election/>
						{ballotType===4 &&
							<BordaModal Candidate = {Candidate} candidates = { candidates } status = { STATUS.ACTIVE }  ballotAddress={ballotAddress}/>
						}
						{ballotType===2 &&
							<OklahomaModal Candidate = {Candidate} candidates = { candidates } status = { STATUS.ACTIVE }  ballotAddress={ballotAddress}/>
						}
						{ballotType===1 &&
							<VoteModal electionId={electionId} status = { STATUS.ACTIVE }  ballotAddress={ballotAddress}/>
						}
					</div>
				</div>

				<br/><br/><br/>

				<div className="cardContainer row">
					<CardItem headerValue={ballotType===1?"general":ballotType==2?"Oklahoma":"Borda"} descriptor="Algorithm" imgUrl="/assets/totalElections.png"/>

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
								<span onClick={getWinnerDetails} className="voteButton" style={{float: "right", marginTop: "10px", width: "120px" ,padding:"5px"}}>Show Winner</span>
							</div>

							:
								<span onClick={getResults} className="voteButton voteButtonDisabled" style={{float: "right", marginTop: "10px", width: "100px"}}>Get Result</span>
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
												id={supportVar+ Number(candidate?._hex)}
												about={candidate?.about}
												voteCount={candidate?.voteCount}
												imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'}
												modalEnabled="true"
												ballotAddress = {ballotAddress}
												ballotType = {ballotType}
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

							<h5>About {ballotType===1?"general":ballotType==2?"Oklahoma":"Borda"} Algorithm</h5>
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
								`:`The Borda count method is a point-based election system in which voters number their 
								preferred choices in order. The Borda count method does not rely on the majority criterion
								 or Condorcet criterion. The majority criterion states if one choice gets the majority of
								  the first-place votes, that choice should be declared the winner. In the Borda count 
								  method it is possible, and sometimes happens, that the first choice option would get 
								  the majority of the votes, but once all of the votes are considered, that choice is not the 
								  winner.`}




								
							</font>
						</div>
					</div>

					<div className="rhsLayout" style={{overflowY: "scroll"}}>
						<div className="lhsHeader" style={{marginTop: "10px", display: 'flex', justifyContent: 'space-between'}}>
							<h5 style={{width: "60%"}}>Candidates ({candidates.length})</h5>
							{
								// isAdmin && status == STATUS.PENDING &&
								<AddCandidateModal  electionId={electionId}  />
							}
						</div>
 
						<br/>

						{
							
							votingProcess?.proposals?.map((candidate,index) => (
								// <div style={{padding:"1rem", display:"flex" , justifyContent:"space-around"}}>
								<Candidate name={ ethers.utils.toUtf8String(candidate)} id={index} voteCount={votesPerProposal == null ?0:votesPerProposal[index][1]._hex} imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'}/> 
								// {/* { */}
								// 	// votesPerProposal == null ? <div>0</div> :
								// 	// <div>votes:{parseInt(votesPerProposal[index][1]._hex)}</div>
								// // }
								// </div>
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