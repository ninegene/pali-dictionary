function logRequest(reqUrl, response) {
  console.log(reqUrl, response);
  return response;
}

function onFetchResultsError(reqUrl, error) {
  console.error(reqUrl, error);
  return []; // return empty array on error
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
    .catch(onFetchResultsError.bind(this, url));
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

// put controller logic inside App instead of within controller function
var App = {
  pageTitle: m.prop("ပါဠိ မြန်မာ အဘိ​ဓာ​န​်"),
  searchOption: m.prop('paliStartsWith'),
  searchTerms: m.prop(''),
  searchResults: m.prop([]),

  onSearch: function (searchTerms) {
    this.searchTerms(searchTerms);
    switch (this.searchOption()) {
      case 'paliStartsWith':
        paliStartsWith(searchTerms).then(this.searchResults);
        break;
    }
  },

  onClearSearch: function () {
    this.searchTerms('');
  },

  onSearchOptionChanged: function (option) {
    this.searchOption = m.prop(option);
  },

  view: function () {
    return m(".container", [
      m("h1.title.my", this.pageTitle()),
      m.component(SearchForm, {
        onSearch: this.onSearch,
        onClearSearch: this.onClearSearch,
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
    var self = this;

    return m("form.search-wrapper", [
      m("input#search-box.my[type=search]", {
        placeholder: this.searchPlaceholder(),
        autocomplete: 'off',
        autofocus: true,
        required: true,
        oninput: m.withAttr('value', this.searchTerms),
        value: this.searchTerms()
      }),
      this.searchTerms() ?
        m("button.clear-search-icon.my[type=button]", {
            onclick: function () {
              this.searchTerms('');
              args.onClearSearch.bind(App)();
            }.bind(this)
          },
          'x')
        :
        null
      ,
      m("button.search-btn.my[type=button]", {
          onclick: function () {
            args.onSearch.bind(App)(self.searchTerms());
            document.getElementById('search-box').focus();
          }
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

    return m(".row.search-results", [
      list.length > 0 ? m("dl", list) : m('.not-found', args.searchTerms ? 'No entry found!' : '')
    ]);
  }
};

m.module(document.body, App);