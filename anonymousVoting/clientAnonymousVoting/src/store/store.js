import { configureStore } from '@reduxjs/toolkit';
import homeReducer, { HOME_INITIAL_STATE } from './home.slice';

const HOME_STORAGE_KEY = 'anonymousVoting.home';

const loadHomeState = () => {
    try {
        const serializedState = localStorage.getItem(HOME_STORAGE_KEY);
        if (!serializedState) {
            return undefined;
        }

        const parsedState = JSON.parse(serializedState);
        if (typeof parsedState?.hasRegistered !== 'boolean') {
            return undefined;
        }

        return {
            ...HOME_INITIAL_STATE,
            hasRegistered: parsedState?.hasRegistered ?? HOME_INITIAL_STATE.hasRegistered,
        };
    } catch (_error) {
        return undefined;
    }
};

const saveHomeState = (homeState) => {
    try {
        const serializedState = JSON.stringify({
            hasRegistered: Boolean(homeState?.hasRegistered),
        });
        localStorage.setItem(HOME_STORAGE_KEY, serializedState);
    } catch (_error) {
        // Ignore write errors (private mode, quota exceeded, etc.)
    }
};

const preloadedHomeState = typeof window !== 'undefined' ? loadHomeState() : undefined;
const preloadedState = preloadedHomeState ? { home: preloadedHomeState } : undefined;

export const store = configureStore({
    reducer: {
        home: homeReducer,
    },
    preloadedState,
});

if (typeof window !== 'undefined') {
    store.subscribe(() => {
        saveHomeState(store.getState().home);
    });
}