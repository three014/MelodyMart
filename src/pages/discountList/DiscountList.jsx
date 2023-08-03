import "./discountList.css"
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteDiscount, getDiscounts } from "../../redux/apiCalls";
import { useEffect, useState } from "react";

//Renders a list of discounts that can be edited or deleted

export default function DiscountList(){
    //useSelector hook accesses the discounts data from the Redux store
    const discounts = useSelector((state) => state.discount.discounts);
    const [showNotification, setShowNotification] = useState(false);

    //Displays notification message for 3000 milliseconds
    const showNotificationMessage = () => {
      setShowNotification(true);
  
      setTimeout(() => {
        setShowNotification(false);
      }, 3000); 
    };

    //Fetches list of discounts from server and stores in Redux state
    const dispatch = useDispatch();
    useEffect(() => {
      getDiscounts(dispatch);
    }, [dispatch]);
    
    const handleDelete = (id) => {
        deleteDiscount(id, dispatch);
        showNotificationMessage();
    };

//------------ TEST CASE -----------------

//This test case renders the information for all of the discounts in the discount list to show that it is being properly accessed
//When you click "View Discounts" (on localhost), if you ctrl-shift-i to inspect element, you should be able to see the output of the test case

const runTest = () => {
  discounts.forEach((discount) => {
    console.log('ID:', discount._id);
        console.log('Code:', discount.code);
        console.log('Value:', discount.value);
        console.log('Condition:', discount.condition);
        console.log('==========================');
  });
};

runTest();

//------------ END TEST CASE -----------------

    const columns = [
        { field: "_id", headerName: "ID", width: 250 },
        { field: "code", headerName: "Discount Code", width: 250 },
        { field: "value", headerName: "Value", width: 175 },
        { field: "condition", headerName: "Condition", width: 175 },
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
          {showNotification && <div className="deleteNotification">Deleted Discount!</div>}
            <DataGrid
                rows={discounts}
                columns={columns}
                getRowId={(row)=>row._id}
                pageSize={15}
            />
        </div>
    );
};