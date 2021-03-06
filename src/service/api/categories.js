const { Router } = require(`express`);
const { HttpCode } = require(`../constants`);

const route = new Router();

module.exports = (app, categoryService) => {
  app.use(`/categories`, route);

  route.get(`/`, (req, res) => {
    const categories = categoryService.findAll();
    res.status(HttpCode.OK).json(categories);
  });
};
