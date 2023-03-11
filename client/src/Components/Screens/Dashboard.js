import React from "react";
import { useState, useEffect } from "react";
import { Table, Button, EthAddress } from "rimble-ui";

import { CreateElectionModal } from "./modals/";

import { STATUS } from "../constants";
import { Status, CardItem, ElectionRow } from "./utilities";

import Navbar from "./Navbar";

import "../styles/Layout.scss";
import "../styles/Dashboard.scss";

import { ethers } from "ethers";
import ElectionOrganiser from "../../build/ElectionOrganizer.json";
import Authentication from "../../build/Authentication.json";
// import BrightID from "./BrightID";

const Dashboard = () => {
  const [elections, getElections] = useState([]);
  const [DashContractAddress, setDashContractAddress] = useState("");
  const [organizerInfo, setOrganizerInfo] = useState({
    name: "",
    publicAddress: "",
  });

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
  const AuthcontractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  // const DashcontractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const fetchElections = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = await provider.getSigner();

        //to fetch signers address
        const add = await signer.getAddress();
       


        const contract = new ethers.Contract(
          DashContractAddress,
          ElectionOrganiser.abi,
          signer
        );

        //removed the hardcoded address
        const data = await contract.getElectionOrganizerByAddress(
          add
        );
        
       
        setOrganizerInfo({
          name: data.name,
          publicAddress: data.publicAddress,
        });
        const elections = await contract.getElections(); //get elections
        getElections(elections);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchContract = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          AuthcontractAddress,
          Authentication.abi,
          signer
        );
        const data = await contract.getElectionOrganizerContract(); //get elections
        setDashContractAddress(data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const [statistics, setStatistics] = useState([1, 2, 4, 2]);

  const getTokens = () => {
    window.open("https://faucet.avax-test.network/", "_blank");
  };
  useEffect(() => {
    fetchContract();
    fetchElections();
  }, [DashContractAddress]);
  return (
    <div style={{ backgroundColor: "#f7f7f7", minHeight: "100%" }}>
      <Navbar
        header={organizerInfo.name}
        infoText={organizerInfo.publicAddress}
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
            <CreateElectionModal DashContractAddress={DashContractAddress} />
          </div>
          <a href="/brightid">
          <div className="createElectionButton">Get BrightID Verified!
          
          </div></a>
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
                  {elections.map((election) => (
                    <ElectionRow
                      electionId={0}
                      electionTitle={"Test election"}
                      electionAddress={election}
                      startDate={new Date(160000000 * 1000).toLocaleString()}
                      endDate={new Date(160000000 * 1000).toLocaleString()}
                      status={getStatus(160000000, 160000000)}
                    />
                  ))}
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
