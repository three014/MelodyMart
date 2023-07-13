import styled from "styled-components";
import {mobile} from "../responsive";
import { Link } from "react-router-dom";

const Container = styled.div`
    flex: 1;
    margin: 3px;
    height: 70vh;
    position: relative;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
    opacity: 0.6;
    ${mobile({ height: "20vh" })}
`;

const Info = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h1`
    color:black;
    text-align: center;
    margin-bottom: 20px;
    font-weight: bold;
`;

const Button = styled.button`
    border:none;
    padding: 10px;
    background-color: white;
    color: gray;
    cursor: pointer;
    font-weight: 600;
    border-radius: 10px;
`;

const CategoryItem = ({item}) => {
    return (
        <Container>
            <Link to={`/products/${item.category}`}>
            <Image src={item.img}/>
            <Info>
                <Title>{item.title}</Title>
            </Info>
            </Link>
        </Container>
    )
};

export default CategoryItem;