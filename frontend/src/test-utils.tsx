import * as React from "react";
import { render as defaultRender, RenderOptions } from "@testing-library/react";
import { AppProviders } from "./providers";

const wrapper = AppProviders as React.FC;

const customRender = (ui: RenderUI, options?: RenderOptions) =>
  defaultRender(ui, { wrapper, ...options });

export * from "@testing-library/react";
export { customRender as render };

type DefaultParams = Parameters<typeof defaultRender>;
type RenderUI = DefaultParams[0];
