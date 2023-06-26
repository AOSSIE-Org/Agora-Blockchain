import { createSlice } from '@reduxjs/toolkit';

export const homeSlice = createSlice({
    name:'home',
    initialState:{
        hasRegistered: false,
        network: '',
        correctNetwork: true,
    },
    reducers:{
        setHasRegistered: (state, action)=>{
            state.hasRegistered = action.payload;
        },
        setNetwork: (state, action)=>{
            state.network = action.payload;
        },
        setCorrectNetwork: (state, action)=>{
            state.correctNetwork = action.payload;
        }
    },
});

export const selectHasRegistered = (state) => state.home.hasRegistered;
export const selectNetwork = (state) => state.home.network;
export const selectCorrectNetwork = (state) => state.home.correctNetwork;

export const { setHasRegistered, setNetwork, setCorrectNetwork } = homeSlice.actions;

export default homeSlice.reducer