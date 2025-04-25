import React from "react";

import { Container } from './styles';

interface ContentProps extends React.PropsWithChildren<{}> {}

const Content: React.FC<ContentProps> = ({ children }) => {
  return (
      <Container>
            { children }
      </Container>

  );
}; 

export default Content;