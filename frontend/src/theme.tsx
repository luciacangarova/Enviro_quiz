import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { flipCardStyles } from "./components/FlipCard/FlipCard.style";

const config: ThemeConfig = {
  initialColorMode: "light",
};
const theme = extendTheme({ 
  config,         
  components: {
    FlipCard: flipCardStyles,
  }, 
});

export default theme;
