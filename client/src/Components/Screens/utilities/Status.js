import { COLORS } from "../../constants";

export 	const Status = ({ status, text }) => {
    return (
        <div style={{marginLeft: "5px", marginRight: "5px"}}>
            <div className="status">
                <div
                    className="statusIndicator"
                    style={{ backgroundColor: COLORS[status]}}
                ></div>
                
                <font>{text}</font>
            </div>
        </div>
    );
};