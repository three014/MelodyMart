import "./discountList.css"
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteDiscount } from "../../redux/apiCalls";

export default function DiscountList(){
    const dispatch = useDispatch();
    const discounts = useSelector((state) => state.discount.discounts);
    
    const handleDelete = (id) => {
        deleteDiscount(id, dispatch);
    };

    const columns = [
        { field: "_id", headerName: "ID", width: 150 },
        { field: "code", headerName: "Discount Code", width: 200 },
        { field: "value", headerName: "Value", width: 150 },
        { field: "condition", headerName: "Condition", width: 150 },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
              return (
                <>
                  <Link to={"/discount/" + params.row._id}>
                    <button className="discountListEdit">Edit</button>
                  </Link>
                  <DeleteOutline
                    className="discountListDelete"
                    onClick={() => handleDelete(params.row._id)}
                  />
                </>
              );
            },
          },
      ];
      
    return (
        <div className="discountList">
            <DataGrid
                rows={discounts}
                disableSelectionOnClick
                columns={columns}
                getRowId={(row)=>row._id}
                pageSize={15}
                checkboxSelection
            />
        </div>
    );
};