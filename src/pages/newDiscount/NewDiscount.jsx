import "./newDiscount.css"
import { useState } from "react";
import { addDiscount } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";

//Represents a form for creating a new discount

export default function NewDiscount(){
    //useState hook manages the state of discount input fields
    const [discounts, setInputs] = useState({});
    const [notificationMessage, setNotificationMessage] = useState("");
    const [showNotification, setShowNotification] = useState(false);

    //Displays notification message for 5000 milliseconds
    const showNotificationMessage = (message) => {
      setNotificationMessage(message);
      setShowNotification(true);
  
      setTimeout(() => {
        setShowNotification(false);
        setNotificationMessage("");
      }, 5000); 
    };

    const handleChange = (e) => {
        setInputs((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const dispatch = useDispatch();
    const handleClick = (e) => {
      e.preventDefault(); 
      
      //If any of the fields are missing
      if( !discounts.code || !discounts.value || !discounts.condition ){
        showNotificationMessage("Missing field(s)!", "error");
        return;
      }

      addDiscount(discounts, dispatch);
      showNotificationMessage("Created New Discount Code!", "success");
    };

    return(
        <div className="newDiscount">
          {showNotification && ( <div id="notification" className="notification"> {notificationMessage} </div> )}
            <h1 className="addDiscountTitle">Create New Discount</h1>
            <form className="addDiscountForm">
                <div className="addDiscountItem">
                    <label>Discount Code</label>
                    <input name="code" type="text" placeholder="Discount Code" onChange={handleChange} />
                </div>
                
                <div className="addDiscountItem">
                    <label>Value</label>
                    <input name="value" type="number" placeholder="Discount Value" onChange={handleChange} />
                </div>

                <div className="addDiscountItem">
                    <label>Condition</label>
                    <input name="condition" type="number" placeholder="Discount Condition" onChange={handleChange} />
                </div>

                <button onClick={handleClick} className="addDiscountButton"> Create Discount Code </button>
            </form>
        </div>
    );
};