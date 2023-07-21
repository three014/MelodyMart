import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import Login from "./pages/login/Login";
import DiscountList from "./pages/discountList/DiscountList";
import NewDiscount from "./pages/newDiscount/NewDiscount";
import Discount from "./pages/discount/Discount";
import OrderList from "./pages/orderList/OrderList";


//<Route path="/login" element={<Login/>} />

function App() {
  /*const admin = JSON.parse(
    JSON.parse(localStorage.getItem("persist:root")).user
  ).currentUser.isAdmin;*/
  const admin = true
  return (
    <Router>
      <>
        <Topbar />
        <div className="container">
          <Sidebar />
          <Routes>
            <Route
              path="/login" element={<Login />}
            />
            <Route exact path="/" element={<Home />}></Route>
            <Route path="/users" element={<UserList />}></Route>
            <Route path="/user/:userId" element={<User />}></Route>
            <Route path="/newUser" element={<NewUser />}></Route>
            <Route path="/products" element={<ProductList />}></Route>
            <Route path="/product/:productId" element={<Product />}></Route>
            <Route path="/newProduct" element={<NewProduct />}></Route>
            <Route path="/discounts" element={<DiscountList />}></Route>
            <Route path="/newDiscount" element={<NewDiscount />}></Route>
            <Route path="/discount/:discountId" element={<Discount />}></Route>
            <Route path="/orders" element={<OrderList />}></Route>
          </Routes>
        </div>
      </>
    </Router>
  );
}; 

export default App;
