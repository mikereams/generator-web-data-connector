(function($, tableau) {
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
      var fieldNames = [],
          fieldTypes = [],
          numTypesFound = 0,
          ii = 0,
          column,
          entry,
          fieldType,
          fieldVal;

      for (0; ii < tableData.feed.entry.length; ++ii) {
        entry = tableData.feed.entry[ii];

        if (entry.gs$cell.row == "1") {
          // set field names
          fieldNames.push(entry.content.$t);
        }
        else {
          // use the first value for a column to guess the type
          column = parseInt(entry.gs$cell.col) - 1;
          // check if we already figured out the type for this column
          if (fieldTypes[column]) continue;
          // try to determine the column type based on this value.
          fieldType = 'string';
          fieldVal = entry.content.$t;
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
      var toRet = [],
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
        column = parseInt(entry.gs$cell.col) - 1;
        rowData[column] = entry.content.$t;
      }
      toRet.push(rowData);
      tableau.dataCallback(toRet, null, false);
    });
  };

  tableau.registerConnector(myConnector);


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

  $(document).ready(function(){
    $("#inputForm").submit(function(e) { // This event fires when a button is clicked
      var textField = $('input[type=text]'),
          inputUrl = textField[0].value,
          paramName = 'key',
          regex = new RegExp("[\\?&]" + paramName + "=([^&#]*)"),
          results = regex.exec(inputUrl),
          docKey = results == null ? inputUrl : decodeURIComponent(results[1].replace(/\+/g, " "));

      e.preventDefault();

      if (!textField || textField.length == 0) {
        return;
      }

      tableau.connectionData = docKey;
      tableau.connectionName = '<%= props.name %>';
      tableau.submit();
    });
  });

})(jQuery, tableau);
