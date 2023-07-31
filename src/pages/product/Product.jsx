import { useLocation } from "react-router-dom";
import "./product.css";
import { useSelector, useDispatch} from "react-redux";
import { updateProduct } from "../../redux/apiCalls";
import { useState } from "react";

//Renders a view for updating product details

export default function Product() {
  //Keeps track of updated product information
  const [products, setInputs] = useState({});
  const [showNotification, setShowNotification] = useState(false);

  //Displays notification message for 3000 milliseconds
  const showNotificationMessage = () => {
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000); 
  };
  
  //Gets current product ID from URL
  const location = useLocation();
  const productId = location.pathname.split("/")[2];

  //Gets product details form the Redux store and finds product with matching ID in products array
  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );

  //Keeps track of changes in the update product form text fields
  const handleChange = (e) => {
      setInputs((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
  };

  //Updates product details on server and updates Redux store with new information
  const dispatch = useDispatch();
  const handleClick = (e) => {
      e.preventDefault();
      updateProduct(productId, products, dispatch); 
      showNotificationMessage();
  };

  //Displays current information about a product
  return (
    <div className="product">
      {showNotification && <div className="notification">Updated Product Information!</div>}
      <div className="productTitleContainer">
        <h1 className="productTitle">Edit Product Details</h1>
      </div>
      <div className="productTop">
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product.img} alt="" className="productInfoImg" />
            <span className="productName">{product.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id: </span>
              <span className="productInfoValue">{product._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">in stock:</span>
              <span className="productInfoValue">Yes</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">quantity:</span>
              <span className="productInfoValue">{product.quantity}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">price:</span>
              <span className="productInfoValue">${product.price}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">category:</span>
              <span className="productInfoValue">{product.categories}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form for updating product details */}
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <label>Product Name</label>
            <input name="title" type="text" placeholder={product.title} onChange={handleChange}/>
            <label>Product Description</label>
            <input name="desc" type="text" placeholder={product.desc} onChange={handleChange}/>
            <label>Product Image URL</label>
            <input name="img" type="text" placeholder={product.img} onChange={handleChange}/>
            <label>Price</label>
            <input name="price" type="text" placeholder={product.price} onChange={handleChange}/>
            <label>Quantity</label>
            <input name="price" type="text" placeholder={product.quantity} onChange={handleChange}/>
            <label>Category</label>
              <select name="categories" id="categories" placeholder={product.categories} onChange={handleChange}>
                <option value="Strings">Strings</option>
                <option value="Percussion">Percussion</option>
                <option value="Brass">Brass</option>
                <option value="Woodwinds">Woodwinds</option>
                <option value="Electronics">Electronics</option>
              </select>
            <label>In Stock</label>
            <select name="inStock" id="idStock" onChange={handleChange}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select> 
          </div> 
          <div className="productFormRight">
            <button onClick={handleClick} className="productButton">Update Product Details</button>
          </div>
        </form>
      </div>
    </div>
  );
};