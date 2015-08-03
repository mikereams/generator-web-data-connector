    // Logic to retrieve your data goes here. For example:
    $.getJSON(buildApiFrom('your/api/endpoint?format=json'), function(response) {
      var processedData = [];

      // You may need to perform processing to shape the data into an array of
      // objects where each object is a map of column names to values.
      response.entities.forEach(function shapeData(entity) {
        processedData.push({
          column1: entity.columnOneValue,
          column2: entity.columnTwoValue
        });
      });

      // Once you've retreived your data and shaped it into the form expected,
      // just call the registerData function.
      registerData(processedData);
    });
