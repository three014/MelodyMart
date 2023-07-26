import { useState } from "react";
import "./newProduct.css";
import { addProduct } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";

//Represents a form for creating a new product

export default function NewProduct() {
  const [inputs, setInputs] = useState({});

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
  };

  return (
    <div className="newProduct">
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
          <label>Categories</label>
          <input type="text" placeholder="strings, brass" onChange={handleChange} name="categories" />
        </div>
        <div className="addProductItem">
          <label>In Stock</label>
          <select name="inStock" onChange={handleChange}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button onClick={handleClick} className="addProductButton"> Create </button>
      </form>
    </div>
  );
};