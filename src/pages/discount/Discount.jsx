import "./discount.css"
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { updateDiscount } from "../../redux/apiCalls";
import { useState } from "react";

export default function Discount(){
    const [discounts, setInputs] = useState({});

    const location = useLocation();
    const discountId = location.pathname.split("/")[2];
    const dispatch = useDispatch();
    
    const discount = useSelector((state) =>
        state.discount.discounts.find((discount) => discount._id === discountId)
    );

    const handleChange = (e) => {
        setInputs((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
    };
    
    const handleClick = (e) => {
        e.preventDefault();
        updateDiscount(discountId, discounts, dispatch); 
    };

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
                        <input name="code" type="text" placeholder={discount.code} onChange={handleChange}/>
                        <label>Discount Value</label>
                        <input name="value" type="text" placeholder={discount.value} onChange={handleChange}/>
                        <label>Discount Condition</label>
                        <input name="condition" type="text" placeholder={discount.condition} onChange={handleChange}/>
                    </div>
                    <div className="discountFormRight">
                        <button onClick={handleClick} className="discountButton">Update</button>
                    </div>
                    </form>
                </div>
        </div>

    );
};