import discord from '../assets/discord.png';
import twitter from '../assets/twitter.png';
import github from '../assets/github.png';

const Footer = () => {
    return ( 
        <div className="footer">
            <div className="footerSubdiv">
                <div style={{marginTop: "1em", marginBottom: "1em"}}>
                    <h4>Contact</h4>
                </div>
                <div style={{display: "flex", margin: "0 auto", textAlign:"center", justifyContent:"center"}}>
                    <form action="https://discordapp.com/users/462281828657528844/" target="_blank">
                        <button type="submit">
                            <img width="25px" height="20px" src={discord} style={{float:"left"}} alt="not found"/>
                        </button>
                    </form>
                    {/* <button>
                        <img width="30px" src={twitter} style={{float:"left"}} alt="not found"/>
                    </button> */}
                    <form action="https://github.com/hadzija7" target="_blank">
                        <button>
                            <img width="25px" height="20px" src={github} style={{float:"left"}} alt="not found"/>
                        </button>
                    </form>
                </div>
            </div>
        </div>
     );
}
 
export default Footer;