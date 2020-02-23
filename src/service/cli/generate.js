'use strict';

const fs = require(`fs`).promises;
/** @member {Object} */
const chalk = require(`chalk`);
const {
  getRandomInt,
  shuffle,
} = require(`../utils`);

const DEFAULT_COUNT = 1;
const MAXIMUM_NUMBER_SENTENCES = 5;
const FILE_NAME = `mock.json`;

const OfferType = {
  offer: `offer`,
  sale: `sale`,
};

const SumRestrict = {
  min: 1000,
  max: 100000,
};

const PictureRestrict = {
  min: 1,
  max: 16,
};

const getPictureFileName = (randomInt) => {
  return `item${`${randomInt}`.padStart(2, '0')}.jpg`;
};

const readFileInfo = async (fileName) => {
  try {
    return (await fs.readFile(fileName, `utf-8`)).split(/\n/).filter(str => str !== '');
  } catch (error) {
    return console.error(chalk.red(`Can't read file ${fileName}`));
  }
};

const generateOffers = async (count) => {
  const sentences = await readFileInfo('data/sentences.txt');
  const titles = await readFileInfo('data/titles.txt');
  const categories = await readFileInfo('data/categories.txt');
  return Array(count).fill({}).map(() => ({
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
    description: shuffle(sentences).slice(0, getRandomInt(1, MAXIMUM_NUMBER_SENTENCES)).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.min, PictureRestrict.max)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.min, SumRestrict.max),
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Math.max(parseInt(count, 10) || DEFAULT_COUNT, DEFAULT_COUNT);
    const content = JSON.stringify(await generateOffers(countOffer));

    try {
      await fs.writeFile(FILE_NAME, content);
      return console.info(chalk.green(`Operation success. File created.`));
    } catch (error) {
      return console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
