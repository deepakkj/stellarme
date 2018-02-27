const express = require("express");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get("/", (req, res) => {
      return handle(req, res);
    });
    server.get("/get-link", (req, res) => {
      return handle(req, res);
    });
    server.get("/:username/", (req, res) => {
      const actualPage = "/processor";
      const mergedQuery = Object.assign(
        {},
        { reqQuery: req.query },
        { reqParams: req.params }
      );
      return app.render(req, res, actualPage, { cProps: mergedQuery });
    });

    server.get("/:username/:amount", (req, res) => {
      const actualPage = "/processor";
      const mergedQuery = Object.assign(
        {},
        { reqQuery: req.query },
        { reqParams: req.params }
      );
      return app.render(req, res, actualPage, { cProps: mergedQuery });
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3005, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3005");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
