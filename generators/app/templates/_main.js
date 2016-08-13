(function(root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.wdcwConfig = factory(root.jQuery);
  }
} (this, function ($) {
  var wdcwConfig = {tables: {}};

  wdcwConfig.name = '<%= props.name %>';<% if(props.authentication !== 'none') { %>
  wdcwConfig.authType = '<%= props.authentication === "basic" ? "basic" : "custom" %>';<% } %>

  <%= templateIncs._privateMethodVars ? include(templateIncs._privateMethodVars).trim() : '' %>

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
   *
   * @return Promise
   *   This method should return a Promise. When all set up tasks for the given
   *   phase are complete, the promise should be resolved. If your setup tasks
   *   are completely synchronous, you can simply return Promise.resolve();
   *
   * @note If you don't need to run anything during the setup phase, you can
   * completely remove this block of code.
   *
   * @see https://tableau-mkt.github.io/wdcw/wdcw.html#registerSetup
   */
  wdcwConfig.setup = function setup(phase) {
    <%= templateIncs._setUp ? include(templateIncs._setUp).trim() : '' %>
  };

  /**
   * Run when the web data connector is being unloaded. Useful if you need
   * custom logic to clean up resources or perform other shutdown tasks.
   *
   * @return Promise
   *   This method should return a Promise. When all teardown tasks are complete,
   *   the promise should be resolved. If your teardown tasks are completely
   *   synchronous, you can simply return Promise.resolve().
   *
   * @note If you don't need to run anything during the teardown phase, you can
   * completely remove this block of code.
   *
   * @see https://tableau-mkt.github.io/wdcw/wdcw.html#registerTeardown
   */
  wdcwConfig.teardown = function teardown() {
    <%= templateIncs._tearDown ? include(templateIncs._tearDown).trim() : '' %>
  };

  /**
   * Primary method called when Tableau is asking for the schema that this web
   * data connector provides.
   *
   * @return Promise.<Array.TableInfo>
   *   Should return a promise to an array of native Tableau TableInfo objects.
   *   If your WDC only has one table, then it should be an array of length 1.
   *   If your WDC supports multiple tables, then you may return as many Table
   *   Info objects as you need. Get complete details on what a TableInfo object
   *   looks like in the Tableau WDC API docs.
   *
   * @see https://tableau.github.io/webdataconnector/ref/api_ref.html#webdataconnectorapi.tableinfo-1
   * @see https://tableau-mkt.github.io/wdcw/wdcw.html#registerSchema
   */
  wdcwConfig.schema = function schema() {
    <%= templateIncs._getSchema ? include(templateIncs._getSchema).trim() : '' %>
  };

  /**
   * For each table you specify in your wdcwConfig.schema method above, you must
   * add a property in the wdcwConfig.tables object. The name of each property
   * must correspond to the tableId you specified in your schema. If you have
   * multiple tables, you will have multiple properties, for example:
   *
   * wdcwConfigs.tables.users = {};
   * wdcwConfigs.tables.comments = {};
   *
   * Each sub-property of the wdcwConfigs.tables object must define a getData
   * method and may optionally define a postProcess method. The getData method
   * is called for each table when Tableau is retrieving data for a table. You
   * may choose to split apart "data collection" logic and "data transformation"
   * logic by keeping your getData method focused on extraction and placing all
   * transformation logic in your postProcess method. Totally up to you. That
   * might look like:
   *
   * wdcwConfigs.tables.users.getData = function () {};
   * wdcwConfigs.tables.users.postProcess = function (data) {};
   * wdcwConfigs.tables.comments.getData = function () {};
   *
   * More details below.
   *
   * @see https://tableau-mkt.github.io/wdcw/wdcw.html#registerData
   * @see https://tableau-mkt.github.io/wdcw/wdcw.html#registerPostProcess
   */
  <%= templateIncs._getData ? include(templateIncs._getData).trim() : '' %>

  <%= templateIncs._privateMethods ? include(templateIncs._privateMethods).trim() : '' %>

  return wdcwConfig;
}));
