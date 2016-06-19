    var connector = this,
        docKey = connector.getConnectionData('docLink') || '';

    return new Promise(function (resolve, reject) {
      $.getJSON(buildConnectionUrl(docKey), function(responseData) {
        var fields = [],
            tableInfo = {id: 'googleSheet'},
            numTypesFound = 0,
            ii = 0,
            column,
            entry,
            fieldType,
            fieldVal;

        for (0; ii < responseData.feed.entry.length; ++ii) {
          entry = responseData.feed.entry[ii];

          if (entry.gs$cell.row === '1') {
            // Set field names.
            fields.push({id: entry.content.$t});
          }
          else {
            // use the first value for a column to guess the type
            column = parseInt(entry.gs$cell.col) - 1;
            // check if we already figured out the type for this column
            if (fields[column].dataType) {
              continue;
            }
            // try to determine the column type based on this value.
            fieldType = 'string';
            fieldVal = entry.content.$t;
            if (parseInt(fieldVal).toString() === fieldVal) {
              fieldType = 'int';
            }
            else if (parseFloat(fieldVal).toString() === fieldVal) {
              fieldType = 'float';
            }
            else if (isFinite(new Date(fieldVal).getTime())) {
              fieldType = 'date';
            }
            fields[column].dataType = fieldType;
            ++numTypesFound;
            if (numTypesFound === fields.length) {
              // we've found all the column types, so break out of this loop.
              break;
            }
          }
        }

        // Register our schema.
        tableInfo.columns = fields;
        connector._numCols = fields.length;
        resolve([tableInfo]);
      }).fail(function () {
        reject('Unable to retrieve document schema.');
      });
    });
