# Trådfri Dashboard
A dashboard I created to control my IKEA Trådfri smart lights. The backend makes use of the [node-tradfri-client](https://github.com/AlCalzone/node-tradfri-client) library with Express.

The front-end is made using Svelte and TailwindCSS.

![](../assets/dashboard.png)
## Usage
**Important:** Make sure the device you run this on is connected to the same network as your Trådfri gateway.
1. Clone the repository
2. run `npm install`
3. run `cd client && npm install`
4. Create a `.env` file
5. Place the security code on the back of your Trådfri gateway as `SECURITY_CODE` in the `.env` file.
6. Generate an `identity`/`psk` pair by following [these instructions](https://github.com/AlCalzone/node-tradfri-client#authentication). Make sure to store these as `IDENTITY` and `PSK` in the `.env` file
7. run `npm start`.
8. Navigate to `localhost:3001` to view the dashboard



## Note
This dashboard was created to suit my needs based on the setup I have at my home. It may not work properly for your lamps/needs.
