const express = require(`express`);
const request = require(`supertest`);

const categories = require(`./categories`);
const CategoriesService = require(`../data-service/categories`);
const { HttpCode } = require(`../constants`);

const mockData = [{"id":"di9AH2","category":["Журналы"],"description":"Даю недельную гарантию. Бонусом отдам все аксессуары. Кому нужен этот новый телефон, если тут такое... Мой дед не мог её сломать. Если товар не понравится — верну всё до последней копейки.","picture":"item10.jpg","title":"Куплю антиквариат.","type":"sale","sum":71396,"comments":[{"id":"pIy2t6","text":"Оплата наличными или перевод на карту? А где блок питания?"},{"id":"pQwE9s","text":"Неплохо, но дорого Совсем немного... С чем связана продажа? Почему так дешёво?"}]},{"id":"fmiQ5o","category":["Посуда","Журналы","Животные","Разное"],"description":"При покупке с меня бесплатная доставка в черте города. Товар в отличном состоянии. Даю недельную гарантию.","picture":"item13.jpg","title":"Продам отличную подборку фильмов на VHS.","type":"offer","sum":48495,"comments":[{"id":"pEeO-g","text":"А сколько игр в комплекте? Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца."},{"id":"Df79i_","text":"Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. А где блок питания?"},{"id":"dXwRj8","text":"А сколько игр в комплекте?"}]},{"id":"h02_DY","category":["Книги","Разное","Посуда","Животные","Игры"],"description":"Мой дед не мог её сломать. Если товар не понравится — верну всё до последней копейки.","picture":"item14.jpg","title":"Куплю детские санки.","type":"offer","sum":98011,"comments":[{"id":"Lc1NB1","text":"Продаю в связи с переездом. Отрываю от сердца. А сколько игр в комплекте? Вы что?! В магазине дешевле."},{"id":"UZ9dJM","text":"С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле. Почему в таком ужасном состоянии?"}]}];

const app = express();
app.use(express.json());
categories(app, new CategoriesService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(6));

  test(`Category names are "Журналы", "Посуда", "Животные", "Разное", "Книги", "Игры"`,
    () => expect(response.body).toEqual(
      expect.arrayContaining([`Журналы`, `Посуда`, `Животные`, `Разное`, `Книги`, `Игры`])
    )
  );
});
