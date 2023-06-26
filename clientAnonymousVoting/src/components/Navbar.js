import { Link } from 'react-router-dom';

import ConnectWallet from './ConnectWallet';

import { useSelector } from 'react-redux'
import { selectHasRegistered, selectNetwork } from '../store/home.slice';


const Navbar = () => {
    const HARMONY_TESTNET_ID = "1666700000";

    const hasRegistered = useSelector(selectHasRegistered);
    const networkId = useSelector(selectNetwork);

    const renderRegisterButton = () => {
        let button;
        if (hasRegistered){
            button = <div>
                <Link className="link" to="/">Home</Link>
                <Link className="link" to="/createProcess">Create voting process</Link>
            </div>
        }
        return button;
    }

    const renderNetwork = () => {
        let ret;
      
            ret = <div className="networkLabel">connected</div>
        
        return ret;
    }

    return (  
        <nav className="navbar">
            {/* <Link className="link" to="/"><img width="200px;" src={logo} alt="loading..."/></Link> */}
            {/* <Link className="link" to="/"><img width="200px;" alt="..."/></Link> */}
            <div className="links">
                {renderRegisterButton()}
            </div>
            <div>
                {renderNetwork()}
            </div>
            <div>
                <ConnectWallet />
            </div>
        </nav>
    );
}
 
export default Navbar;