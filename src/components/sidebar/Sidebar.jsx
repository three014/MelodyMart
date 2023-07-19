import "./sidebar.css";
import {
  LineStyle,
  PermIdentity,
  Storefront,
  AttachMoney,
  WorkOutline,
  Add,
  LocalOffer
} from "@material-ui/icons";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link">
            <li className="sidebarListItem active">
              <LineStyle className="sidebarIcon" />
              Home
            </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/users" className="link">
              <li className="sidebarListItem">
                <PermIdentity className="sidebarIcon" />
                View Users
              </li>
            </Link>
            <Link to="/products" className="link">
              <li className="sidebarListItem">
                <Storefront className="sidebarIcon" />
                View Products
              </li>
            </Link>
            <Link to="/discounts" className="link">
              <li className="sidebarListItem">
                <LocalOffer className="sidebarIcon" />
                View Discounts
              </li>
            </Link>
            <Link to="/orders" className="link">
              <li className="sidebarListItem">
                <AttachMoney className="sidebarIcon" />
                View Orders
              </li>
            </Link>
            <Link to="/newProduct" className="link">
              <li className="sidebarListItem">
                <Add className="sidebarIcon" />
                Add New Product
              </li>
            </Link>
            <Link to="/newDiscount" className="link">
              <li className="sidebarListItem">
                <Add className="sidebarIcon" />
                New Discount
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Staff</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <WorkOutline className="sidebarIcon" />
              Manage
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
