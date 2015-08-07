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
   * Helper function to build an API endpoint.
   */
  function buildApiFrom(path) {
    return 'https://api.example.com/' + path;
  }
