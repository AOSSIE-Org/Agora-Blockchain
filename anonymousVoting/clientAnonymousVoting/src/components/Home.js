import { useState } from 'react';
import { useEffect } from 'react';
import VotingProcess from './VotingProcess';

import { getVotingProcesses } from '../web3/contracts';

import { useDispatch, useSelector } from 'react-redux'
import { selectHasRegistered, selectTestState, setTestState } from '../store/home.slice';

const Home = () => {
    const [votingProcesses, setVotingProcesses] = useState([]);

    const hasRegistered = useSelector(selectHasRegistered);

    useEffect(() => {
        getVotingProcesses().then(
            res => {
                setVotingProcesses(res);
            }
        );
    }, [])

    const renderProcesses = () => {
        let retVal;
        if(hasRegistered){
            retVal = <div>

                    {votingProcesses.map( (votingProcess) => (
                        <VotingProcess className="VotingProcess" key={votingProcess.id} votingProcess = {votingProcess}/>
                    ))}
                </div>
        }else{
            retVal = <div style={{margin: "0 auto", justifyContent: "center", textAlign:"center"}}>
                <h1>please register</h1>
            </div>
        }
        return retVal
    } 

    return (  
        <div className="home">
            {renderProcesses()}
        </div>
    );

}
 
export default Home;