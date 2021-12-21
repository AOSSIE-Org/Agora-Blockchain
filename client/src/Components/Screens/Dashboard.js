import { useMemo,useEffect,useState } from "react";
import { Table, Button, EthAddress } from "rimble-ui";
import "../styles/Layout.scss";
import "../styles/Dashboard.scss";
import { COLORS, STATUS } from "../constants";
import CreateElectionModal from "./modals/CreateElectionModal";
import Navbar from "./Navbar";
import { useCallContext } from "../../drizzle/calls";

const Dashboard = () => {
  // const { userInfo } = useUserContext();

  const {
    MainContract,
    UserContract,
    userInfo,
    electionDetails,
    UserSubscriber,
    account,
    balance
  } = useCallContext();

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

  const [statistics,setStatistics] = useState([])

  //Fetch the election statistics 
  useEffect(async () => {

    if(!UserContract) return

    let newStatistics = await UserContract.getStatistics().call()
    setStatistics(newStatistics)
    console.log(statistics)
    
  },[UserContract])

  return useMemo(() => {
    const CardItem = ({
      headerValue,
      descriptor,
      imgUrl,
      imgBackground = "#f7f7f7",
    }) => {
      return (
        <div className="shadow cardItem">
          <div className="centered">
            <div
              className="cardImageHolder"
              style={{ backgroundColor: imgBackground }}
            >
              <div className="centered">
                <img src={imgUrl} className="cardImage" alt="profile-pic" />
              </div>
            </div>

            <font size="2" className="cardText">
              <font size="3">{headerValue}</font>
              <span className="text-muted">{descriptor}</span>
            </font>
          </div>
        </div>
      );
    };

    const Status = ({ status, text }) => {
      return (
        <div>
          <div className="status">
            <div
              className="statusIndicator"
              style={{ backgroundColor: COLORS[status] }}
            ></div>
            <font>{text}</font>
          </div>
        </div>
      );
    };

    const ElectionRow = ({
      electionId,
      electionTitle,
      electionAddress,
      startDate,
      endDate,
      status,
    }) => {
      return (
        <tr
          style={{ cursor: "pointer" }}
          onClick={() => {
            window.location.href = `/election?contractAddress=${electionAddress}`;
          }}
        >
          <td>{electionId}</td>
          <td className="tableDetails">
            <font>{electionTitle}</font>
            <br />
            <font className="text-muted" size="1">
              {electionAddress}
            </font>
          </td>
          <td>{startDate}</td>
          <td>{endDate}</td>
          <td>
            <Status
              status={status}
              text={status.charAt(0).toUpperCase() + status.slice(1)}
            />
          </td>
        </tr>
      );
    };

    const getTokens = () => {
      window.open('https://faucet.avax-test.network/', '_blank');
    }

    return (
      <div style={{ backgroundColor: "#f7f7f7", minHeight: "100%" }}>
        <Navbar header={userInfo?.name} infoText={userInfo?.contractAddress} pictureUrl="/assets/avatar.png"/>

        <div style={{ padding: "30px"}}>
          <div style={{ width: "100%" }}>
            <div style={{ float: "left" }}>
              <h4 style={{ marginBottom: "0px" }}>Dashboard</h4>
              <font size="2" className="text-muted">
                Agora Blockchain
              </font>
            </div>

            <div style={{ float: "right" }}>
              <CreateElectionModal UserContract={UserContract} account={userInfo?.publicAddress}/>
            </div>
          </div>

          <br />
          <br />
          <br />

          {UserContract &&
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
          </div>}

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
                      electionDetails?.map((election) => (
                      	<ElectionRow
                      		electionId = {election?.info?.id}
                      		electionTitle = {election?.info?.name}
                      		electionAddress = {election?.contractAddress}
                      		startDate = {(new Date(election?.info?.sdate * 1000)).toLocaleString()}
                      		endDate = {(new Date(election?.info?.edate * 1000)).toLocaleString()}
                      		status = {getStatus(election?.info?.sdate, election?.info?.edate)}
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

              <h4 style={{ marginBottom: "0px" }}>{balance} AVAX</h4>

              <br/>

              <div style={{overflow: "hidden", textOverflow: "ellipsis", width: "100%"}} className="text-muted">
                <EthAddress address={account}/>
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
  }, [UserContract, userInfo, electionDetails]);
};

export default Dashboard;