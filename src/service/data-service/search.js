class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll(searchText) {
    console.log(searchText);
    return this._offers.filter((offer) => offer.title.includes(searchText));
  }
}

module.exports = SearchService;
