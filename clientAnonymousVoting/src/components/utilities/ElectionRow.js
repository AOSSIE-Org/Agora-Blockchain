import { Status } from "./Status";

export const ElectionRow = ({
    electionId,
    electionTitle,
    electionAddress,
    startDate,
    endDate,
    status,
}) => {
    console.log(startDate,endDate);
    return (
        <tr
            style={{ cursor: "pointer" }}
            //added new param to send organizer address
            onClick={() => {
                window.location.href = `/election?electionAddress=${electionAddress}`;
            }}>
            <td>{electionId}</td>
            <td className="tableDetails">
                <font>{electionTitle}</font>
                <br />
                <font className="text-muted" size="1">
                    {electionAddress}
                </font>
            </td>
            <td>{startDate}</td>
            <td>{endDate}</td>
            <td>
                <Status
                    status={status}
                    text={status.charAt(0).toUpperCase() + status.slice(1)}
                />
            </td>
        </tr>
    );
};