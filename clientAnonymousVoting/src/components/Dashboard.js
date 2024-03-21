import React from "react";
import { useState, useEffect } from "react";
import { Table, Button, EthAddress } from "rimble-ui";

import { CreateElectionModal, PolygonIDVerifier } from "./modals/";

import { STATUS } from "./constants";
import { Status, CardItem, ElectionRow } from "./utilities";

import { getAllVotingProcesses, getProviderAndSigner } from '../web3/contracts';

import { useDispatch, useSelector } from 'react-redux'
import { selectHasRegistered, selectTestState, setTestState } from '../store/home.slice';
import Navbar from "./Navbar";
import { Contract } from "ethers";
import votingProcessAbi from "../abis/contracts/VotingProcess.sol/VotingProcess.json"
import "./styles/Layout.scss";
import "./styles/Dashboard.scss";
import { ToastContainer } from 'react-toastify';


// import BrightID from "./BrightID";

const Dashboard = () => {

    const [organizerInfo, setOrganizerInfo] = useState(null);
    const [statistics, setStatistics] = useState([0, 0, 0, 0]);
    const [detailedelection, setdetailedelection] = useState([]);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("ALL");

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        console.log(search)
    }
    const handleTypeChange = (e) => {
        setType(e.target.value);
        console.log(type)
    }

    //helper function to filter the elections
    const filtercheck = (elections) => {
        console.log(elections);
        console.log('type', type, 'status', elections.status);
        console.log(type === elections.status);
        if (search === "" && type === "ALL") {
            return true;
        }
        if (search === elections.name && type === "ALL") {
            return true;
        }
        if (search === "" && type == elections.status) {
            return true;
        }
        if (search === elections.name && type == elections.status) {
            return true;
        }

    }

    const getStatus = (sdate, edate) => {
        sdate = sdate * 1000;
        edate = edate * 1000;

        const timestamp = Date.now();

        if (timestamp < sdate) {
            return STATUS.PENDING;
        } else if (timestamp < edate) {
            return STATUS.ACTIVE;
        } else {
            return STATUS.CLOSED;
        }
    };

    const fetchUserAddress = async () => {
        const { signer } = getProviderAndSigner();
        const address = await signer.getAddress();
        setOrganizerInfo(address);
    }


    //to fetch all election details 
    const fetchDetailedElection = async () => {
        try {
            const processAddresses = await getAllVotingProcesses();
            // console.log('All election addresses:', processAddresses);

            let tempStats = { active: 0, closed: 0, pending: 0, total: 0 };

            const detailedElections = await Promise.all(processAddresses.map(async (address) => {
                const {provider} = getProviderAndSigner();
                const votingProcessContract = new Contract(address, votingProcessAbi.abi, provider);

                const id = await votingProcessContract.id();
                const name = await votingProcessContract.name();
                // const description = await votingProcessContract.description();
                const startDate = await votingProcessContract.startDate();
                const endDate = await votingProcessContract.endDate();
                const status = getStatus(startDate, endDate);

                tempStats[status] += 1;

                return {
                    electionID: id,
                    name,
                    address: address,
                    startDate: new Date(startDate * 1000).toLocaleString(),
                    endDate: new Date(endDate * 1000).toLocaleString(),
                    status
                };
            }));
            setdetailedelection(detailedElections);
            tempStats.total = detailedElections.length;
            setStatistics(Object.values(tempStats));
        } catch (err) {
            console.error(err);
        }
    };


    const getTokens = () => {
        window.open("https://faucet.avax-test.network/", "_blank");
    };


    useEffect(() => {
        fetchUserAddress();
        fetchDetailedElection();
    }, []);



    return (
        <div style={{ backgroundColor: "#f7f7f7", minHeight: "100%" }}>
            <ToastContainer style={{ zIndex: "99999" }} />
            <Navbar
                header={"Wallet Address"}
                infoText={organizerInfo}
                pictureUrl="/assets/avatar.png"
            />

            <div style={{ padding: "30px" }}>
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
                    {/* <PolygonIDVerifier
                        publicServerURL={
                            process.env.REACT_APP_VERIFICATION_SERVER_PUBLIC_URL
                        }
                        localServerURL={
                            process.env.REACT_APP_VERIFICATION_SERVER_LOCAL_HOST_URL
                        }
                        credentialType={"KYCAgeCredential"}
                        issuerOrHowToLink={
                            "https://oceans404.notion.site/How-to-get-a-Verifiable-Credential-f3d34e7c98ec4147b6b2fae79066c4f6?pvs=4"
                        }
                    // onVerificationResult={setProvedAccessBirthday}
                    /> */}
                </div>

                <br />
                <br />
                <br />

                {
                    // UserContract &&
                    <div className="cardContainer row">
                        <CardItem
                            headerValue={statistics[0]}
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
                        <div className="lhsHeader" style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "Center" }}>
                                <h5 style={{ lineHeight: 0 }}>Elections</h5>
                            </div>
                            <div style={{ display: "flex" }}>
                                <input onChange={(e) => handleSearchChange(e)} placeholder="Search Election" style={{ marginRight: "10px", padding: "5px" }} />
                                <div className="">
                                    <select style={{ width: "100px" }}
                                        onChange={(e) => handleTypeChange(e)}
                                        type="text"
                                        className="form-control"
                                        placeholder="Filter by type"
                                    >
                                        <option value="ALL">ALL</option>
                                        <option value="pending">Pending</option>
                                        <option value="active">Active</option>
                                        <option value="closed">Closed</option>

                                    </select>
                                </div>

                            </div>
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
                                        (detailedelection.length > 0) &&
                                        detailedelection.filter((e) => filtercheck(e)).map((electionData) => (
                                            <ElectionRow
                                                DashContractAddress={"DashContractAddress"}
                                                id={parseInt(electionData.electionID._hex)}
                                                electionId={parseInt(electionData.electionID._hex)}
                                                electionTitle={electionData.name}
                                                electionAddress={electionData.address}
                                                startDate={electionData.startDate}
                                                endDate={electionData.endDate}
                                                status={electionData.status}
                                                organizerInfo={organizerInfo}
                                            />
                                        ))
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

                        <br />

                        <div
                            style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                width: "100%",
                            }}
                            className="text-muted"
                        >
                            <EthAddress address={"0xADC"} />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                height: "190px",
                                flexDirection: "row",
                                alignItems: "flex-end",
                            }}
                        >
                            <Button style={{ width: "100%" }} onClick={getTokens}>
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