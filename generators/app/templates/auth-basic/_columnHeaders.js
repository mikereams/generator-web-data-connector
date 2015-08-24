    // Do the same to retrieve your actual data.
    $.ajax({
      url: buildApiFrom('path/to/your/metadata'),
      // Add basic authentication headers to your request like this. Note that
      // the password is encrypted when stored by Tableau; the username is not.
      headers: {
        Authorization: 'Basic ' + btoa(this.getUsername() + ':' + this.getPassword())
      },
      success: function dataRetrieved(response) {
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
