import styled from "styled-components";
import Product from "./Product";
import React, { useEffect, useState } from "react";
import axios from "axios";

//Defines a React component called "Products" that displays a list of products based on various filters and sorting options
//Fetches data from an API using Axios and displays products

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const Products = ({ category,filters,sort }) => {
    //"products" holds the full list of products fetched from the API
    const [products,setProducts] = useState([]);

    //"filteredProducts" holds the list of products after filters/sorting option is applied
    const [filteredProducts, setFilteredProducts] = useState([]);

    //When the category prop changes, fetches products from the API
    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get(
                    category
                    ? `http://localhost:5000/api/products?category=${category}`
                    : "http://localhost:5000/api/products"
                );
                setProducts(res.data);
            } catch (err) {}
        };
        getProducts()
    },[category]);

    //Applies filters to products
    useEffect(() => {
        category && setFilteredProducts(
            products.filter(item =>
                Object.entries(filters).every(([key, value]) =>
                    item[key].includes(value)
                )
            )
        );
    },[products,category, filters]);

    //Applies sorting to products
    useEffect(() => {
        if (sort === "newest") {
          setFilteredProducts((prev) =>
            [...prev].sort((a, b) => a.createdAt - b.createdAt)
          );
        } else if (sort === "asc") {
          setFilteredProducts((prev) =>
            [...prev].sort((a, b) => a.price - b.price)
          );
        } else {
          setFilteredProducts((prev) =>
            [...prev].sort((a, b) => b.price - a.price)
          );
        }
      }, [sort]);

    
    //If a category is provided, displays filteredProducts array
    //If no category is provided, displays first 20 producst from the products array using the slice method
    return (
      <div>
        <Container>
            {category
                ? filteredProducts.map((item) => <Product item={item} key={item.id} />)
                : products
                    .slice(0, 20)
                    .map((item) => <Product item={item} key={item.id} />)}
        </Container>
        </div>
    );
};

export default Products;
