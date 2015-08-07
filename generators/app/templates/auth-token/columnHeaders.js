    // Make a request to the API using your API token like this:
    $.ajax({
      url: "https://api.example.com/path/to/your/metadata",
      headers: {
        // Note that the token is available on the "password" property of the
        // global tableau object. The password is encrypted when stored.
        Authorization: 'token ' + tableau.password
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
              type: response.properties[propName].type
            });
          }
        }

        // Once data is retrieved and processed, call registerHeaders().
        registerHeaders(processedColumns);
      }
    });
