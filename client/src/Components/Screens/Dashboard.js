import React from "react";
import { useState, useEffect } from "react";
import { Table, Button, EthAddress, display } from "rimble-ui";

import { CreateElectionModal } from "./modals/";

import { STATUS } from "../constants";
import { Status, CardItem, ElectionRow } from "./utilities";

import Navbar from "./Navbar";

import "../styles/Layout.scss";
import "../styles/Dashboard.scss";
import { CONTRACTADDRESS } from '../constants'

import { ethers } from "ethers";
import Authentication from '../../build/Authentication.json'
import ElectionOrganiser from "../../build/ElectionOrganizer.json";
import ElectionABI from '../../build/Election.sol/Election.json'
import { useNavigate } from "react-router-dom";

// import BrightID from "./BrightID";

const Dashboard = () => {
  const DashContractAddress = CONTRACTADDRESS;
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState(false);
  const [address, setAddress] = useState();
  const [elections, getElections] = useState([]);
  const [organizerInfo, setOrganizerInfo] = useState({
    name: "",
    publicAddress: "",
  });
  const [statistics, setStatistics] = useState([0, 0, 0, 0]);
  const [detailedelection, setdetailedelection] = useState([]);
  const [search, setSearch] = useState("");
  const [type,setType] = useState("ALL");

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
    console.log('type',type ,'status',elections.status);
    console.log(type===elections.status);
      if(search === "" && type === "ALL"){
        return true;
      }
      if(search ===elections.name && type === "ALL"){
        return true;
      }
      if(search ==="" && type == elections.status){
        return true;
      }
      if(search ===elections.name && type == elections.status){
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

  const fetchElections = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer =  provider.getSigner();

        //to fetch signers address
        const add = await signer.getAddress();
       
        const contract = new ethers.Contract(
          DashContractAddress,
          ElectionOrganiser.abi,
          signer
        );

        const data = await contract.getElectionOrganizerByAddress(add);       
        setOrganizerInfo({
          name: data.name,
          publicAddress: data.publicAddress,
        });
                
        const openBasedElections = await contract.getOpenBasedElections();
        const inviteBasedElections = await contract.getInviteBasedElections(data.publicAddress);
        const elections = await openBasedElections.concat(inviteBasedElections);
        console.log("Open Based Elections - ",openBasedElections);
        console.log("Invite Based Elections - ",inviteBasedElections);
        console.log("Elections - ",elections);
        getElections(elections);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //to fetch all election details 
  const fetchDetailedElection = async() => {
    try{
      const { ethereum } = window;

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();   

      let tempStats = [0, 0, 0, 0];
      setdetailedelection([]);

      elections.map(async (address) => {
        const electionContract = new ethers.Contract(
          address,
          ElectionABI.abi,
          signer
        );

        let info = await electionContract.getElectionInfo();
        let st = getStatus(info.startDate, info.endDate);
        const data = {
          electionID: parseInt(info.electionID % 1000),
          name: info.name,
          address: address,
          startDate: new Date(info.startDate * 1000).toLocaleString(),
          endDate: new Date(info.endDate * 1000).toLocaleString(),
          status: st
        }

        // to set status 
        if (st === "active") {
          tempStats[1]++;
        }
        else if (st === "closed") {
          tempStats[2]++;
        }
        else if (st === "pending") {
          tempStats[3]++;
        }

        setdetailedelection(detailedelection => [...detailedelection, data]);

        let sum =(tempStats[1]+tempStats[2]+tempStats[3])
        tempStats[0] = sum+1;
        setStatistics(tempStats);        
      })


    } catch(err){
      console.log(err)
    }
  }

  const getTokens = () => {
    window.open("https://faucet.avax-test.network/", "_blank");
  };

  const getAuthStatus = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const add  = await signer.getAddress();
        const contract = new ethers.Contract(
          CONTRACTADDRESS,
          Authentication.abi,
          signer
        );

        setAddress(add);

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

  useEffect(() => {
    if(authStatus == true){
      fetchElections();
    }
    else {
      getAuthStatus();
    }
  }, [authStatus]);

  useEffect(() => {
    fetchDetailedElection()
  }, [elections]);

  return (
    <div style={{ backgroundColor: "#f7f7f7", minHeight: "100%" }}>
      <Navbar
        header={organizerInfo.name}
        infoText={organizerInfo.publicAddress}
        pictureUrl="/assets/avatar.png"
        address = {address}
      />

      <div style={{ padding: "30px" }}>
        <div style={{ width: "100%" }}>
          <div style={{ float: "left" }}>
            <h4 style={{ marginBottom: "0px" }}>Dashboard</h4>

            <font size="2" className="text-muted">
              Agora Blockchain
            </font>
          </div>

          <div style={{ float: "right", marginLeft:10, marginBottom:10}}>
            <CreateElectionModal DashContractAddress={DashContractAddress} fetchElections={fetchElections}/>
          </div>
          <a href="/brightid">
            <div className="createElectionButton">Get BrightID Verified!</div>
          </a>
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
            <div className="lhsHeader" style={{ marginTop: "10px", display:"flex" ,justifyContent:"space-between" }}>
              <div style={{display:"flex" , alignItems:"Center"}}>
              <h5 style={{lineHeight:0}}>Elections</h5>
              </div>
              <div style={{display:"flex"}}>
              <input onChange={(e)=>handleSearchChange(e)} placeholder= "Search Election" style={{marginRight:"10px"}}/>
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
                    detailedelection.filter((e)=>filtercheck(e)).map((electionData) => (
                      <ElectionRow
                        DashContractAddress={DashContractAddress}
                        id={parseInt(electionData.ID)}
                        electionId={electionData.electionID}
                        electionTitle={electionData.name}
                        electionAddress={electionData.address}
                        startDate={electionData.startDate}
                        endDate={electionData.endDate}
                        status={electionData.status}
                        organizerInfo= {organizerInfo}
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