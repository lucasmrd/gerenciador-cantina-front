import styled, {keyframes} from 'styled-components';

const animate = keyframes`
    0% {
    transform: translateX(100px);
    opacity: 0;
    }
    50%{
        opacity: .3;
    }
    100%{
        transform: translateX(0px);
        opacity: 1;
    }
`;
interface ILegendProps {
    color: string;
}

export const Container = styled.div`
    width: 48%;
    min-height: 260px;

    margin: 10px 0;

    background-color: ${props => props.theme.colors.tertiary};    
    color: ${props => props.theme.colors.white};

    border-radius: 7px;

    display: flex;

    animation: ${animate} .5s;

    @media(max-width: 1220px){
        display: flex;
        flex-direction: column;

        width: 100%;
        height: auto;
    }
`;


export const SideLeft = styled.aside`
    flex: 1;
    padding: 30px 20px;

    > h2 {
        padding: 16px;
        margin-bottom: 10px;
    }

`;


export const SideRight = styled.main`
    flex: 1;
    min-height: 150px;

    display: flex;
    justify-content: center;

    padding-top: 35px;
`;


export const LegendContainer = styled.ul`
    list-style: none;

    height: 175px;
    padding-right: 15px;
    overflow-y: scroll;

    @media(max-width: 1220px){
        display: flex;

        height: auto;
    }
`;

export const Legend = styled.li<ILegendProps>`
    display: flex;
    align-items: center;

    margin-bottom: 7px;
    padding: 16px;

    > div {
        background-color: ${props => props.color};

        width: 40px;
        height: 40x;
        border-radius: 5px;

        font-size: 14px;
        line-height: 40px;
        text-align: center;
    }

    > span {
        margin-left: 5px;
    }

    @media(max-width: 1220px){
        > div {
        background-color: ${props => props.color};

        width: 30px;
        height: 30x;

        font-size: 10px;
        line-height: 30px;
    }
    }
`;