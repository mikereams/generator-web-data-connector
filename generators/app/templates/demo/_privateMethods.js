  /**
   * Private helper function to build the Google spreadsheet URL from the given
   * doc link.
   *
   * @param {string} docLink
   *   The docLink as provided by the user. Could be a URL or just the doc key.
   *
   * @returns {string}
   *   The URL to be accessed to retrieve JSON.
   */
  function buildConnectionUrl(docLink) {
    var regex = new RegExp('[\\?&]key=([^&#]*)'),
        results = regex.exec(docLink),
        docKey = results === null ? docLink : decodeURIComponent(results[1].replace(/\+/g, ' ')),
        urlParts;

    docKey = docKey.trim();
    if (docKey.indexOf('http') === 0) {
      urlParts = docKey.split('/');
      docKey = urlParts[5];
    }
    return 'http://spreadsheets.google.com/feeds/cells/' + docKey + '/default/public/values?alt=json';
  }
