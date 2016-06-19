    // Potentially, your connector has a fixed set of tables with pre-specified
    // schemas that you could return like this:
    return Promise.all([
      $.when($.getJSON('./schema/tableId.json'))
    ]);
