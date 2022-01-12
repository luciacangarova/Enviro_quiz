import { Box, Container } from "@chakra-ui/layout";
import { Tag } from "@chakra-ui/tag";
import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Play from "./components/Play";

const Home:React.FC = () => 
  <>
    <Tag size={"lg"} variant="solid" colorScheme="gray" marginTop={2} width={1500} marginX={3}>
      This quiz tests your knowledge of the topics related to climate change and sustainability
    </Tag>
  </>

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" exact component={() => <Home />} />
      <Route path="/play" component={Play} />
      <Route path="*" component={() => <p>not found</p>} />
    </Switch>
  );
}

export default AppRoutes;
