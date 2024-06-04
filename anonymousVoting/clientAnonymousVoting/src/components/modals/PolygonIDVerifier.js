import { useState ,useEffect} from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import { ethers } from "ethers";
import ElectionOrganiser from "../../build/ElectionOrganizer.json";
import {successtoast, dangertoast } from '../utilities/Toasts';
import { toast } from "react-toastify";
import {addProposal} from '../../web3/contracts';
import QRCode from "react-qr-code";
import { io } from "socket.io-client";
const linkDownloadPolygonIDWalletApp =
  "https://0xpolygonid.github.io/tutorials/wallet/wallet-overview/#quick-start";

export function PolygonIDVerifier({
    credentialType,
    issuerOrHowToLink,
    onVerificationResult,
    publicServerURL,
    localServerURL,
  }) {
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState("");
  const [qrCodeData, setQrCodeData] = useState();
  const [isHandlingVerification, setIsHandlingVerification] = useState(false);
  const [verificationCheckComplete, setVerificationCheckComplete] =
    useState(false);
  const [verificationMessage, setVerfificationMessage] = useState("");
  const [socketEvents, setSocketEvents] = useState([])
    

    const closeModal = e => {
        e.preventDefault();
        setIsOpen(false);
    };

    const openModal = e => {
        e.preventDefault();
        setIsOpen(true);
    };



    //polygon id verifier



    const serverUrl = window.location.href.startsWith("https")
    ? publicServerURL
    : localServerURL;

  const getQrCodeApi = (sessionId) =>
    serverUrl + `/api/get-auth-qr?sessionId=${sessionId}`;

  const socket = io(serverUrl);

  useEffect(() => {
    console.log('url', serverUrl)
    socket.on("connect", () => {
      setSessionId(socket.id);

      // only watch this session's events
      socket.on(socket.id, (arg) => {
        setSocketEvents((socketEvents) => [...socketEvents, arg]);
      });
    });
  }, []);

  useEffect(() => {
    const fetchQrCode = async () => {
      const response = await fetch(getQrCodeApi(sessionId));
      const data = await response.text();
      return JSON.parse(data);
    };

    if (sessionId) {
      fetchQrCode().then(setQrCodeData).catch(console.error);
    }
  }, [sessionId]);

  // socket event side effects
  useEffect(() => {
    if (socketEvents.length) {
      const currentSocketEvent = socketEvents[socketEvents.length - 1];

      if (currentSocketEvent.fn === "handleVerification") {
        if (currentSocketEvent.status === "IN_PROGRESS") {
          setIsHandlingVerification(true);
        } else {
          setIsHandlingVerification(false);
          setVerificationCheckComplete(true);
          if (currentSocketEvent.status === "DONE") {
            setVerfificationMessage("✅ Verified proof");
            setTimeout(() => {
              reportVerificationResult(true);
            }, "2000");
            socket.close();
          } else {
            setVerfificationMessage("❌ Error verifying VC");
          }
        }
      }
    }
  }, [socketEvents]);

  const reportVerificationResult = (result) => {
    console.log("reporting verification result", result);
    // onVerificationResult(result);
  };

  function openInNewTab(url) {
    var win = window.open(url, "_blank");
    win.focus();
  }




    return (
        <div>
            {/* <div className="createElectionButton" onClick={openModal}>
        <img
          src="/assets/plus.png"
          alt="+"
          style={{ width: "15px", height: "15px", marginRight: "10px" }}
        />
        Get Verified
      </div> */}
      {sessionId ? (
        
        <div className="createElectionButton" onClick={openModal}>Get Verified</div>
     
       
      ) : (
        <div>Loading....</div>
      )}
            {qrCodeData && (
            <Modal isOpen={isOpen}>
                <Card width={"90%"} height={"max-content"} p={25} style={{maxWidth: "500px"}}>
                    <Button.Text
                        style={{margin: "0px"}}
                        icononly
                        icon={"Close"}
                        color={"moon-gray"}
                        position={"absolute"}
                        top={0}
                        right={0}
                        mt={3}
                        mr={3}
                        onClick={closeModal}
                    />
            <div style={{margin: "10px"}}>
                    Scan this QR code from your{" "}
              <a
                href={linkDownloadPolygonIDWalletApp}
                target="_blank"
                rel="noreferrer"
              >
                Polygon ID Wallet App
              </a>{" "}
               to prove access rights
                </div>

                    <div>
                    {isHandlingVerification && (
                <div>
                  <p>Authenticating...</p>
                  
                </div>
              )}
              {verificationMessage}
              {qrCodeData &&
                !isHandlingVerification &&
                !verificationCheckComplete && (
                 <div className='qrCode' style={{display:"flex"}} >
                    <div style={{margin:"auto"}}>
                    <QRCode value={JSON.stringify(qrCodeData)} />
                    </div>
                 </div>
                 
                )}
            <div style={{display:"flex" ,margin:"10px"}}>
            <div>
              {qrCodeData.body?.scope[0].query && (
                <p>Type: {qrCodeData.body?.scope[0].query.type}</p>
              )}

              {qrCodeData.body.message && <p>{qrCodeData.body.message}</p>}

              {qrCodeData.body.reason && (
                <p>Reason: {qrCodeData.body.reason}</p>
              )}
            <a href='https://issuer-demo.polygonid.me/main'>
            <div className="createElectionButton" >get your proof</div>
            </a>


            </div>
        </div>
                    </div>


                    

                   
        
                </Card>
            </Modal>
            )}
        </div>
    );
}