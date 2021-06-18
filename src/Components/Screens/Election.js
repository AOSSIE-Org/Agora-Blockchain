import { useTimer } from 'react-timer-hook';
import { useState, useEffect } from 'react';
import '../styles/Election.scss';
import '../styles/Layout.scss';
import VoteModal from './modals/VoteModal';
import DeleteModal from './modals/DeleteModal';
import Candidate from './modals/Candidate'
import Navbar from './Navbar';
import TimerStyled from './TimerStyled';

function Election() {
    const [isAdmin, setAdmin] = useState(true);
    const [isActive, setActive] = useState(true);
    const [isPending, setPending] = useState(true);

	const CardItem = ({headerValue, descriptor, imgUrl, imgBackground = "#f7f7f7"}) => {
		return (
			<div className="shadow cardItem">
				<div className="centered">
					<div className="cardImageHolder" style={{backgroundColor: imgBackground}}>
						<div className="centered">
							<img src={imgUrl} className="cardImage" alt="profile-pic"/>
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

    const MyTimer = ({ expiryTimestamp }) => {
        expiryTimestamp = new Date(expiryTimestamp).getTime()
        console.log(expiryTimestamp)
        const {
          seconds,
          minutes,
          hours,
          days,
          start
        } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called'), autostart: "false"});
        // useEffect(() => {
        //     start();
        // })
        return (
            <TimerStyled seconds={seconds} minutes={minutes} hours={hours} days={days} />
        );
    }      

	return (
		<div style={{backgroundColor: "#f7f7f7", minHeight: "100%"}}>
			<Navbar header="Raj Ranjan" infoText="0xF30F9801df6c722C552Fd60E8E201A4c0524BFAb" pictureUrl="/assets/avatar.png"/>

			<div style={{margin: "30px"}}>
				<div style={{width: "100%"}}>
					<div style={{float: "left"}}>
						<h5 style={{marginBottom: "0px"}}>My First Election</h5>
                        <font className="text-muted" size="2">Ayush Tiwari</font><br/>
						{/* <font size="1" className="text-muted" style={{marginTop: "0px"}}>0xF30F9801df6c722C552Fd60E8E201A4c0524BFAb</font> */}
					</div>


					<div style={{float: "right", display: "flex"}}>
                        <MyTimer expiryTimestamp="2021-06-16 14:47:00" />
                        <DeleteModal Candidate={Candidate} isAdmin={isAdmin} isPending={isPending}/>
						<VoteModal Candidate={Candidate} isActive={isActive} isPending={isPending}/>
					</div>
				</div>

				<br/><br/><br/>

				<div className="cardContainer row">
					<CardItem headerValue="Moore's" descriptor="Algorithm" imgUrl="/assets/totalElections.png"/>

					<CardItem headerValue="Monday, 7th June 2021" descriptor="Start date" imgUrl="/assets/activeElections.png" imgBackground="#eaffe8"/>

					<CardItem headerValue="Monday, 14th June 2021" descriptor="End date" imgUrl="/assets/endedElections.png" imgBackground="#ffe8e8"/>

					<CardItem headerValue="137" descriptor="Total voters" imgUrl="/assets/pendingElections.png" imgBackground="#fffbd1"/>
				</div>

				<div className="layoutBody row">
					<div className="lhsLayout" style={{overflowY: "scroll"}}>
						<div className="lhsHeader" style={{marginTop: "10px"}}>
							<h5>Election Details</h5>
						</div>
						
						<div className="lhsBody" style={{textAlign: "justify"}}>
                            <font size="2" className="text-muted">
                                <p>Elections have been the usual mechanism by which modern representative democracy has operated since the 17th century. Elections may fill offices in the legislature, sometimes in the executive and judiciary, and for regional and local government. This process is also used in many other private and business organisations, from clubs to voluntary associations and corporations.</p>
                                <p>The universal use of elections as a tool for selecting representatives in modern representative democracies is in contrast with the practice in the democratic archetype, ancient Athens, where the Elections were not used were considered an oligarchic institution and most political offices were filled using sortition, also known as allotment, by which officeholders were chosen by lot.</p>
                            </font>

                            <br/>

                            <h5>About Moore's Algorithm</h5>
                            <font size="2" className="text-muted">
                                The Boyer-Moore voting algorithm is one of the popular optimal algorithms which is used to find the majority element among the given elements that have more than N/ 2 occurrences. This works perfectly fine for finding the majority element which takes 2 traversals over the given elements, which works in O(N) time complexity and O(1) space complexity.   
                            </font>
                        </div>
					</div>

					<div className="rhsLayout" style={{overflowY: "scroll"}}>
						<div className="lhsHeader" style={{marginTop: "10px"}}>
							<h5>Candidates (4)</h5>
						</div>

                        <br/>

                        <Candidate name="Raj" id="1" imageUrl="/assets/avatar.png" modalEnabled="true"/>

                        <Candidate name="Ayush" id="2" imageUrl="/assets/avatar2.png" modalEnabled="true"/>

                        <Candidate name="Thuva" id="3" imageUrl="/assets/avatar4.png" modalEnabled="true"/>

                        <Candidate name="Bruno" id="4" imageUrl="/assets/avatar3.png" modalEnabled="true"/>
					</div>
				</div>

				<br/>
			</div>
		</div>
	)
}

export default Election;