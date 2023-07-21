import "./newDiscount.css"
import { useState } from "react";
import { addDiscount } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";


export default function NewDiscount(){
    const [discounts, setInputs] = useState({});
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setInputs((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleClick = (e) => {
      e.preventDefault();
      addDiscount(discounts, dispatch); 
    };

    return(
        <div className="newDiscount">
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