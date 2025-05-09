import React from "react";

import { Grid } from './styles';
import MainHeader from "../MainHeader";
import Aside from "../Aside";
import Content from "../Content";

interface ContentProps extends React.PropsWithChildren<{}> {}

const Layout: React.FC<ContentProps> = ({ children }) => {
  return (
      <Grid>
            <MainHeader />
            <Aside />
            <Content>
              { children }
            </Content>
      </Grid>

  );
};

export default Layout;