import "./orderList.css"
import { DataGrid } from "@material-ui/data-grid";

export default function OrderList(){
    
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'userID', headerName: 'User ID', width: 150 },
        { field: 'amount', headerName: 'Number of Orders', width: 150 },
        { field: 'status', headerName: 'Order Status', width: 150 },
        { field: 'createdAt', headerName: 'Created At', width: 150 },
        { field: 'updatedAt', headerName: 'Updated At', width: 150 },
      ];
      
      const rows = [
        { id: 1, userID: '64ab8f932b905888464e2fda', amount: '50', status: 'Complete', createdAt: '2023-07-15T23:08:38.391+00:00', updatedAt: '2023-07-15T23:08:38.391+00:00'},
      ];
    
    return(
        <div className="orderList">
        
            <DataGrid
                rows={rows}
                disableSelectionOnClick
                columns={columns}
                pageSize={15}
                checkboxSelection
            />

        </div>

    )
}