import React from "react";
import { renderToString } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import { DarwinUIWebsite } from "../packages/website/src/index.js";
const path = "dist/index.html";
writeFileSync(
  path,
  readFileSync(path, "utf8").replace(
    '<div id="root"></div>',
    '<div id="root">' + renderToString(<DarwinUIWebsite />) + "</div>",
  ),
);
