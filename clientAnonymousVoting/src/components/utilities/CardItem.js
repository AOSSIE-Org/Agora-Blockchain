import { ImageComponent } from "./Image";

export const CardItem = ({
    headerValue,
    descriptor,
    imgUrl,
    imgBackground = "#f7f7f7",
}) => {
    return (
        <div className="shadow cardItem">
            <div className="centered">
                <div
                    className="cardImageHolder"
                    style={{ backgroundColor: imgBackground }}
                >
                    <div className="centered">
                        <ImageComponent src={imgUrl} className="cardImage" />
                    </div>
                </div>

                <font size="2" className="cardText">
                    <font size="3">{headerValue}</font>
                    <span className="text-muted">{descriptor}</span>
                </font>
            </div>
        </div>
    );
};