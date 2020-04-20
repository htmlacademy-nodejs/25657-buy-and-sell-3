'use strict';

const express = require(`express`);
/** @member {Object} */
const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const DEFAULT_PORT = 3000;
const FILENAME = `mock.json`;

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    const app = express();
    app.use(express.json());

    app.get(`/offers`, async (req, res) => {
      try {
        const fileContent = await fs.readFile(FILENAME, `utf-8`);
        const mocks = JSON.parse(fileContent);
        res.json(mocks);
      } catch (err) {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
      }
    });

    app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));

    app.listen(port);
  }
};
