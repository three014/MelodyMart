import styled from "styled-components"

//Defines a React component called "Announcement" and renders an announcement section on the homepage

const Container = styled.div`
    height: 30px;
    background-color: teal;
    color:white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 1000;
`;

const Announcement = () => {
    return (
        <Container>
            Super Deal! Free Shipping on Orders Over $50
        </Container>
    )
};

export default Announcement;