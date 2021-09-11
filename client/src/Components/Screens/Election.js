import { useTimer } from 'react-timer-hook';
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from "react-router-dom";
import '../styles/Election.scss';
import '../styles/Layout.scss';
import VoteModal from './modals/VoteModal';
import DeleteModal from './modals/DeleteModal';
import AddCandidateModal from './modals/AddCandidateModal';
import Candidate from './modals/Candidate'
import Navbar from './Navbar';
import TimerStyled from './TimerStyled';
import { useCallContext } from "../../drizzle/calls";
import { AVATARS, COLORS, STATUS } from '../constants'
import { ImageComponent } from './Image';

function Election() {
    const [isAdmin, setAdmin] = useState(false);
    const [isActive, setActive] = useState(true);
	const [isPending, setPending] = useState(true);
	const [status, setStatus] = useState(STATUS.PENDING)

	const search = useLocation().search;
	const contractAddress = new URLSearchParams(search).get('contractAddress');

	const { getCurrentElection, CurrentElection, currentElectionDetails, userInfo, account } = useCallContext();

	getCurrentElection(contractAddress);

	const [winnerDetails, setWinnerDetails] = useState([]);

	const Status = ({ status, text }) => {
		return (
		  <div style={{marginTop: "1px"}}>
			<div className="status">
			  <div
				className="statusIndicator"
				style={{ backgroundColor: COLORS[status], marginTop: "8px", marginLeft: "8px" }}
			  ></div>
			  <font>{text}</font>
			</div>
		  </div>
		);
	};

	const getResults = async () => {
		const edate = currentElectionDetails?.info?.edate * 1000;
		if(Date.now() >= edate) {
			let _winnerDetails = await CurrentElection?.getWinnerDetails().call();
			setWinnerDetails(_winnerDetails);
		}
	}

	useEffect(() => {
		if(currentElectionDetails?.info?.electionOrganiser == account) {
			setAdmin(true);
		}
	}, [currentElectionDetails?.info?.electionOrganiser])

	const updateStatus = () => {
		const sdate = currentElectionDetails?.info?.sdate * 1000;
		const edate = currentElectionDetails?.info?.edate * 1000;
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
	}, [currentElectionDetails?.info?.sdate, currentElectionDetails?.info?.edate])

	return useMemo(() => {
		const CardItem = ({headerValue, descriptor, imgUrl, imgBackground = "#f7f7f7"}) => {
			return (
				<div className="shadow cardItem">
					<div className="centered">
						<div className="cardImageHolder" style={{backgroundColor: imgBackground}}>
							<div className="centered">
								<ImageComponent src={imgUrl} className="cardImage" />
								{/* <img src={imgUrl} className="cardImage" alt="profile-pic"/> */}
							</div>
						</div>

						<font size = "2" className="cardText">
							<font size="2">{headerValue}</font>
							<span className="text-muted">{descriptor}</span>
						</font>
					</div>
				</div>
			)
		}

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
				<Navbar header={userInfo?.name} infoText={userInfo?.contractAddress} pictureUrl="/assets/avatar.png"/>
				<div style={{padding: "30px"}}>
					<div style={{width: "100%"}}>
						<div style={{float: "left"}}>
							<div style={{display: "flex"}}>
								<h5 style={{marginBottom: "0px", width: "max-content"}}>{currentElectionDetails?.info?.name}</h5>
								<Status
									status={status}
									text={status.charAt(0).toUpperCase() + status.slice(1)}
								/>
							</div>
							<font size="2" className="text-muted" style={{marginTop: "0px"}}>{contractAddress}</font>
						</div>


						<div style={{float: "right", display: "flex"}}>
							<MyTimer sdate={currentElectionDetails?.info?.sdate} edate={currentElectionDetails?.info?.edate}/>
							{/* <DeleteModal Candidate={Candidate} isAdmin={isAdmin} isPending={isPending}/> */}
							<VoteModal account={account} Candidate={Candidate} CurrentElection={CurrentElection} currentElectionDetails={currentElectionDetails} isActive={isActive} isPending={isPending} status={status}/>
						</div>
					</div>

					<br/><br/><br/>

					<div className="cardContainer row">
						<CardItem headerValue={currentElectionDetails?.info?.algorithm} descriptor="Algorithm" imgUrl="/assets/totalElections.png"/>

						<CardItem headerValue={(new Date(currentElectionDetails?.info?.sdate * 1000)).toLocaleString()} descriptor="Start date" imgUrl="/assets/activeElections.png" imgBackground="#eaffe8"/>

						<CardItem headerValue={(new Date(currentElectionDetails?.info?.edate * 1000)).toLocaleString()} descriptor="End date" imgUrl="/assets/endedElections.png" imgBackground="#ffe8e8"/>

						<CardItem headerValue={currentElectionDetails?.info?.voterCount} descriptor="Total voters" imgUrl="/assets/pendingElections.png" imgBackground="#fffbd1"/>
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
								winnerDetails.length > 0 && <>
									<div className="lhsHeader" style={{marginTop: "10px"}}>
										<h5>Results</h5>
									</div>

									<br/>

									<div style={{display: "flex", justifyContent: "space-around", flexWrap: "wrap"}}>
										{
											winnerDetails.map((candidate) => (
												candidate?.name != "" && <Candidate name={candidate?.name} id={candidate?.id} about={candidate?.about} voteCount={candidate?.voteCount} imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'} modalEnabled="true"/> 
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
									<p>{currentElectionDetails?.info?.description}</p>
								</font>

								<br/>

								<h5>About {currentElectionDetails?.info?.algorithm} Algorithm</h5>
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
								<h5 style={{width: "60%"}}>Candidates ({currentElectionDetails?.candidate?.length || 0})</h5>
								{
									isAdmin && status == STATUS.PENDING && <AddCandidateModal CurrentElection={CurrentElection} account={account}/>
								}
							</div>

							<br/>

							{
								currentElectionDetails?.candidate?.map((candidate) => (
									<Candidate name={candidate?.name} id={candidate?.id} about={candidate?.about} voteCount={candidate?.voteCount} imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'} modalEnabled="true"/> 
								))
							}
						</div>
					</div>

					<br/>
				</div>
			</div>
		)
	}, [CurrentElection, userInfo, currentElectionDetails, winnerDetails, status, isAdmin])
}

export default Election;