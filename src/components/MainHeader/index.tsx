import React, { useMemo, useState } from "react";
import Toggle from "../Toggler";
import emojis from "../../utils/emojis";
import { useTheme } from "../../hooks/theme";
import { useAuth } from "../../hooks/auth";            
import { Container, Profile, Welcome, UserName } from "./styles";

const MainHeader: React.FC = () => {
  const { toggleTheme, theme } = useTheme();
  const { userName } = useAuth();
  const [darkTheme, setDarkTheme] = useState(
    () => (theme.title === "dark")
  );

  const handleChangeTheme = () => {
    setDarkTheme(!darkTheme);
    toggleTheme();
  };

  const emoji = useMemo(() => {
    const indice = Math.floor(Math.random() * emojis.length);
    return emojis[indice];
  }, []);

  return (
    <Container>
      <Toggle
        labelLeft="Light"
        labelRight="Dark"
        checked={darkTheme}
        onChange={handleChangeTheme}
      />

      <Profile>
        <Welcome>Olá, {emoji}</Welcome>
        <UserName>{userName ?? "Visitante"}</UserName>
      </Profile>
    </Container>
  );
};

export default MainHeader;
