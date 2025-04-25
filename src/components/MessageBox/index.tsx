import React from "react";


import { Container } from './styles';
import { time } from "console";

interface IMessageBoxProps {
    title: string;
    description: string;
    footerText: string;
    icon: string;
}

const MessageBox: React.FC<IMessageBoxProps> = ({
    title,
    description,
    footerText,
    icon,
}) => {
    return (
        <Container>
            <header>
                <h1>
                    {title} 
                    <img src={icon} alt={title} />
                </h1>
                <p>{description}</p>
            </header>

            <footer>
                <span>{footerText}</span>
            </footer>
        </Container>
    )
};

export default MessageBox;