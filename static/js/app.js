function logRequest(reqUrl, response) {
  console.log(reqUrl, response);
  return response;
}

function logError(reqUrl, error) {
  console.log(reqUrl, error);
  return error;
}

function fetchResults(url) {
  // http://lhorie.github.io/mithril/web-services.html
  return m.request({
    url: url,
    initialValue: [],
    unwrapSuccess: function (response) {
      return response.data;
    },
    unwrapError: function (response) {
      return response.error;
    }
  }).then(logRequest.bind(this, url))
    .catch(logError.bind(this, url));
}

function paliStartsWith(searchTerms) {
  var url = "/api/pali/starts_with/" + searchTerms;
  return fetchResults(url);
}

function paliContains(searchTerms) {
  var url = "/api/pali/contains/" + searchTerms;
  return fetchResults(url);
}

function myanmarContains(searchTerms) {
  var url = "/api/myanmar/contains/" + searchTerms;
  return fetchResults(url);
}

var App = {
  pageTitle: m.prop("ပါဠိ မြန်မာ အဘိ​ဓာ​န​်"),
  searchOption: m.prop('paliStartsWith'),
  searchTerms: m.prop(''),
  searchResults: m.prop([]),
  onSearchOptionChanged: function (option) {
    this.searchOption = m.prop(option);
  },
  onSearch: function (searchTerms) {
    this.searchTerms = m.prop(searchTerms);
    switch (this.searchOption()) {
      case 'paliStartsWith':
        paliStartsWith(searchTerms).then(this.searchResults);
        break;
    }
  },

  view: function () {
    return m(".container", [
      m("h1.title.my", this.pageTitle()),
      m.component(SearchForm, {
        onSearch: this.onSearch,
        onSearchOptionChanged: this.onSearchOptionChanged
      }),
      m.component(SearchResults, {
        searchTerms: this.searchTerms(),
        results: this.searchResults()
      })
    ]);
  }
};

var SearchForm = {
  searchPlaceholder: m.prop('Search ...'),
  searchTerms: m.prop(''),
  searchButtonText: m.prop('ရှာ'),

  view: function (ctrl, args) {
    return m(".search-container", [
      m("input#search.my[type=search]", {
          placeholder: this.searchPlaceholder(),
          oninput: m.withAttr('value', this.searchTerms),
          value: this.searchTerms()
        }),
      m("button.search-icon.my[type=button]", {
          onclick: args.onSearch.bind(App, this.searchTerms())
        },
        this.searchButtonText())
    ]);
  }
};

var SearchResults = {
  view: function (ctrl, args) {
    var list = [];
    list = args.results.map(function (entry) {
      return list.concat([
        m("dt.term.my", [entry.pali]),
        m("dd.definition.my", [entry.mm])
      ]);
    });

    return m(".row", [
      list.length > 0 ? m("dl", list) : m('.not-found', args.searchTerms ? 'No entry found!' : '')
    ]);
  }
};

m.module(document.body, App);