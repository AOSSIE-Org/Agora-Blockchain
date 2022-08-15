import React from "react";
import { useTimer } from 'react-timer-hook';
import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

import {
	AddCandidateModal,
	Candidate,
	VoteModal,
	DeleteModal
} from './modals'

import { AVATARS, STATUS } from '../constants'
import { Status, CardItem, TimerStyled } from "./utilities";

import Navbar from './Navbar';

import '../styles/Election.scss';
import '../styles/Layout.scss';

function Election() {
	const [isAdmin, setAdmin] = useState(false);
	const [status, setStatus] = useState(STATUS.PENDING)

	const search = useLocation().search;
	const contractAddress = new URLSearchParams(search).get('contractAddress');

	const [candidates, setCandidates] = useState([
		{
			name: "Raj",
			id: 1,
			about: "Hey! I am a candidate.",
			voteCount: 3
		},
		{
			name: "Test User",
			id: 3,
			about: "Hey! I am a candidate.",
			voteCount: 2
		}
	])

	const [winnerDetails, setWinnerDetails] = useState([
		...candidates
	]);

	const getResults = async () => {
		const edate = 160000000 * 1000;
		if(Date.now() >= edate) {
			let _winnerDetails = [];
			setWinnerDetails(_winnerDetails);
		}
	}

	useEffect(() => {
		if(1) {
			setAdmin(true);
		}
	}, [])

	const updateStatus = () => {
		const sdate = 160000000000 * 1000;
		const edate = 160000000000 * 1000;
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
		updateStatus();
	}, [])

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
		} = useTimer({ expiryTimestamp, onExpire: () => {expiryTimestamp = edate; updateStatus(); Date.now() >= edate && winnerDetails.length === 0 && getResults()}, autostart: "false"});
		
		useEffect(() => {
			start();
			updateStatus(); 
		}, [expiryTimestamp])
		
		return (
			<TimerStyled seconds={seconds} minutes={minutes} hours={hours} days={days} />
		);
	}

	return (
		<div style={{backgroundColor: "#f7f7f7", minHeight: "100%"}}>
			<Navbar header={"Raj"} infoText={"0xADA"} pictureUrl="/assets/avatar.png"/>
			
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
						<font size="2" className="text-muted" style={{marginTop: "0px"}}>{contractAddress}</font>
					</div>


					<div style={{float: "right", display: "flex"}}>
						<MyTimer sdate = {1665000000} edate = {1665000000}/>
						<DeleteModal Candidate = {Candidate} isAdmin = {isAdmin} isPending = {true}/>
						<VoteModal Candidate = {Candidate} candidates = { candidates } status = { STATUS.ACTIVE } />
					</div>
				</div>

				<br/><br/><br/>

				<div className="cardContainer row">
					<CardItem headerValue={"General"} descriptor="Algorithm" imgUrl="/assets/totalElections.png"/>

					<CardItem headerValue={(new Date(1665000000 * 1000)).toLocaleString()} descriptor="Start date" imgUrl="/assets/activeElections.png" imgBackground="#eaffe8"/>

					<CardItem headerValue={(new Date(1665000000 * 1000)).toLocaleString()} descriptor="End date" imgUrl="/assets/endedElections.png" imgBackground="#ffe8e8"/>

					<CardItem headerValue={1} descriptor="Total voters" imgUrl="/assets/pendingElections.png" imgBackground="#fffbd1"/>
				</div>

				<div className="layoutBody row">
					<div className="lhsLayout" style={{overflowY: "scroll"}}>
						{
							status == STATUS.CLOSED
							?
							<span onClick={getResults} className="voteButton" style={{float: "right", marginTop: "10px", width: "100px"}}>Get Results</span>
							:
							<span onClick={getResults} className="voteButton voteButtonDisabled" style={{float: "right", marginTop: "10px", width: "100px"}}>Get Results</span>
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
										winnerDetails.map((candidate) => (
											candidate?.name !== ""
											&&
											<Candidate
												name={candidate?.name}
												id={candidate?.id}
												about={candidate?.about}
												voteCount={candidate?.voteCount}
												imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'}
												modalEnabled="true"
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
									This is a description
								</p>
							</font>

							<br/>

							<h5>About {"General"} Algorithm</h5>
							<font size="2" className="text-muted">
								In General or Regular voting algorithm, winner(s) is(are) chosen
								from the list of candidates according to the number of votes they
								get. Those with the maximum number of votes are chosen as the winner
								of the candidates. If 2 or more candidates are eligible for winning,
								then it depends upon the organization to whether choose a candidate by
								a draw or by any other means.
							</font>
						</div>
					</div>

					<div className="rhsLayout" style={{overflowY: "scroll"}}>
						<div className="lhsHeader" style={{marginTop: "10px", display: 'flex', justifyContent: 'space-between'}}>
							<h5 style={{width: "60%"}}>Candidates ({candidates.length})</h5>
							{
								// isAdmin && status == STATUS.PENDING &&
								<AddCandidateModal/>
							}
						</div>

						<br/>

						{
							candidates?.map((candidate) => (
								<Candidate
									name={candidate?.name}
									id={candidate?.id}
									about={candidate?.about}
									voteCount={candidate?.voteCount}
									imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'}
									modalEnabled="true"
								/> 
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
