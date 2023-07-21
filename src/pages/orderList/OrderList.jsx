import "./orderList.css"
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../redux/apiCalls";
import { useEffect } from "react";


export default function OrderList(){
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.order.orders);

    useEffect(() => {
        getOrders(dispatch);
    }, [dispatch]);

    const columns = [
        { field: "_id", headerName: "ID", width: 100 },
        { field: "userID", headerName: "User ID", width: 150 },
        { 
            field: "products", 
            headerName: "Products", 
            width: 150,
            valueGetter: (params) => {
                const products = params.row.products.map(
                  (product) =>   `(Product ID: ${product.productID}) (Quantity: ${product.quantity})`
                );
                return products.join("\n\n");
            },
        },
        { field: "amount", headerName: "Total Amount", width: 200 },
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
