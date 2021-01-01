const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const SearchService = require(`../data-service/search`);
const { HttpCode } = require(`../constants`);

const mockData = [
  {"id":"s3tKBl","category":["Животные","Книги","Разное"],"description":"Пользовались бережно и только по большим праздникам. Бонусом отдам все аксессуары. Если найдёте дешевле — сброшу цену. Кажется, что это хрупкая вещь.","picture":"item11.jpg","title":"Куплю антиквариат.","type":"sale","sum":36839,"comments":[{"id":"oLl7b0","text":"Оплата наличными или перевод на карту?"},{"id":"f-00RQ","text":"А где блок питания? А сколько игр в комплекте? Вы что?! В магазине дешевле."},{"id":"5d9D0T","text":"Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца."}]},
  {"id":"_xFYHh","category":["Книги","Разное","Журналы","Игры"],"description":"Если найдёте дешевле — сброшу цену.","picture":"item02.jpg","title":"Продам книги Стивена Кинга.","type":"sale","sum":51922,"comments":[{"id":"57BMyZ","text":"А где блок питания? Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?"}]},
  {"id":"L1fPN_","category":["Животные","Книги","Игры"],"description":"Если товар не понравится — верну всё до последней копейки. Даю недельную гарантию. Две страницы заляпаны свежим кофе. Это настоящая находка для коллекционера!","picture":"item02.jpg","title":"Куплю породистого кота.","type":"offer","sum":41201,"comments":[{"id":"MJqMwy","text":"С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?"},{"id":"_E9cnq","text":"Вы что?! В магазине дешевле. А где блок питания? Совсем немного..."},{"id":"Q5800q","text":"А сколько игр в комплекте? Вы что?! В магазине дешевле. Почему в таком ужасном состоянии?"}]},
  {"id":"i0unCo","category":["Журналы"],"description":"Продаю с болью в сердце... Это настоящая находка для коллекционера! Если товар не понравится — верну всё до последней копейки. Бонусом отдам все аксессуары.","picture":"item02.jpg","title":"Продам отличную подборку фильмов на VHS.","type":"sale","sum":27017,"comments":[{"id":"UpICHk","text":"С чем связана продажа? Почему так дешёво? Совсем немного..."}]},
  {"id":"LQBMUP","category":["Посуда","Разное","Игры","Журналы","Животные"],"description":"Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам. При покупке с меня бесплатная доставка в черте города. Это настоящая находка для коллекционера! Мой дед не мог её сломать.","picture":"item07.jpg","title":"Продам советскую посуду. Почти не разбита.","type":"offer","sum":86106,"comments":[{"id":"1zmSf8","text":"Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту?"},{"id":"n9fTML","text":"А сколько игр в комплекте? Совсем немного..."},{"id":"afURse","text":"Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту?"},{"id":"zNPvdn","text":"Неплохо, но дорого"}]},
];

const app = express();
app.use(express.json());
search(app, new SearchService(mockData));

describe(`API returns offer based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Куплю антиквариат.`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`s3tKBl`));
});

test(`API returns code 404 if nothing is found`,
  () => request(app)
    .get(`/search`)
    .query({
      query: `Продам свою душу`
    })
    .expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
  () => request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST)
);
