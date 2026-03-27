import { createSlice } from '@reduxjs/toolkit';

export const HOME_INITIAL_STATE = {
    hasRegistered: false,
    network: '',
    correctNetwork: true,
};

export const homeSlice = createSlice({
    name:'home',
    initialState: HOME_INITIAL_STATE,
    reducers:{
        setHasRegistered: (state, action)=>{
            state.hasRegistered = action.payload;
        },
        setNetwork: (state, action)=>{
            state.network = action.payload;
        },
        setCorrectNetwork: (state, action)=>{
            state.correctNetwork = action.payload;
        },
        resetHomeState: () => {
            return HOME_INITIAL_STATE;
        }
    },
});

export const selectHasRegistered = (state) => state.home.hasRegistered;
export const selectNetwork = (state) => state.home.network;
export const selectCorrectNetwork = (state) => state.home.correctNetwork;

export const { setHasRegistered, setNetwork, setCorrectNetwork, resetHomeState } = homeSlice.actions;

export default homeSlice.reducer