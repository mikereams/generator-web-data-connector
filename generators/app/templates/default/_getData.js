  wdcwConfig.tables.tableId = {};
  wdcwConfig.tables.tableId.getData = function (lastRecord) {
    <% if (props.hasInput) { %>// Access your input option like this to tweak data gathering logic.
    if (this.getConnectionData('<%= props.inputName %>')) {

    }
    <% } %>
    <% if (props.hasSelectOption) { %>// Access select list options like this to tweak data gathering logic.
    if (this.getConnectionData('<%= props.selectOptionName %>') === '<%= props.selectOptionValues[0] %>') {

    }
    <% } %>
    <% if (props.hasTextarea) { %>// Access your textarea option like this to tweak data gathering logic.
    if (this.getConnectionData('<%= props.textareaName %>')) {

    }
    <% } %>

    // Logic to retrieve your data goes here. For example:
    return $.when($.getJSON(buildApiFrom('your/endpoint', {last: lastRecord})));
  };

  wdcwConfig.tables.tableId.postProcess = function (response) {
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
    // resolve it.
    return Promise.resolve(processedData);
  };
