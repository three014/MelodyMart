import React from 'react'
import Announcement from '../components/Announcement';
import Navbar from "../components/Navbar"
import Slider from "../components/Slider"
import Categories from '../components/Categories';
import Products from '../components/Products';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

//Renders various components to create the main layout of the homepage

const Home = () => {
    return (
        <div>
            <Announcement />
            <Navbar/>
            <Slider/>
            <Categories/>
            <Products/>
            <Newsletter/>
            <Footer/>
        </div>
    );
};

export default Home;