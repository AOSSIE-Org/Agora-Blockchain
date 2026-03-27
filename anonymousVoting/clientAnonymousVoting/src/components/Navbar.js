import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { resetHomeState } from '../store/home.slice';
import './styles/Navbar.scss';

function Navbar({header, infoText, pictureUrl}) {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(resetHomeState());
    };

	return (
        <nav className="shadow-sm">
            <div className="navbarUserInfo">
                <img src={pictureUrl} alt="profile-pic" className="navbarProfilePic"/>
                <font size = "2" className="navbarUserText">
                    <span>{header}</span>
                    <span className="text-muted navbarAddress">{infoText}</span>
                </font>
            </div>

            <div className="navbarMenuOption">
                <img src="/assets/settings.png" className="navbarMenuIcon navbarMenuLeft" alt="settings"/>
                <Link to="/" onClick={handleLogout}><img src="/assets/logout.png" className="navbarMenuIcon" alt="logout"/></Link>
            </div>
        </nav>
	)
}

export default Navbar;
