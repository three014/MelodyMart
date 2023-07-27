import { LocationSearching, MailOutline, PermIdentity } from "@material-ui/icons";
import "./user.css";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { updateUser } from "../../redux/apiCalls";
import { useState } from "react";

//Renders a view for updating user details

export default function User() {
    //Keeps track of updated user information
    const [users, setUsers] = useState({});

    //Gets current user ID from URL
    const location = useLocation();
    const userId = location.pathname.split("/")[2];
    
    //Gets user details form the Redux store and finds user with matching ID in users array
    const user = useSelector((state) =>
        state.user.users.find((user) => user._id === userId)
    );

   //Keeps track of changes in the update product form text fields
    const handleChange = (e) => {
        setUsers((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
    };
    
    //Updates user details on server and updates Redux store with new information
    const dispatch = useDispatch();
    const handleClick = (e) => {
        e.preventDefault();
        updateUser(userId, users, dispatch); 
    };

  //Displays current information about a user
  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img src={user.img} alt="" className="userShowImg" />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user.firstname}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">Username: {user.username}</span>
            </div>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">Full Name: {user.firstname} {user.lastname}</span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">Email: {user.email}</span>
            </div>
            <div className="userShowInfo">
              <LocationSearching className="userShowIcon" />
              <span className="userShowInfoTitle">UserID: {user._id}</span>
            </div>
          </div>
        </div>

        {/* Form for updating user details */}
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit User Information</span>
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input name="username" type="text" placeholder={user.username} className="userUpdateInput" onChange={handleChange} />
              </div>
              <div className="userUpdateItem">
                <label>First Name</label>
                <input name="firstname" type="text" placeholder={user.firstname} className="userUpdateInput" onChange={handleChange} />
              </div>
              <div className="userUpdateItem">
                <label>Last Name</label>
                <input name="firstname" type="text" placeholder={user.lastname} className="userUpdateInput" onChange={handleChange} />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input name="email" type="text" placeholder={user.email} className="userUpdateInput" onChange={handleChange} />
              </div>
              <div className="userUpdateItem">
              <label>Product Image URL</label>
                <input name="img" type="text" placeholder={user.img} onChange={handleChange}/>
                </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img className="userUpdateImg" src={user.img} alt="" />
              </div>
              <button onClick={handleClick} className="userUpdateButton">Update User</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};