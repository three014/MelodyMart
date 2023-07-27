import { LocationSearching, MailOutline, PermIdentity } from "@material-ui/icons";
import "./user.css";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { updateUser } from "../../redux/apiCalls";
import { useState } from "react";

export default function User() {
   const [users, setUsers] = useState({});

    const location = useLocation();
    const userId = location.pathname.split("/")[2];
    const dispatch = useDispatch();
    
    const user = useSelector((state) =>
        state.user.users.find((user) => user._id === userId)
    );

    console.log(user);

    const handleChange = (e) => {
        setUsers((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
    };
    
    const handleClick = (e) => {
        e.preventDefault();
        updateUser(userId, users, dispatch); 
    };

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user.firstname}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">{user.username}</span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">{user.email}</span>
            </div>
            <div className="userShowInfo">
              <LocationSearching className="userShowIcon" />
              <span className="userShowInfoTitle">{user._id}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit User Information</span>
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  name="username"
                  type="text"
                  placeholder={user.username}
                  className="userUpdateInput"
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Full Name</label>
                <input
                  name="firstname"
                  type="text"
                  placeholder={user.firstname}
                  className="userUpdateInput"
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  name="email"
                  type="text"
                  placeholder={user.email}
                  className="userUpdateInput"
                  onChange={handleChange}
                />
              </div>
              <div className="userUpdateItem">
              <label>Product Image URL</label>
                <input name="img" type="text" placeholder={user.img} onChange={handleChange}/>
                </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt=""
                />
              </div>
              <button onClick={handleClick} className="userUpdateButton">Update User</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
