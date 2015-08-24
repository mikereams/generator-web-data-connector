  // You can write private methods for use above like this:

  /**
   * Helper function that encapsulates OAuth API access token retrieval.
   */
  function getNewAccessToken() {
    // The exact flow for token retrieval may differ from API to API. Here, you
    // might perform a redirect, check for a temporary code and swap it for the
    // access token, etc. Consult your API's documentation for detailed flow.

    // Once you get a valid OAuth token, store it on tableau.password.
    tableau.password = 'The OAuth access token, once retrieved';
  }

  /**
   * Helper function to build an API endpoint<%= props.needsProxy ? ' that uses our proxy' : '' %>.
   *
   * @param {string} path
   *   API endpoint path from which to build a full URL.
   *
   * @param {object} opts
   *   Options to inform query parameters and paging.
   */
  function buildApiFrom(path, opts) {
    opts = opts || {};
    path = '<%= props.needsProxy ? '/proxy?endpoint=' : 'https://api.example.com/' %>' + path;

    // If opts.last was passed, build the URL so the next page is returned.
    if (opts.last) {
      path += '<%= props.needsProxy ? '&' : '?' %>page=' + opts.last + 1;
    }

    return path;
  }
