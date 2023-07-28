import "./discount.css"
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { updateDiscount } from "../../redux/apiCalls";
import { useState } from "react";

//Users can view and modify information of a specific discount

export default function Discount(){
    //useState hook will hold updated discount information
    const [discounts, setInputs] = useState({});
    const [showNotification, setShowNotification] = useState(false);

    //Displays notification message for 3000 milliseconds
    const showNotificationMessage = () => {
      setShowNotification(true);
  
      setTimeout(() => {
        setShowNotification(false);
      }, 3000); 
    };
    
    //Gets current location and extracts discount ID from URL path
    const location = useLocation(); 
    const discountId = location.pathname.split("/")[2];
    
    //Accesses Redux store and retrieves the specific discount object from the state based on extracted discount ID
    const discount = useSelector((state) =>
        state.discount.discounts.find((discount) => discount._id === discountId)
    );

    //Updates discounts state object to account for changes in form input fields 
    const handleChange = (e) => {
        setInputs((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
    };

    //Dispatches action to update the discount
    const dispatch = useDispatch();
    const handleClick = (e) => {
        e.preventDefault();
        updateDiscount(discountId, discounts, dispatch);
        showNotificationMessage(); 
    };

    //Displays current information about a discount
    return(
        <div className="discount">
            {showNotification && <div className="notification">Updated Discount Information!</div>}
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

            {/* Form for updating discount details */}
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