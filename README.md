# WBGL Bridge

This is the prototype (proof-of-concept) version of the Bitgesell-WBGL bridge application that allows users to exchange between BGL coins and WBGL ERC-20 tokens.

Consists of frontend GUI that runs in the browser (React) and communicates with the backend service, which in turn is connected to the Bitgesell network (using RPC of a running node) and an Ethereum gateway (via a websocket endpoint).

## Setup

### Backend Service

Backend service is a Node.js application that exposes a port for HTTP requests. In production, it is recommended to hide it behind an SSL-enabled proxy server (such as nginx). CORS needs to be configured to enable XHR requests from the domain the frontend application is being served from.

MongoDB database is used for storing data used by the service.

To set up the service, go to the `service` directory, and run either of the following commands (depending on whether you use npm or yarn as the package manager):
```shell
yarn
```
or
```shell
npm install
```

Backend service is configured using environment variables that need to be set before running the application with Node.js. The following variables are supported:

- `NODE_ENV`: Application environment. Should be set to `production` on production.
- `PORT`: Port to listen for HTTP requests on. Defaults to `8080`.
- `RPC_HOST`: Hostname or IP address of the Bitgesell node running a JSON-RPC interface. This prototype only supports single-wallet nodes. The custodial wallet should have enough BGL reserve for incoming WBGL exchanges. Defaults to `localhost`.
- `RPC_PORT`: Port the JSON-RPC API is running on. Defaults to `3445`.
- `RPC_USER`: The RPC server user name.
- `RPC_PASSWORD`: The RPC server user password.
- `ETH_ENDPOINT`: The Ethereum API endpoint (currently, only Websocket is supported). For example, an Infura WSS endpoint URL like `wss://mainnet.infura.io/ws/v3/1d17658c92194f73a0143d18fa548a66`.
- `ETH_ACCOUNT`: The Ethereum address of the custodial account WBGL tokens are sent to and from. Should have enough WBGL in reserve for incoming BGL exchanges, as well as enough ether for gas.
- `ETH_PRIVKEY`: The private key for the custodial account as a hexadecimal string.
- `ETH_CONTRACT_ADDRESS`: The ethereum address of the WBGL ERC-20 token contract.
- `DB_CONNECTION`: MongoDB connection string in the following format: `mongodb://username:password@hostname:27017`.
- `DB_DATABASE`: Name of the MongoDB database. Defaults to `wbgl_bridge`.

The command for running the service is:
```shell
node dist/server.js
```

### Frontend Application

Frontend application is a minimal GUI developed in React. To prepare the application build process, go to the `app` folder, and install the dependencies using one of the following commands:
```shell
yarn
```
or
```shell
npm install
```

Before building the application, you'll need to set the `REACT_APP_SERVICE_URL` environment variable, which should contain the URL the background service is running at. It should look something like this: `https://service.domain`.

To build the application, run one of the following commands:
```shell
yarn build
```
or
```shell
npm run build
```

This will create the static application bundle in the `build` subdirectory, which can be directly served using any web server.

## Caveats

As mentioned above, this is a proof-of-concept implementation of the Bitgesell-WBGL bridge application. As such, it comes with multiple shortcomings that should be overcome before launching a full scale service. Some of these shortcomings are:

- Very minimal GUI. Should add a lot of features (trade details, status updates, dedicated trade url, etc).
- No DDoS protection. Should implement at least CAPTCHA.
- Limited error checking. All possible exception paths should be covered.
- No set limits for transfer amounts. If custodial wallet has insufficient funds to fulfil a trade, transfers will simply fail.
- No fee calculations. Transaction fees should be covered by the user instead of the service.
- No wallet integration. Should support at least address autofill and message signing.
- Not a typed language. Should be rewritten in e.g. Typescript.
- No unit tests.
