  wdcwConfig.tables.googleSheet = {};
  wdcwConfig.tables.googleSheet.getData = function getGoogleSheetData() {
    var docKey = this.getConnectionData('docLink') || '';
    return $.when($.getJSON(buildConnectionUrl(docKey)));
  };

  wdcwConfig.tables.googleSheet.postProcess = function processData(response) {
    var connector = this,
        data = [],
        lastRow = '1',
        rowData,
        ii,
        entry,
        curRow,
        column;

    for (ii = 0; ii < response.feed.entry.length; ++ii) {
      entry = response.feed.entry[ii];
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

    return Promise.resolve(data);
  };
