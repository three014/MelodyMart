import styled from "styled-components";
import Navbar from "../components/Navbar"
import Announcement from "../components/Announcement";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { Add, Remove } from "@mui/icons-material";
import { mobile } from "../responsive";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods";
import { addProduct } from "../redux/cartRedux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

//Displays information about a specific product (including image, title, description, and price)
//Users can adjust the quantity of the product and add to cart

const Container = styled.div``;

const Wrapper = styled.div`
    padding: 50px;
    display: flex;
    background-color: #f5fafd;
    ${mobile({ padding: "10px", flexDirection: "column" })}
`;

const ImgContainer = styled.div`
    flex: 1;
`;

const BlackContainer = styled.div`
    height: 3px;
    background-color: black;
`;

const Image = styled.img`
    width: 100%;
    height: 100vh;
    object-fit: contain;
    ${mobile({ height: "40vh" })}
`;

const HomeContainer = styled.div`
    flex: 1;
    padding: 25px 25px;
    ${mobile({ padding: "10px" })}
`;

const InfoContainer = styled.div`
    flex: 1;
    padding: 0px 50px;
    ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
    font-weight: 200;
`;

const Desc = styled.p`
    margin: 20px 0px;
`;

const Price = styled.span`
    font-weight: 100;
    font-size: 40px;
`;

const AddContainer = styled.div`
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    ${mobile({ width: "100%" })}
`;

const AmountContainer = styled.div`
    display: flex;
    align-items: center;
    font-weight: 700;
`;

const Amount = styled.span`
    width: 30px;
    height: 30px;
    border-radius: 10px;
    border: 1px solid teal;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px 5px;
`;

const Button = styled.button`
    padding: 15px;
    border: 2px solid teal;
    background-color: white;
    cursor: pointer;
    font-weight: 500;

    &:hover{
        background-color: #f8f4f4;
    }
`;

const Product = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await publicRequest.get("/products/find/"+id);
                setProduct(res.data);
            } catch {}
        };
        getProduct()
    }, [id]);

    const handleQuantity = (type) => {
        if (type === "dec") {
          quantity > 1 && setQuantity(quantity - 1);
        } else {
          setQuantity(quantity + 1);
        }
      };
    
    const handleClick = () => {
        dispatch(
            addProduct({ ...product, quantity})
        );
    };

    return (
        <Container>
            <Navbar/>
            <Announcement/>
            <HomeContainer>
                <Link to="/">
                    <Button>BACK HOME</Button>
                </Link>
            </HomeContainer>
            <BlackContainer></BlackContainer>
            <Wrapper>
                <ImgContainer>
                    <Image src={product.img} />
                </ImgContainer>
                <InfoContainer>
                    <Title>{product.title}</Title>
                    <Desc>
                        {product.desc}
                    </Desc>
                    <Price>$ {product.price}</Price>
                    <AddContainer>
                        <AmountContainer>
                            <Remove onClick={() => handleQuantity("dec")} />
                            <Amount>{quantity}</Amount>
                            <Add onClick={() => handleQuantity("inc")} />
                        </AmountContainer>
                        <Button onClick={handleClick}>ADD TO CART</Button>
                    </AddContainer>
                </InfoContainer>
            </Wrapper>
            <BlackContainer></BlackContainer>
            <Newsletter/>
            <Footer/>
        </Container>
    );
};

export default Product;
