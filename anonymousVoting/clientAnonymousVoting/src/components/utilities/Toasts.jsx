import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const dangertoast = (id,msg) =>
toast.update(id, { render: msg,
type: "error", 
isLoading: false ,
theme: "dark",
position: "top-center",
autoClose: 1500,
hideProgressBar: false,
closeOnClick: true,
pauseOnHover: true,
draggable: true,
progress: undefined,});

export const warningtoast = (err) =>
  toast.warn(err, {
    theme: "dark",
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export const successtoast = (id,msg) =>
toast.update(id, { render: msg,
type: "success", 
isLoading: false ,
theme: "dark",
position: "top-center",
autoClose: 1500,
hideProgressBar: false,
closeOnClick: true,
pauseOnHover: true,
draggable: true,
progress: undefined,});
 
