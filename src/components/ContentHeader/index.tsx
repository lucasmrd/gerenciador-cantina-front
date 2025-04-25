import React from "react";

import SelectInput from "../../components/SelectInput";

import {Container, TitleContainer, Controllers} from './styles';

interface IContenteHeaderProps {
    title: string;
    lineColor: string;
    children: React.ReactNode;
}

const ContentHeader: React.FC<IContenteHeaderProps> = ({ title, lineColor, children }) => {

    return (
        <Container>
            <TitleContainer lineColor={lineColor}>
                <h1>{title}</h1>
            </TitleContainer>
            <Controllers>
                {children}
            </Controllers>
        </Container>
    );
};

export default ContentHeader;

