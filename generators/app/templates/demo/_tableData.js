    var connector = this,
        docKey = connector.getConnectionData().docLink || '';

    $.getJSON(buildConnectionUrl(docKey), function(responseData) {
      var data = [],
          lastRow = '1',
          rowData,
          ii,
          entry,
          curRow,
          column;

      for (ii = 0; ii < responseData.feed.entry.length; ++ii) {
        entry = responseData.feed.entry[ii];
        curRow = entry.gs$cell.row;
        // skip the first row of data.
        if (curRow === '1') {
          continue;
        }
        if (curRow !== lastRow) {
          lastRow = curRow;
          if (rowData) {
            data.push(rowData);
          }
          // create an array of empty values.
          rowData = new Array(connector._numCols).join('.').split('.');
        }
        column = parseInt(entry.gs$cell.col) - 1;
        rowData[column] = entry.content.$t;
      }
      data.push(rowData);
      lastRecord = lastRecord || ''; // @todo ...
      registerData(data);
    }).fail(this.ajaxErrorHandler);
