'use strict';

const express = require(`express`);
const { HttpCode } = require(`../constants`);
const { getMockData } = require(`../lib/get-mock-data`);
const routes = require(`../api`);

const DEFAULT_PORT = 3000;
const API_PREFIX = `/api`;

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    const app = express();
    app.use(express.json());
    app.use(API_PREFIX, routes);

    app.get(`/offers`, async (req, res) => {
      try {
        const mocks = await getMockData();
        res.json(mocks);
      } catch (err) {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
      }
    });

    app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));

    app.listen(port);
  }
};
