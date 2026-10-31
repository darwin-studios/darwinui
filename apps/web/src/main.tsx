import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { DarwinUIWebsite } from "@darwinui/website";
import "@darwinui/react/styles.css";
import "@darwinui/website/styles.css";
const root = document.getElementById("root")!;
if (root.hasChildNodes()) hydrateRoot(root, <DarwinUIWebsite />);
else createRoot(root).render(<DarwinUIWebsite />);
