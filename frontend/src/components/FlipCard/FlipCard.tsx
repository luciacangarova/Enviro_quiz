import React, { useState } from 'react';
import { Box, Container, useMultiStyleConfig } from '@chakra-ui/react';

interface Props {
  children: any;
  toggle: boolean;
}
   
function FlipCardTemplate({children, toggle} : Props) {
  const flipCardStyle = useMultiStyleConfig("FlipCard", { });
  //const [toggle, setToggle] = useState(false);
  return(
    <Container
      minWidth="full"
      height= "xl"
      marginLeft="-3"
    >
      <Box
        padding='32px'
        margin='10px'
        width='100%'
        height='100%'
        _light={{
          bg: 'lightgray'
        }}
        _dark={{
          bg: 'grey'
        }}
        rounded='xl'
        __css={toggle? flipCardStyle.flipContainer : flipCardStyle.container}
      >
        {toggle? 
        <Box __css={flipCardStyle.visibleSideBack}>
          {children.find((child:any) => child.type === Back)?.props.children}
        </Box>
        :
        <Box __css={flipCardStyle.visibleSideFront}>
          {children.find((child:any) => child.type === Front)?.props.children}
        </Box>
        }
      </Box>
    </Container>
  )
}

const Front: React.FC = () => null;
const Back: React.FC = () => null;

export const FlipCard = Object.assign(FlipCardTemplate, { Front, Back});