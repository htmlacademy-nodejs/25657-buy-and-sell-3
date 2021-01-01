const express = require(`express`);
const request = require(`supertest`);

const offers = require(`./offers`);
const OffersService = require(`../data-service/offers`);
const CommentsService = require(`../data-service/comments`);
const { HttpCode } = require(`../constants`);

const mockData = [{"id":"NmebcL","category":["Журналы","Животные","Разное","Книги","Игры"],"description":"Таких предложений больше нет! При покупке с меня бесплатная доставка в черте города. Бонусом отдам все аксессуары.","picture":"item04.jpg","title":"Продам советскую посуду. Почти не разбита.","type":"sale","sum":13395,"comments":[{"id":"pmOpY5","text":"Неплохо, но дорого А сколько игр в комплекте?"},{"id":"2u_Iox","text":"Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? Совсем немного..."}]},{"id":"O0jAFn","category":["Посуда","Журналы"],"description":"Это настоящая находка для коллекционера! Даю недельную гарантию.","picture":"item01.jpg","title":"Куплю антиквариат.","type":"sale","sum":67182,"comments":[{"id":"5_rVx0","text":"Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво?"}]},{"id":"MTisb1","category":["Журналы","Разное","Книги","Посуда","Животные"],"description":"Таких предложений больше нет! Продаю с болью в сердце... Две страницы заляпаны свежим кофе. При покупке с меня бесплатная доставка в черте города.","picture":"item06.jpg","title":"Продам отличную подборку фильмов на VHS.","type":"offer","sum":14855,"comments":[{"id":"X2j1w0","text":"Неплохо, но дорого Оплата наличными или перевод на карту? Почему в таком ужасном состоянии?"},{"id":"3GW0By","text":"Почему в таком ужасном состоянии? А сколько игр в комплекте? Совсем немного..."},{"id":"hkTfR4","text":"Неплохо, но дорого"}]},{"id":"48-5aO","category":["Разное","Животные","Игры","Журналы"],"description":"Кому нужен этот новый телефон, если тут такое... Таких предложений больше нет! Мой дед не мог её сломать.","picture":"item08.jpg","title":"Отдам в хорошие руки подшивку «Мурзилка».","type":"offer","sum":89759,"comments":[{"id":"vkZhdT","text":"Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого"},{"id":"8PtZlE","text":"А сколько игр в комплекте? Совсем немного..."},{"id":"_4bJfc","text":"С чем связана продажа? Почему так дешёво? А где блок питания? Совсем немного..."}]},{"id":"3rRSLo","category":["Игры","Книги"],"description":"Если товар не понравится — верну всё до последней копейки. Товар в отличном состоянии. Если найдёте дешевле — сброшу цену. Мой дед не мог её сломать.","picture":"item02.jpg","title":"Отдам в хорошие руки подшивку «Мурзилка».","type":"sale","sum":95784,"comments":[{"id":"-lBUm8","text":"Совсем немного..."},{"id":"t-MqI5","text":"А сколько игр в комплекте? Совсем немного..."},{"id":"PeO1Py","text":"А где блок питания? Почему в таком ужасном состоянии?"}]}];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offers(app, new OffersService(cloneData), new CommentsService());
  return app;
};

describe(`API returns a list of all offers`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
  test(`First offer's id equals "NmebcL"`, () => expect(response.body[0].id).toBe(`NmebcL`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/NmebcL`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Продам советскую посуду. Почти не разбита."`, () => expect(response.body.title).toBe(`Продам советскую посуду. Почти не разбита.`));
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offers count is changed`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = { ...newOffer };
      delete badOffer[key];
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/offers/O0jAFn`)
      .send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offer is really changed`, () => request(app)
    .get(`/offers/O0jAFn`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

test(`API returns status code 404 when trying to change non-existent offer`, () => {
  const app = createAPI();

  const validOffer = {
    category: `Это`,
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };

  return request(app)
    .put(`/offers/NOEXST`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, () => {
  const app = createAPI();

  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app)
    .put(`/offers/NOEXST`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/offers/MTisb1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`MTisb1`));

  test(`Offer count is 4 now`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent offer`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/offers/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
    .get(`/offers/48-5aO/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));

  test(`First comment's text is "Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого"`,
    () => expect(response.body[0].text).toBe(`Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого`));
});


describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/offers/48-5aO/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(app)
    .get(`/offers/48-5aO/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/offers/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/offers/48-5aO/comments`)
      .send({})
      .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/offers/48-5aO/comments/vkZhdT`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comments count is 2 now`, () => request(app)
    .get(`/offers/48-5aO/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/offers/3rRSLo/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, async () => {
  const app = await createAPI();

  return request(app)
  .delete(`/offers/NOEXST/comments/3rRSLo`)
  .expect(HttpCode.NOT_FOUND);
});
