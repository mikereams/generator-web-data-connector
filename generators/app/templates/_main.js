var wdcw = window.wdcw || {};

(function($, tableau, wdcw) {

  /**
   * Run during initialization of the web data connector.
   *
   * @param {string} phase
   *   The initialization phase. This can be one of:
   *   - tableau.phaseEnum.interactivePhase: Indicates when the connector is
   *     being initialized with a user interface suitable for an end-user to
   *     enter connection configuration details.
   *   - tableau.phaseEnum.gatherDataPhase: Indicates when the connector is
   *     being initialized in the background for the sole purpose of collecting
   *     data.
   *   - tableau.phaseEnum.authPhase: Indicates when the connector is being
   *     accessed in a stripped down context for the sole purpose of refreshing
   *     an OAuth authentication token.
   */
  wdcw.setup = function setup(phase) {
    switch (phase) {
      case tableau.phaseEnum.interactivePhase:
        $('input[type=text]').val(tableau.connectionData);
        break;
    }
  };

  /**
   * Primary method called when Tableau is asking for the column headers that
   * this web data connector provides. Takes a single callable argument that you
   * should call with the headers you've retrieved.
   *
   * @param {function(Array<{name, type}>)} registerHeaders
   *   A callback function that takes an array of objects as its sole argument.
   *   For example, you might call the callback in the following way:
   *   registerHeaders([
   *     {name: 'Boolean Column', type: 'bool'},
   *     {name: 'Date Column', type: 'date'},
   *     {name: 'DateTime Column', type: 'datetime'},
   *     {name: 'Float Column', type: 'float'},
   *     {name: 'Integer Column', type: 'int'},
   *     {name: 'String Column', type: 'string'}
   *   ]);
   */
  wdcw.columnHeaders = function columnHeaders(registerHeaders) {
    var connector = this;
    _retrieveJsonData(function (tableData) {
      var fields = [],
          numTypesFound = 0,
          ii = 0,
          column,
          entry,
          fieldType,
          fieldVal;

      for (0; ii < tableData.feed.entry.length; ++ii) {
        entry = tableData.feed.entry[ii];

        if (entry.gs$cell.row == "1") {
          // Set field names.
          fields.push({name: entry.content.$t});
        }
        else {
          // use the first value for a column to guess the type
          column = parseInt(entry.gs$cell.col) - 1;
          // check if we already figured out the type for this column
          if (fields[column].type) continue;
          // try to determine the column type based on this value.
          fieldType = 'string';
          fieldVal = entry.content.$t;
          if (parseInt(fieldVal).toString() == fieldVal) fieldType = 'int';
          else if (parseFloat(fieldVal).toString() == fieldVal) fieldType = 'float';
          else if (isFinite(new Date(fieldVal).getTime())) fieldType = 'date';
          fields[column].type = fieldType;
          ++numTypesFound;
          if (numTypesFound == fields.length) {
            // we've found all the column types, so break out of this loop.
            break;
          }
        }
      }

      // Register our headers.
      connector._numCols = fields.length;
      registerHeaders(fields);
    });
  };

  /**
   * Primary method called when Tableau is asking for your web data connector's
   * data. Takes a single callable argument that you should call with all of the
   * data you've retrieved.
   *
   * @param {function(Array<{object}>)} registerData
   *   A callback function that takes an array of objects as its sole argument.
   *   Each object should be a simple key/value map of column name to column
   *   value. For example, you might call the callback in the following way:
   *   registerData([
   *     {'String Column': 'String Column Value', 'Integer Column': 123}
   *   ]});
   */
  wdcw.tableData = function tableData(registerData) {
    var connector = this;
    _retrieveJsonData(function (tableData) {
      var data = [],
          lastRow = "1",
          rowData,
          ii,
          entry,
          curRow,
          column;

      for (ii = 0; ii < tableData.feed.entry.length; ++ii) {
        entry = tableData.feed.entry[ii];
        curRow = entry.gs$cell.row;
        // skip the first row of data.
        if (curRow == "1") continue;
        if (curRow != lastRow) {
          lastRow = curRow;
          if (rowData) {
            data.push(rowData);
          }
          // create an array of empty values.
          rowData = Array(connector._numCols).join(".").split(".");
        }
        column = parseInt(entry.gs$cell.col) - 1;
        rowData[column] = entry.content.$t;
      }
      data.push(rowData);
      registerData(data);
    });
  };

  /**
   * Run when the web data connector is being unloaded. Useful if you need
   * custom logic to clean up resources or perform other shutdown asks.s
   */
  wdcw.teardown = function teardown() {

  };

  //
  // Helper functions
  //

  // build the spreadsheet url for the given doc key
  function buildConnectionUrl(docKey) {
    var urlParts;

    docKey = docKey.trim();
    if (stringStartsWith(docKey, "http")) {
      urlParts = docKey.split("/");
      docKey = urlParts[5];
    }
    return 'http://spreadsheets.google.com/feeds/cells/' + docKey + '/default/public/values?alt=json';
  }

  // string.startsWith is not available in all browsers, so use this implementation
  function stringStartsWith(str, searchString, position) {
    position = position || 0;
    return str.indexOf(searchString, position) === position;
  }

  // Fetch the spreadsheet data, cache it, and call the given callback function.
  // If the data is already cached, then just call the callback and return
  function _retrieveJsonData(retrieveDataCallback) {
    if (tableau.dataCache) {
      retrieveDataCallback(tableau.dataCache);
      return;
    }

    var docKey = tableau.connectionData,
        connectionUrl = buildConnectionUrl(docKey),
        msg;

    $.ajax({
      url: connectionUrl,
      dataType: 'json',
      success: function(res, status, xhr) {
        tableau.dataCache = res;
        retrieveDataCallback(tableau.dataCache);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        msg = "error connecting to Google Spreadsheets: " + xhr.responseText + "\n" + thrownError;
        tableau.abortWithError(msg);
      }
    });
  }

})(jQuery, tableau, wdcw);
