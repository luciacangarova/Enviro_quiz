import {
  Link,
  LinkProps,
  Tab,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import { Link as RouterLink, useHistory } from 'react-router-dom';

export const NavTabLink: React.FC<LinkProps> = (props) => {
  const history = useHistory();
  return (
    <Tab
      _selected={{ color: mode("blue.600", "blue.200") }}
      _focus={{ shadow: "none" }}
      justifyContent="flex-start"
      px={{ base: 4, md: 6 }}
      onClick={()=>props.href? history.push(props.href) : {}}
    >
      <Link
        as={RouterLink}
        display="block"
        fontWeight="medium"
        lineHeight="1.25rem"
        color="inherit"
        _hover={{ color: mode("blue.600", "blue.200") }}
        _activeLink={{
          color: mode("blue.600", "blue.200"),
        }}
        to={props.href}
        {...props}
      />
    </Tab>
  );
};
