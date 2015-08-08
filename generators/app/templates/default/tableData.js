    // Logic to retrieve your data goes here. For example:
    $.getJSON(buildApiFrom('your/endpoint', {last: lastRecord}), function(response) {
      var processedData = [],
          // Determine if more data is available via paging.
          moreData = response.meta.page < response.meta.pages;

      // You may need to perform processing to shape the data into an array of
      // objects where each object is a map of column names to values.
      response.entities.forEach(function shapeData(entity) {
        processedData.push({
          column1: entity.columnOneValue,
          column2: entity.columnTwoValue
        });
      });

      // Once you've retrieved your data and shaped it into the form expected,
      // call the registerData function. If more data can be retrieved, then
      // supply a token to inform further paged requests.
      // @see buildApiFrom()
      if (moreData) {
        registerData(processedData, response.meta.page);
      }
      // Otherwise, just register the response data with the callback.
      else {
        registerData(processedData);
      }
    });
