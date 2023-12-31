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
    const [showNotification, setShowNotification] = useState(false);

    //Displays notification message for 3000 milliseconds
    const showNotificationMessage = () => {
      setShowNotification(true);
  
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    };

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
        showNotificationMessage();
    };

//------------ TEST CASE -----------------

//This test case renders the information for the admin user and ensures all the information is correct
//When you click "edit" on a user (on localhost) if you ctrl-shift-i to inspect element, you should be able to see the output of the test case

    const userTest = useSelector((state) =>
        state.user.users.find((user) => user._id === "64ab8f932b905888464e2fda")
    );

    const userTestFunction = (userTest) => {
      console.log("Username: " + userTest.username);
      console.log("First Name: " + userTest.firstname);
      console.log("Last name: " + userTest.lastname);
      console.log("Email: " + userTest.email);
      console.log("isAdmin: " + userTest.isAdmin);
    }

//------------ END TEST CASE -----------------

  //Displays current information about a user
  return (
    <div className="user">
      {userTestFunction(userTest)}
      {showNotification && <div className="notification">Updated User Information!</div>}
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User Details</h1>
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
              <span className="userShowInfoTitle">User ID: {user._id}</span>
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
              <label>User Image URL</label>
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