# <%= props.name %> WDC

A Tableau Web Data Connector for <%= props.name %>.

## Usage

<% switch (props.authentication) {
  case 'none':

%>No authentication required! Just connect and go.<%
    break;

  case 'basic':
%>Authenticate using your <%= props.name %> username and password.<%
    break;

  case 'oauth':
%>In order to retrieve data from <%= props.name %>, this WDC will ask for authorization
to access your data via OAuth.<%
    break;

  default:
%>Include details about how to authenticate with <%= props.name %> here.<%
} %>

- Add additional details about your WDC here.
- What data is available?
- What's that quirky UX thing other people should know about?
- Have you already deployed this to a publicly accessible server? Link it here!

## Running and developing locally

In order to run this Web Data Connector locally, you will need to install the
following: node.js, grunt, and bower.

Once pre-requisites are installed, you will need to run the following:

```sh
bower install
npm install
grunt build
```

Once dependencies are installed, you can run this connector locally in any of
the following ways:

- `grunt`: will build your WDC (minify/concat source assets) and run a `watch`
  task that re-runs the build process when you make changes to your WDC source
  code. You can access your WDC at http://localhost:9001
- `npm start`: will start serving your WDC at http://localhost:9001 in a manner
  similar to how it might run when deployed to a production system.
- `npm run simulate`: runs `npm start` under the hood, but also starts a copy of
  the Tableau WDC simulator at http://localhost:8888/Simulator/
- `npm run simulate:dev`: same as above, but runs `grunt` instead of `npm start`,
  allowing you to make changes to your WDC source code and view the changes
  immediately in the WDC simulator.

In addition to the simulator, you could also choose to run any of the above and
load your WDC directly in Tableau at the same address: http://localhost:9001
