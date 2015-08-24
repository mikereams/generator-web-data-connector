    switch (phase) {
      case tableau.phaseEnum.interactivePhase:
        // Perform set up tasks that relate to when the user will be prompted to
        // enter information interactively.

        // Once done, be sure to signal that initialization is done.
        setUpComplete();
        break;

      // Here, we just need to make sure we have a good OAuth access token.
      case tableau.phaseEnum.authPhase:
        // If we have a token, ensure it's still valid. Request a new token if
        // it is no longer or will soon be invalid.
        if (tableau.password) {
          $.ajax({
            url: 'http://api.example.com/some/predictable/endpoint',
            headers: {
              Accept: 'application/json',
              // This may be one of several ways to attempt to validate a token.
              Authorization: 'token ' + this.getPassword()
            },
            success: function(response) {
              // For some authentication flows, the request may succeed, but you
              // need to check its contents to determine token validity. That
              // logic should go here. If your condition fails, be sure to
              // attempt to retrieve a new access token.
              if (response.someConstraintPasses) {
                setUpComplete();
              }
              else {
                getNewAccessToken();
              }

              // Consult your API documentation for authentication flow details
              // specific to the API.
            },
            // If there was an error making the request, we likely need to get a
            // new access token.
            error: getNewAccessToken
          });
        }
        // If we don't yet have a token, direct the user to get a token.
        else {
          getNewAccessToken();
        }
        break;

      default:
        setUpComplete();
    }
