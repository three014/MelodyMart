import "./newDiscount.css"
import { useState } from "react";
import { addDiscount } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";

//Represents a form for creating a new discount

export default function NewDiscount(){
    //useState hook manages the state of discount input fields
    const [discounts, setInputs] = useState({});
    const [showNotification, setShowNotification] = useState(false);

    //Displays notification message for 3000 milliseconds
    const showNotificationMessage = () => {
      setShowNotification(true);
  
      setTimeout(() => {
        setShowNotification(false);
      }, 3000); 
    };

    const handleChange = (e) => {
        setInputs((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const dispatch = useDispatch();
    const handleClick = (e) => {
      e.preventDefault();
      addDiscount(discounts, dispatch);
      showNotificationMessage(); 
    };

    return(
        <div className="newDiscount">
            {showNotification && <div className="notification">Created New Discount Code!</div>}
            <h1 className="addDiscountTitle">Create New Discount</h1>
            <form className="addDiscountForm">
                <div className="addDiscountItem">
                    <label> Discount Title </label>
                    <input name="title" type="text" placeholder="Discount Name" onChange={handleChange} />
                </div>

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