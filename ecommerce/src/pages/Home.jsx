import React from 'react'
import Announcement from '../components/Announcement';
import Navbar from "../components/Navbar"
import Slider from "../components/Slider"
import Categories from '../components/Categories';
import Products from '../components/Products';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import styled from "styled-components";

//Renders various components to create the main layout of the homepage

const Title = styled.h1`
    padding-top: 100px;
    padding-bottom: 20px;
    text-align: center;
    font-size: 50px;
`;

const Home = () => {
    return (
        <div>
            <Announcement />
            <Navbar/>
            <Slider/>
            <Categories/>
            <Title>EXPLORE</Title>
            <Products/>
            <Newsletter/>
            <Footer/>
        </div>
    );
};

export default Home;