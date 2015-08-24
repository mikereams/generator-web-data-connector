    // Make a request to the API using your API token like this:
    $.ajax({
      url: buildApiFrom('path/to/your/metadata'),
      headers: {
        // Note that the token is available as the "password" associated with
        // this connection. The password/token value is encrypted when stored.
        Authorization: 'token ' + this.getPassword()
      },
      success: function columnHeadersRetrieved(response) {
        var processedColumns = [],
            propName;

        // If necessary, process the response from the API into the expected
        // format (highlighted below):
        for (propName in response.properties) {
          if (response.properties.hasOwnProperty(propName)) {
            processedColumns.push({
              name: propName,
              type: response.properties[propName].type,
              // If your connector supports incremental extract refreshes, you
              // can indicate the column to use for refreshing like this:
              incrementalRefresh: propName === 'entityId'
            });
          }
        }

        // Once data is retrieved and processed, call registerHeaders().
        registerHeaders(processedColumns);
      },
      // Use this.ajaxErrorHandler for basic error handling.
      error: this.ajaxErrorHandler
    });
