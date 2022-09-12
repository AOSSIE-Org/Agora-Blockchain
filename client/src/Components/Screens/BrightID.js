import React from "react";
import QRCode from "react-qr-code";

import { useState, useEffect } from "react";
import { Flex, Modal, Button, Card } from "rimble-ui";
import Brightid from "../../build/BrightID.json";
import { ethers } from "ethers";

import background from "../assets/bg.jpg";
import brightidimg from "../assets/brightid.jpeg";

function BrightID() {
    // const [isOpen, setIsOpen] = useState(false);
  const [verified, setVerified] = useState(false);
  const [data, setData] = useState({
    addresses: [],
    timestamp: 0,
    v: 0,
    r: "",
    s: "",
  });
  const [verifiers, setVerifiers] = useState([]);
  const [content, setContent] = useState("Get BrightID verified!");

  let detail;
  const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

//   const closeModal = (e) => {
//     e.preventDefault();
//     setIsOpen(false);
//   };

//   const openModal = async (e) => {
//     e.preventDefault();
//     if (verified == false) setIsOpen(true);
//   };

  const value = `brightid://link-verification/http:%2f%2fnode.brightid.org/snapshot/0xa1C2668091b30CA136F065883bF8bE744bF6b37A`;

  const brightid = () => {
    fetch(
      "https://app.brightid.org/node/v5/verifications/snapshot/0xa1c2668091b30ca136f065883bf8be744bf6b37a?signed=eth&timestamp=seconds",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setData({
          addresses: data.data.contextIds,
          timestamp: data.data.timestamp,
          v: data.data.sig.v,
          r: "0x" + data.data.sig.r,
          s: "0x" + data.data.sig.s,
        });
        console.log("fetched", data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getVerifiers = async () => {

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          contractAddress,
          Brightid.abi,
          signer
        );

        detail = await contract.getVerifiers();
        setVerifiers(detail);

        if (verifiers[0] == "0xa1C2668091b30CA136F065883bF8bE744bF6b37A") {
          setContent("You're verified");
          setVerified(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const provehumanity = async (e) => {
    const { addresses, timestamp, v, r, s } = data;
    e.preventDefault();
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          contractAddress,
          Brightid.abi,
          signer
        );

        const transaction = await contract.verify(
          addresses,
          timestamp,
          v,
          r,
          s
        );
        await transaction.wait();
        console.log("success");
        setData({
          addresses: [],
          timestamp: 0,
          v: 0,
          r: "",
          s: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    brightid();
    getVerifiers();
  },[]);
  console.log("verifiers -> ", verifiers);
  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${background})`,
          height: "600px",
          backgroundSize: "1500px",
          backgroundRepeat: "no-repeat",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <h1 style={{ padding: "350px 0", textAlign: "center" }}>
          How To Get Verified with BrightID in 5 Steps!
        </h1>
      </div>
      <br />
      <br />
      <div style={{ textAlign: "center" }}>
        <h2>Step 1 : Download the BrightID App</h2>
        <img
          src={brightidimg}
          alt="brightid"
          style={{ height: "550px", width: "300px", margin: "10px" }}
        />

        <h2 style={{margin:"10px"}}>Step 2 : Join A BrightID Verification Meeting. </h2>
        <b>You can find out the next meeting <a href="https://meet.brightid.org/#/">over here.</a></b>
        <h2 style={{margin:"10px"}}>Step 3 : Link your account to our App. </h2>
        <h2 style={{margin:"10px"}}>Step 4 : Get Sponsored.. </h2>
        <h2 style={{margin:"10px"}}>Step 5 : Confirm Verification. </h2>
        <div>
            <p>Scan the QR Code to link to the BrightID!</p>

            <br />
          </div>

          <QRCode title="snapshot" value={value} />
          <Button ml={3} type="submit" onClick={provehumanity}>
            Confirm Verification!
          </Button>
      </div>
      <br /> <br />
    </div>
  );
}

export default BrightID;
