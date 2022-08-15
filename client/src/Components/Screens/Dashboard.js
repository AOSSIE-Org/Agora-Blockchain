import React from "react";
import { useState } from "react";
import { Table, Button, EthAddress } from "rimble-ui";

import { CreateElectionModal } from "./modals/";

import { STATUS } from "../constants";
import { Status, CardItem, ElectionRow } from "./utilities";

import Navbar from "./Navbar";

import "../styles/Layout.scss";
import "../styles/Dashboard.scss";

const Dashboard = () => {
	const getStatus = (sdate, edate) => {
		sdate = sdate * 1000;
		edate = edate * 1000;

		const timestamp = Date.now();

		if(timestamp < sdate) {
			return (STATUS.PENDING);
		} else if(timestamp < edate) {
			return (STATUS.ACTIVE);
		} else {
			return (STATUS.CLOSED);
		}
	}

	const [statistics, setStatistics] = useState([1, 2, 4, 2])

	const getTokens = () => {
		window.open('https://faucet.avax-test.network/', '_blank');
	}

	return (
		<div style={{ backgroundColor: "#f7f7f7", minHeight: "100%" }}>
			<Navbar header={"Raj"} infoText={"0x13AD"} pictureUrl="/assets/avatar.png"/>

			<div style={{ padding: "30px"}}>
				<div style={{ width: "100%" }}>
					<div style={{ float: "left" }}>
						<h4 style={{ marginBottom: "0px" }}>Dashboard</h4>
						
						<font size="2" className="text-muted">
							Agora Blockchain
						</font>
					</div>

					<div style={{ float: "right" }}>
						<CreateElectionModal/>
					</div>
				</div>

				<br />
				<br />
				<br />

				{
					// UserContract &&
					<div className="cardContainer row">
						<CardItem
							headerValue={1}
							descriptor="Total elections"
							imgUrl="/assets/totalElections.png"
						/>

						<CardItem
							headerValue={statistics[1]}
							descriptor="Active elections"
							imgUrl="/assets/activeElections.png"
							imgBackground="#eaffe8"
						/>

						<CardItem
							headerValue={statistics[2]}
							descriptor="Closed elections"
							imgUrl="/assets/endedElections.png"
							imgBackground="#ffe8e8"
						/>

						<CardItem
							headerValue={statistics[3]}
							descriptor="Pending elections"
							imgUrl="/assets/pendingElections.png"
							imgBackground="#fffbd1"
						/>
					</div>
				}

				<div className="layoutBody row">
					<div className="lhsLayout">
						<div className="lhsHeader" style={{ marginTop: "10px" }}>
							<h5>Elections</h5>
						</div>

						<br />

						<div className="lhsBody">
							<Table>
								<thead>
									<tr>
										<th>ID</th>
										<th>Details</th>
										<th>Start Date</th>
										<th>End Date</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody style={{ fontSize: "13px" }}>
									{

										<ElectionRow
											electionId = {0}
											electionTitle = {"Test election"}
											electionAddress = {"0xADC"}
											startDate = {(new Date(160000000 * 1000)).toLocaleString()}
											endDate = {(new Date(160000000 * 1000)).toLocaleString()}
											status = {getStatus(160000000, 160000000)}
										/>
									}
								</tbody>
							</Table>

							<br />
							<br />
						</div>
					</div>

					<div className="rhsLayout">
						<div className="lhsHeader" style={{ marginTop: "10px" }}>
							<h5>Network Information</h5>
						</div>

						<hr />

						<div className="networkHeader">
							<div
								className="imageHolder shadow"
								style={{ backgroundColor: "#f7f7f7" }}
							>
								<div className="centered">
									<img
										src="/assets/ethereum.png"
										className="image"
										alt="profile-pic"
									/>
								</div>
							</div>

							<font size="2" className="imageText">
								<font size="3">Current Network</font>
								<Status status="active" text="Avalanche Fuji" />
							</font>
						</div>

						<br />

						<h4 style={{ marginBottom: "0px" }}>{0} AVAX</h4>

						<br/>

						<div style={{overflow: "hidden", textOverflow: "ellipsis", width: "100%"}} className="text-muted">
							<EthAddress address={"0xADC"}/>
						</div>

						<div
							style={{
								display: "flex",
								height: "190px",
								flexDirection: "row",
								alignItems: "flex-end",
							}}
						>
							<Button style={{width: "100%"}} onClick={getTokens}>
								Get Tokens
							</Button>
						</div>
					</div>
				</div>

				<br />
			</div>
		</div>
	);
};

export default Dashboard;
