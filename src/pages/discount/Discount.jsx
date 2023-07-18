import "./discount.css"
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Discount(){
    const location = useLocation();
    const discountId = location.pathname.split("/")[2];
    
    const discount = useSelector((state) =>
        state.discount.discounts.find((discount) => discount._id == discountId)
    );
    
    return(
        <div className="discount">
            <div className="discountTitleContainer">
                <h1 className="discountTitle">Discount</h1>
            </div>
            <div className="discountTop">
                <div className="discountTopRight">
                    <div className="discountInfoBottom">
                        <div className="discountInfoItem">
                            <span className="discountInfoKey">id: </span>
                            <span className="discountInfoValue">{discount._id}</span>
                        </div>
                        <div className="discountInfoItem">
                            <span className="discountInfoKey">code:</span>
                            <span className="discountInfoValue">{discount.code}</span>
                        </div>
                        <div className="discountInfoItem">
                            <span className="discountInfoKey">value:</span>
                            <span className="discountInfoValue">{discount.value}</span>
                        </div>
                        <div className="discountInfoItem">
                            <span className="discountInfoKey">condition:</span>
                            <span className="discountInfoValue">{discount.condition}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="discountBottom">
                <form className="discountForm">
                    <div className="discountFormLeft">
                        <label>Discount Code</label>
                        <input type="text" placeholder={discount.code} />
                        <label>Discount Value</label>
                        <input type="text" placeholder={discount.value} />
                        <label>Discount Condition</label>
                        <input type="text" placeholder={discount.condition} />
                    </div>
                    <div className="discountFormRight">
                        <button className="discountButton">Update</button>
                    </div>
                    </form>
                </div>
        </div>

    );
};