import { useEffect, useState } from 'react';

export default function UserCall({drizzleVariables}) {
    const {drizzle, drizzleState, contracts, account} = drizzleVariables;

    // UserContract instance
    const UserContract = drizzle?.contracts[contracts[0]?.contractName]?.methods;
    const UserSubscriber = drizzleState?.contracts[contracts[0]?.contractName];

    // Cache keys
    const [userInfoKey, setUserInfoKey] = useState(null);
    const [eIdKey, setEIdKey] = useState(null);

    // Cache calls (values)
    const [eId, setEId] = useState(0);
    let [userInfo, setUserInfo] = useState({
        id: null,
        name: null,
        publicAddress: null,
        contractAddress: []
    });

    // Setting up user cache key and value
    useEffect(() => {
        setUserInfoKey(UserContract?.info?.cacheCall({from: account}));
        setEIdKey(UserContract?.electionId?.cacheCall({from: account}));

        const info = UserSubscriber?.info[userInfoKey]?.value;
        const _userInfo = {
            id: info?.userId,
            name: info?.name,
            publicAddress: info?.publicAddress,
            contractAddress: contracts[0]?.contractAddress
        }
        
        setUserInfo(_userInfo);
        setEId(UserSubscriber?.electionId[eIdKey]?.value);
    }, [UserSubscriber])

    return {UserContract, UserSubscriber, userInfo, eId};
}