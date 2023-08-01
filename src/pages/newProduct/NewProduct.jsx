import { useState } from "react";
import "./newProduct.css";
import { addProduct } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";

//Represents a form for creating a new product

export default function NewProduct() {
  const [inputs, setInputs] = useState({});
  const [notificationType, setNotificationType] = useState("");
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  //Displays notification message for 3000 milliseconds
  const showNotificationMessage = (message, type) => {
    setNotificationType(type);
    setMessage(message);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000); 
  };

  //Stores user input for product form text fields
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  
  const dispatch = useDispatch();
  const handleClick = (e) => {
    e.preventDefault();
    const product = {...inputs, img: inputs.imageURL, categories: inputs.categories};
    addProduct(product, dispatch);
    showNotificationMessage("Created New Product!", "success");

    if( !product.imageURL || !product.title || !product.desc || !product.price || !product.quantity ){
      showNotificationMessage("Missing field(s)!", "error");
      return;
    }
  };

  return (
    <div className="newProduct">
      {/* Display the notification if showNotification is true */}
      {showNotification && ( <div className={`notification ${notificationType === "error" ? "error" : "success"}`}> {message} </div> )}
      <h1 className="addProductTitle">Create New Product</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>Image URL</label>
          <input name="imageURL" id="text" placeholder="Enter Image URL" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input name="title" type="text" placeholder="Product Name" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input name="desc" type="text" placeholder="Product Description" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Price</label>
          <input name="price" type="number" placeholder="Product Price" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Quantity</label>
          <input name="quantity" type="text" placeholder="Product Quantity" onChange={handleChange}/>
        </div>
        <div className="addProductItem">
          <label>Category</label>
            <select name="categories" onChange={handleChange}>
              <option value="Strings">Strings</option>
              <option value="Percussion">Percussion</option>
              <option value="Brass">Brass</option>
              <option value="Woodwinds">Woodwinds</option>
              <option value="Electronics">Electronics</option>
            </select>
        </div>
        <div className="addProductItem">
          <label>In Stock</label>
          <select name="inStock" onChange={handleChange}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button onClick={handleClick} className="addProductButton"> Create New Product </button>
      </form>
    </div>
  );
};