  // You can write private methods for use above like this:

  /**
   * Helper function to build an API endpoint.
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
