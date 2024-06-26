import React from "react";
import { useState, useEffect } from "react";
import { Table, Button, EthAddress, display, zIndex } from "rimble-ui";

import { CreateElectionModal ,PolygonIDVerifier} from "./modals/";

import { STATUS } from "./constants";
import { Status, CardItem, ElectionRow } from "./utilities";

import { getVotingProcesses } from '../web3/contracts';

import { useDispatch, useSelector } from 'react-redux'
import { selectHasRegistered, selectTestState, setTestState } from '../store/home.slice';



import Navbar from "./Navbar";

import "./styles/Layout.scss";
import "./styles/Dashboard.scss";

import { ethers } from "ethers";
import ElectionOrganiser from "../build/ElectionOrganizer.json";
import Authentication from "../build/Authentication.json";
import ElectionABI from '../build/Election.sol/Election.json'
import { ToastContainer } from 'react-toastify';


// import BrightID from "./BrightID";

const Dashboard = () => {
  const [elections, getElections] = useState([]);
  const [DashContractAddress, setDashContractAddress] = useState("");
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
  const AuthcontractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  // const DashcontractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const fetchElections = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer =  provider.getSigner();

        //to fetch signers address
        const add = await signer.getAddress();
       

        if(DashContractAddress !== ""){
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

  //to fetch all election details 
  const fetchDetailedElection = async() => {
    try{
    const { ethereum } = window;
   
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();    
      let tempStats = [0, 0, 0, 0];
      let info = await getVotingProcesses();
      console.log('all elections ',info);
       info.map(async (it) => {
      

        
        console.log('current election ',it);
        let st = getStatus(parseInt(it.startDate._hex), parseInt(it.endDate));
        console.log('startdate',(it.startDate._hex),'enddate',(it.endDate));
        const data = {
            electionID: parseInt(it.id),
            name: it.name,
            address: it.description,
            startDate: new Date(parseInt(it.startDate) * 1000).toLocaleString(),
            endDate: new Date(it.endDate * 1000).toLocaleString(),
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
    

  }catch(err){
    console.log(err)
  }
  }

  const getTokens = () => {
    window.open("https://faucet.avax-test.network/", "_blank");
  };
  useEffect(() => {
    fetchContract();
    fetchElections();
  }, [DashContractAddress]);

  useEffect(() => {
    fetchDetailedElection()
    }, [])


  return (

    <div style={{ backgroundColor: "#f7f7f7", minHeight: "100%" }}>
      <ToastContainer style={{zIndex:"99999"}}/>
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
          <PolygonIDVerifier
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
                />
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
              <input onChange={(e)=>handleSearchChange(e)} placeholder= "Search Election" style={{marginRight:"10px", padding:"5px"}}/>
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