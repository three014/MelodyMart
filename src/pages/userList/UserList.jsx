import "./userList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      await userRequest.get("users/").then((response => {
        setUsers(response.data);
      })).catch(error => {
        const message = `An error occurred: ${error}`;
        window.alert(message);
      });
    }

    getUsers();
    return;
  }, [users.length]);

  async function deleteUser(id) {
    await fetch(`http://localhost:5000/user/${id}`, {
      method: "DELETE"
    });

    const newUsers = users.filter((user) => user._id !== id);
    setUsers(newUsers);
  }

  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "username",
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.avatar} alt="" />
            {params.row.username}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "transaction",
      headerName: "Transaction Volume",
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user/" + params.row.id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => deleteUser(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <DataGrid
        rows={users.map(userToRow)}
        disableSelectionOnClick
        columns={columns}
        pageSize={15}
        checkboxSelection
      />
    </div>
  );
}


function userToRow(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.img,
  }
}