import { useLocation } from "react-router-dom";
import "./product.css";
import { useSelector, useDispatch} from "react-redux";
import { updateProduct } from "../../redux/apiCalls";
import { useState } from "react";

export default function Product() {
  const [products, setInputs] = useState({});
  const dispatch = useDispatch();

  const location = useLocation();
  const productId = location.pathname.split("/")[2];

  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );

  const handleChange = (e) => {
      setInputs((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
  };

  const handleClick = (e) => {
      e.preventDefault();
      updateProduct(productId, products, dispatch); 
  };



  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
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
              <span className="productInfoKey">sales:</span>
              <span className="productInfoValue">5123</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">in stock:</span>
              <span className="productInfoValue">Yes</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">quantity:</span>
              <span className="productInfoValue">{product.quantity}</span>
            </div>
          </div>
        </div>
      </div>
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
            <label>In Stock</label>
            <select name="inStock" id="idStock">
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