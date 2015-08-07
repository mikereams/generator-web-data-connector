    // Do the same to retrieve your actual data.
    $.ajax({
      url: "https://api.example.com/path/to/your/data",
      headers: {
        Authorization: 'token ' + tableau.password
      },
      success: function dataRetrieved(response) {
        var processedData = [];

        // You may need to perform processing to shape the data into an array of
        // objects where each object is a map of column names to values.
        response.entities.forEach(function shapeData(entity) {
          processedData.push({
            column1: entity.columnOneValue,
            column2: entity.columnTwoValue
          });
        });

        // Once you've retrieved your data and shaped it into the form expected,
        // just call the registerData function.
        registerData(processedData);
      }
    });
