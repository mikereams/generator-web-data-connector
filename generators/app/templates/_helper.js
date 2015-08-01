var wdcw = window.wdcw || {};

(function($, tableau, wdcw) {
  var connector = tableau.makeConnector();

  /**
   * Simplifies the connector.init method in several ways:
   * - Makes it so the implementor doesn't have to know to call the
   *   tableau.initCallback method.
   * - Passes the current phase directly to the initializer so that it doesn't
   *   have to know to pull it from the global tableau object.
   */
  connector.init = function callConnectorInit() {
    // If the provided connector wrapper has a setup property, call it with the
    // current initialization phase.
    if (wdcw.hasOwnProperty('setup')) {
      wdcw.setup.call(this, tableau.phase);
    }
    tableau.initCallback();
  };

  /**
   * Simplifies the connector.shutDown method in a couple of ways:
   * - Makes it so that the implementor doesn't have to know to call the
   *   tableau.shutdownCallback method.
   * - Mirrors the wrapped init callback for naming simplicity (setup/teardown).
   */
  connector.shutDown = function callConnectorShutdown() {
    // If the provided connector wrapper has a teardown property, call it.
    if (wdcw.hasOwnProperty('teardown')) {
      wdcw.teardown.call(this);
    }
    tableau.shutdownCallback();
  };

  /**
   * Simplifies the connector.getColumnHeaders method in a few ways:
   * - Enables simpler asynchronous handling by making the interface only accept
   *   a callback.
   * - Simplifies the API by expecting an array of objects, mapping field names
   *   and types on a single object, rather than in two separate arrays.
   * - Makes it so the implementor doesn't have to know to call the
   *   tableau.headersCallback method.
   */
  connector.getColumnHeaders = function callConnectorColumnHeaders() {
    wdcw.columnHeaders.call(this, function getColumnHeadersSuccess(headers) {
      var names = [],
          types = [];

      // Iterate through returned column header objects and process them into the
      // format expected by the API.
      headers.forEach(function(header) {
        names.push(header.name);
        types.push(header.type);
      });

      tableau.headersCallback(names, types);
    });
  };

  /**
   * Simplifies (and limits) the connector.getTableData method in a couple ways:
   * - Enables simpler asynchronous handling by making the interface only accept
   *   a callback.
   * - Removes the complexity introduced by allowing tableau to be aware of
   *   data paging. It's simpler to let the implementor control that logic.
   * - Makes it so the implementor doesn't have to know to call the
   *   tableau.dataCallback method.
   */
  connector.getTableData = function callConnectorTableData() {
    wdcw.tableData.call(this, function getTableDataSuccess(data) {
      tableau.dataCallback(data, null, false);
    });
  };

  // Register our connector, which uses logic from the connector wrapper.
  tableau.registerConnector(connector);

  /**
   * Register a submit handler and take care of the following on behalf of the
   * implementor:
   * - Parse and store form data in tableau's connection data property.
   * - Provide the connection name.
   * - Trigger the data collection phase of the web data connector.
   */
  $(document).ready(function connectorDocumentReady(){
    $("form").submit(function connectorFormSubmitHandler(e) {
      // @todo Remove specifics of the Google Spreadsheets example, make generic.
      var $textField = $('input[type=text]'),
          inputUrl = $textField.val(),
          paramName = 'key',
          regex = new RegExp("[\\?&]" + paramName + "=([^&#]*)"),
          results = regex.exec(inputUrl),
          connectionData = results == null ? inputUrl : decodeURIComponent(results[1].replace(/\+/g, " "));

      e.preventDefault();

      if (!$textField || $textField.length == 0) {
        return false;
      }

      // @todo Create a getter/setter method to automatically JSON.parse and
      // stringify, making the assumption that all data will be stored as such.
      tableau.connectionData = connectionData;
      tableau.connectionName = '<%= props.name %>';
      tableau.submit();
    });
  });

})(jQuery, tableau, wdcw);
