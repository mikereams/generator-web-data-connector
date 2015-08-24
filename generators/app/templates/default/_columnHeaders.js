    // Potentially, your connector has a fixed set of columns that you could
    // pass statically, like this:
    registerHeaders([{
      name: 'column1',
      type: 'int',
      // If your connector supports incremental refreshing, indicate the column
      // on which the refresh should be based like this:
      incrementalRefresh: true
    }, {
      name: 'column2',
      type: 'string'
    }]);

    // Or perhaps you're accessing an API that provides properties as metadata
    // that you could fetch, process, and pass like this:
    $.getJSON(buildApiFrom('your/api/metadata/endpoint'), function(response) {
      var processedColumns = [],
          propName;

      for (propName in response.properties) {
        if (response.properties.hasOwnProperty(propName)) {
          processedColumns.push({
            name: propName,
            type: response.properties[propName].type
          });
        }
      }

      // Once data is retrieved, call the registerHeaders() method.
      registerHeaders(processedColumns);
    // Use this.ajaxErrorHandler for basic error handling.
    }).fail(this.ajaxErrorHandler);

    // You may also have to retrieve some data and infer the columns and their
    // types from the first row of data. This exercise left to the reader.
