import "./sidebar.css";
import { LineStyle, PermIdentity, Storefront, AttachMoney, Add, LocalOffer } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

//Renders a sidebar menu with navigation links to carry out admin related tasks

export default function Sidebar() {
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState("");

  //Updates new selected menu item
  useEffect(() => {
    const path = location.pathname;
    setSelectedItem(path);
  }, [location]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className={`link ${selectedItem === "/" ? "active" : ""}`}>
            <li className="sidebarListItem">
              <LineStyle className="sidebarIcon" />
              Home
            </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/users" className={`link ${selectedItem === "/users" ? "active" : ""}`}>
              <li className="sidebarListItem">
                <PermIdentity className="sidebarIcon" />
                View Users
              </li>
            </Link>
            <Link to="/products" className={`link ${selectedItem === "/products" ? "active" : ""}`}>
              <li className="sidebarListItem">
                <Storefront className="sidebarIcon" />
                View Products
              </li>
            </Link>
            <Link to="/discounts" className={`link ${selectedItem === "/discounts" ? "active" : ""}`}>
              <li className="sidebarListItem">
                <LocalOffer className="sidebarIcon" />
                View Discounts
              </li>
            </Link>
            <Link to="/orders" className={`link ${selectedItem === "/orders" ? "active" : ""}`}>
              <li className="sidebarListItem">
                <AttachMoney className="sidebarIcon" />
                View Orders
              </li>
            </Link>
            <Link to="/newProduct" className={`link ${selectedItem === "/newProduct" ? "active" : ""}`}>
              <li className="sidebarListItem">
                <Add className="sidebarIcon" />
                New Product
              </li>
            </Link>
            <Link to="/newDiscount" className={`link ${selectedItem === "/newDiscount" ? "active" : ""}`}>
              <li className="sidebarListItem">
                <Add className="sidebarIcon" />
                New Discount
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}