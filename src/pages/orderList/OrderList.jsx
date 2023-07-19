import "./orderList.css"
import { DataGrid } from "@material-ui/data-grid";
import { useSelector } from "react-redux";


export default function OrderList(){
    const orders = useSelector((state) => state.order.orders);


    const columns = [
        { field: "_id", headerName: "ID", width: 100 },
        { field: "userID", headerName: "User ID", width: 150 },
        { field: "products", headerName: "Products", width: 150},
        { field: "amount", headerName: "Number of Orders", width: 200 },
        { field: "address", headerName: "Address", width: 150 },
        { field: "status", headerName: "Order Status", width: 170 },
        { field: "createdAt", headerName: "Created At", width: 150 },
        { field: "updatedAt", headerName: "Updated At", width: 150 },
    ];
      
    return(
        <div className="orderList">
            <DataGrid
                rows={orders}
                disableSelectionOnClick
                columns={columns}
                getRowId={(row)=>row._id}
                pageSize={15}
                checkboxSelection
            />
        </div>
    );
};