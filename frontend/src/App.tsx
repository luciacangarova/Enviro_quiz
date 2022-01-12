import * as React from "react";
import { Center } from "@chakra-ui/layout";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Navbar } from "./components/Navbar";
import { NavTabLink } from "./components/Navbar/NavTabLink";
import { FullPageProgress } from "./components/Spinner";
import AppRoutes from "./routes";

const text = "this is a test";

export function App() {
  // React.useEffect(() => {
  //   fetch(`/api/test?text=${text}`)
  //     .then((res) => res.json())
  //     .then(console.log);
  // });

  return (
    <React.Suspense fallback={<FullPageProgress />}>
      <Navbar>
        <Navbar.Brand>
          <Center marginEnd={6}>HCI Assessed Exercise</Center>
        </Navbar.Brand>
        <Navbar.Links>
          <NavTabLink href="/">Home</NavTabLink>
          <NavTabLink href="/play">Play</NavTabLink>
        </Navbar.Links>
        <Navbar.Settings>
          <ColorModeSwitcher />
        </Navbar.Settings>
      </Navbar>
      <AppRoutes />
    </React.Suspense>
  );
}
