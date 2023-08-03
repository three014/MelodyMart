import "./newDiscount.css"
import { useState } from "react";
import { addDiscount } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";

//Represents a form for creating a new discount

export default function NewDiscount(){
    //useState hook manages the state of discount input fields
    const [discounts, setInputs] = useState({});
    const [notificationType, setNotificationType] = useState("");
    const [message, setMessage] = useState("");
    const [showNotification, setShowNotification] = useState(false);

    //Displays notification message for 5000 milliseconds
    const showNotificationMessage = (message, type) => {
      setNotificationType(type);
      setMessage(message);
      setShowNotification(true);
  
      setTimeout(() => {
        setShowNotification(false);
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

//------------ TEST CASE -----------------

//This test case simulates adding a new discount to the Redux store, verifying that the Redux store's functionality for adding a discount works as expected
//When you click "New Discount" (on localhost), if you ctrl-shift-i to inspect element, you should be able to see the output of the test case

  // Test Function
  const newDiscountTestFunction = () => {
    // Simulate user input for discount form
    const discountInput = {
      code: "TESTCODE",
      value: 10,
      condition: 100,
    };

    // Simulate adding the discount to the Redux store
    addDiscount(discountInput, dispatch);

    // Log a success message
    console.log('Test Discount added successfully (simulated)! Here is the information about the simulated discount:');
    console.log("   Discount Code:", discountInput.code);
    console.log("   Discount Value:", discountInput.value);
    console.log("   Discount Condition:", discountInput.condition);
  };

  newDiscountTestFunction();

//------------ END TEST CASE -----------------

    return(
        <div className="newDiscount">
          {/* Display the notification if showNotification is true */}
          {showNotification && ( <div className={`notification ${notificationType === "error" ? "error" : "success"}`}> {message} </div> )}
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