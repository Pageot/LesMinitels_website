import { createHashRouter } from "react-router";
import Root from "./Root";
import Home from "./Home";
import Project from "./Project";
import PrivacyPolicy from "./PrivacyPolicy";

export const router = createHashRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "project/:id", Component: Project },
      { path: "project/:id/privacy", Component: PrivacyPolicy },
    ],
  },
]);
