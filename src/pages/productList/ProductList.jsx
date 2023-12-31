import "./productList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProducts } from "../../redux/apiCalls";

//Renders a list of products in a data grid that can be edited or deleted

export default function ProductList() {
  //Gets list of products from the Redux store
  const products = useSelector((state) => state.product.products);
  const [showNotification, setShowNotification] = useState(false);

  //Displays notification message for 3000 milliseconds
  const showNotificationMessage = () => {
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000); 
  };

  //Fetches products from server and makes an API call to populate list with products
  const dispatch = useDispatch();
  useEffect(() => {
    getProducts(dispatch);
  }, [dispatch]);
  
  const handleDelete = (id) => {
    deleteProduct(id, dispatch);
    showNotificationMessage();
  };
 
//------------ TEST CASE -----------------

//This test case renders the information for all of the products in the product list to show that it is being properly accessed
//When you click "View Products" (on localhost), if you ctrl-shift-i to inspect element, you should be able to see the output of the test case

const runTest = () => {
  products.forEach((product) => {
    console.log('Product ID: ' + product._id);
    console.log('Product Title: ' + product.title);
    console.log('Product Quantity: ' + product.quantity);
    console.log('Product Price: ' + product.price);
    console.log('Product Category: ' + product.categories[0]);
    console.log('===================================');
  });
};

runTest();

//------------ END TEST CASE -----------------
  
  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    { field: "product", headerName: "Product", width: 350,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.img} alt="" />
            {params.row.title}
          </div>
        );
      },
    },
    { field: "quantity", headerName: "Quantity", width: 150 },
    { field: "price", headerName: "Price", width: 160 },
    { field: "action", headerName: "Action", width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/product/" + params.row._id}>
              <button className="productListEdit"> Edit </button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="productList">
      {showNotification && <div className="deleteNotification">Deleted Product!</div>}
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row)=>row._id}
        pageSize={20}
      />
    </div>
  );
};