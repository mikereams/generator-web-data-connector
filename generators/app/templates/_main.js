
(function() {
  //
  // Helper functions
  //

  // build the spreadsheet url for the given doc key
  function buildConnectionUrl(docKey) {
    docKey = docKey.trim();
    if (stringStartsWith(docKey, "http")) {
      var urlParts = docKey.split("/");
      docKey = urlParts[5];
    }
    return 'http://spreadsheets.google.com/feeds/cells/' + docKey + '/default/public/values?alt=json';
  }

  // string.startsWith is not available in all browsers, so use this implementation
  function stringStartsWith(str, searchString, position) {
    position = position || 0;
    return str.indexOf(searchString, position) === position;
  };

  var myConnector = tableau.makeConnector();

  myConnector.init = function () {
    // If we are in the interactive phase, repopulate the input text box if there is connectionData present.
    // This is hit when editing a connection in Tableau.
    if (tableau.phase == tableau.phaseEnum.interactivePhase) {
      $('input[type=text]').val(tableau.connectionData);
    }
    tableau.initCallback();
  };

  myConnector.getColumnHeaders = function() {
    _retrieveJsonData(function (tableData) {
      var fieldNames = [];
      var fieldTypes = [];
      var numTypesFound = 0;
      for (var ii = 0; ii < tableData.feed.entry.length; ++ii) {
        var entry = tableData.feed.entry[ii];
        if (entry.gs$cell.row == "1") {
          // set field names
          fieldNames.push(entry.content.$t);
        } else {
          // use the first value for a column to guess the type
          var column = parseInt(entry.gs$cell.col) - 1;
          // check if we already figured out the type for this column
          if (fieldTypes[column]) continue;
          // try to determine the column type based on this value.
          var fieldType = 'string';
          var fieldVal = entry.content.$t;
          if (parseInt(fieldVal).toString() == fieldVal) fieldType = 'int';
          else if (parseFloat(fieldVal).toString() == fieldVal) fieldType = 'float';
          else if (isFinite(new Date(fieldVal).getTime())) fieldType = 'date';
          fieldTypes[column] = fieldType;
          ++numTypesFound;
          if (numTypesFound == fieldNames.length) {
            // we've found all the column types, so break out of this loop.
            break;
          }
        }
      }
      // store the number of columns. We'll use this when pulling in the table data
      myConnector._numCols = fieldNames.length;
      tableau.headersCallback(fieldNames, fieldTypes);
    });
  };

  myConnector.getTableData = function (lastRecordToken) {
    _retrieveJsonData(function (tableData) {
      var toRet = [];
      var lastRow = "1";
      var rowData;
      for (var ii = 0; ii < tableData.feed.entry.length; ++ii) {
        var entry = tableData.feed.entry[ii];
        var curRow = entry.gs$cell.row;
        // skip the first row of data.
        if (curRow == "1") continue;
        if (curRow != lastRow)
        {
          lastRow = curRow;
          if (rowData)
          {
            toRet.push(rowData);
          }
          // create an array of empty values.
          rowData = Array(myConnector._numCols).join(".").split(".");;
        }
        var column = parseInt(entry.gs$cell.col) - 1;
        rowData[column] = entry.content.$t;
      }
      toRet.push(rowData);
      tableau.dataCallback(toRet, null, false);
    });
  }

  tableau.registerConnector(myConnector);

  // Fetch the spreadsheet data, cache it, and call the given callback function.
  // If the data is already cached, then just call the callback and return
  function _retrieveJsonData(retrieveDataCallback) {
    if (tableau.dataCache) {
      retrieveDataCallback(tableau.dataCache);
      return;
    }
    var docKey = tableau.connectionData;
    var connectionUrl = buildConnectionUrl(docKey);
    $.ajax({
      url: connectionUrl,
      dataType: 'json',
      success: function(res, status, xhr)
      {
        tableau.dataCache = res;
        retrieveDataCallback(tableau.dataCache);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        var msg = "error connecting to Google Spreadsheets: " + xhr.responseText + "\n" + thrownError;
        tableau.abortWithError(msg);
      }
    });
  }
})();

$(document).ready(function(){
  $("#inputForm").submit(function(evt) { // This event fires when a button is clicked
    evt.preventDefault();
    var textField = $('input[type=text]');
    if (!textField || textField.length == 0)
    {
      return;
    }
    var inputUrl = textField[0].value,
      paramName = 'key';

    var regex = new RegExp("[\\?&]" + paramName + "=([^&#]*)"),
      results = regex.exec(inputUrl),
      docKey = results == null ? inputUrl : decodeURIComponent(results[1].replace(/\+/g, " "));

    tableau.connectionData = docKey;
    tableau.connectionName = 'Google spreadsheet';
    tableau.submit();
  });
});
