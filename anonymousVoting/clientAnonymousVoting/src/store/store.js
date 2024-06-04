import { configureStore } from '@reduxjs/toolkit';
import homeReducer from './home.slice';

export const store = configureStore({
    reducer: {
        home: homeReducer,
    },
});