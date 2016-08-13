  wdcwConfig.tables.tableId = {};

  /**
   * Should always return a promise which resolves when data retrieval for the
   * given table is complete. The data passed back when resolved can vary
   * depending on your use-case, see below.
   *
   * @param {string} lastRecord
   *   If this table supports incremental refreshes, the first argument will be
   *   the last value/record of this table's incrementColumnId column. If your
   *   table does not support incremental refreshes or if the execution context
   *   is not an incremental refresh, this parameter will be null.
   *
   * @param {Array.<Array.<any>>|null} tableDependencyData
   *   If you specified an array of tables that this table depends on (via the
   *   dependsOn key in this table's schema definition), then this argument will
   *   be populated with table data for each dependency. The top layer of arrays
   *   will respect the order in which you specified the dependencies in your
   *   schema, underneath which the actual table data resides. If your table
   *   does not depend on the table data of other tables, this parameter will be
   *   null.
   *
   * @param {function} appendRows
   *   In some cases (for example, if you are dealing with a very large number
   *   of records), for performance or resource usage reasons, you may wish to
   *   bypass the WDC Wrapper's data handling and write data directly to Tableau.
   *   If this fits your use-case, you may use this function to do so; it is
   *   identical to the Table.appendRows method in the native Tableau WDC API's
   *   getData method. Note that if you use this, you'll want to resolve this
   *   method with no data, otherwise your data may be duplicated.
   *
   * @return Promise.<Array.<Array.<any>>> | null
   *   In most cases, this promise should resolve with data in the format
   *   exactly as expected by Tableau in the Table.appendRows method of the
   *   native Tableau WDC API. Before being written to Tableau, data resolved
   *   here will be passed directly to the post processing method you have
   *   registered with this table. If you made use of the appendRows parameter
   *   to write data to Tableau directly, you should return NULL here so that
   *   the WDC Wrapper does not do any additional data writing to Tableau.
   *
   * @see https://tableau.github.io/webdataconnector/ref/api_ref.html#webdataconnectorapi.table.appendrows
   * @see https://tableau-mkt.github.io/wdcw/wdcw.html#~dataRetrieval
   */
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

    // Do the same to retrieve your actual data.
    return $.when($.ajax({
      url: buildApiFrom('path/to/your/data', {last: lastRecord}),
      headers: {
        Authorization: 'Basic ' + btoa(this.getUsername() + ':' + this.getPassword())
      }
    }));
  };

  /**
   * Function called once all data for a given table has been retrieved. Can be
   * used to transform, filter, or append data for the given table. Should
   * return a promise that resolves to data in the format exactly as expected by
   * Tableau in the Table.appendRows method of the native Tableau WDC API.
   *
   * @param {Array.<Array.<any>>|null} tableData
   *   Contains data as resolved by your table's corresponding dataRetrieval
   *   method. In some exotic use-cases, you may wish for your dataRetrieval to
   *   resolve to "raw" data in a format not expected by Tableau, but then to
   *   process and re-shape the data here into the format expected by Tableau.
   *   This would allow any tables you've declared that depend on this table to
   *   base their data retrieval on the raw data while Tableau gets the properly
   *   formatted version.
   *
   * @return Promise.<Array.<Array.<any>>>
   *   This promise should resolve with data in the format exactly as expected
   *   by Tableau in the Table.appendRows method of the native Tableau WDC API.
   *
   * @see https://tableau-mkt.github.io/wdcw/wdcw.html#~postProcess
   */
  wdcwConfig.tables.tableId.postProcess = function (tableData) {
    var processedData = [];

    // You may need to perform processing to shape the data into an array of
    // objects where each object is a map of column names to values.
    tableData.entities.forEach(function shapeData(entity) {
      processedData.push({
        column1: entity.columnOneValue,
        column2: entity.columnTwoValue
      });
    });

    // Once you've retrieved your data and shaped it into the form expected,
    // resolve it.
    return Promise.resolve(processedData);
  };
