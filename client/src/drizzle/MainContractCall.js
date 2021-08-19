import { useEffect, useState } from 'react';
import { USER_CONTRACT } from './constants'

export default function MainContract({drizzleVariables, pushNewContracts}) {
    const {drizzle, drizzleState, contracts, account} = drizzleVariables;
    
    // MainContract instance
    const MainContract = drizzle.contracts['MainContract']?.methods;
    const MainSubscriber = drizzleState?.contracts['MainContract'];

    // Cache keys
    const [isRegisteredKey, setIsRegisteredKey] = useState(null);

    // Cache calls (values)
    const [isRegistered, setIsRegistered] = useState([false, -1]);

    // Setting up main contract key and value
    useEffect(() => {
        setIsRegisteredKey(MainContract?.isRegistered?.cacheCall(account));
        setIsRegistered(MainSubscriber?.isRegistered[isRegisteredKey]?.value);
    }, [MainSubscriber])

    if(isRegistered && isRegistered[0] != 0) {
        MainContract?.Users(isRegistered[1])?.call().then((user) => {
            pushNewContracts(user.contractAddress, user.contractAddress, USER_CONTRACT)
        })
    }

    return { MainContract, MainSubscriber, isRegistered };
}