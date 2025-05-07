import styled from 'styled-components';

export const Container = styled.div`
    height: 100vh;

    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: ${props => props.theme.colors.primary};
`;
 
export const Logo = styled.div`
    display: flex;
    align-items: center;

    margin-bottom: 30px;

    > h2 {
        color: ${props => props.theme.colors.white};
        margin-left: 7px;
        font-size: 36px;
    }

    > img {
        width: 52px;
        height: 52px;
        border-radius: 7px;
    }
`;


export const Form = styled.form`
    width: 570px;
    height: 320px;

    padding: 30px;

    border-radius: 10px;
    background-color: ${props => props.theme.colors.tertiary};

    > input {
        width: 100%;
        height: 38px;
        font-size: 14px;
    }

    > button {
        margin-top: 15px;
    }
    
`;


export const FormTitle = styled.h1`
    margin-bottom: 40px;
    color: ${props => props.theme.colors.white};

    &::after {
        content: '';
        display: block;
        width: 55px;
        border-bottom: 10px solid ${props => props.theme.colors.warning};
    }
`;