import React from 'react';


import {Container, ToggleLabel, ToggleSelector} from './styles'

interface ITogglerProps {
    labelLeft: string;
    labelRight: string;
    checked: boolean;
    onChange(): void;   
}

const Toggle: React.FC<ITogglerProps> = ({
    labelLeft,
    labelRight,
    checked,
    onChange
}) => (
    <Container>
        <ToggleLabel>{labelLeft}</ToggleLabel>
        <ToggleSelector 
        checked={checked}
        uncheckedIcon={false}   
        checkedIcon={false} 
        onChange={onChange}

        />
        <ToggleLabel>{labelRight}</ToggleLabel>
    </Container>
)

export default Toggle;