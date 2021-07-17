# Trådfri Dashboard
A dashboard I created to control my IKEA Trådfri smart lights. The backend makes use of the [node-tradfri-client](https://github.com/AlCalzone/node-tradfri-client) library with Express.

The front-end is made using Svelte and TailwindCSS.

![](../assets/dashboard.png)
## Usage
**Important:** Make sure the device you run this on is connected to the same network as your Trådfri gateway.
1. Clone the repository
2. Run `npm install`
3. Create a `.env` file
4. Place the security code on the back of your Trådfri gateway as `SECURITY_CODE` in the `.env` file.
5. Generate an `identity`/`psk` pair by following [these instructions](https://github.com/AlCalzone/node-tradfri-client#authentication). Make sure to store these as `IDENTITY` and `PSK` in the `.env` file
6. Run `npm start`.
7. Navigate to `localhost:3001` to view the dashboard


## Features
- Real-time updates to device status
- Light / dark theme

## Tech Stack
**Client:** Svelte, TailwindCSS

**Server:** Node, Express

## Note
This dashboard was created to suit my needs based on the setup I have at my home. It may not work properly for your lamps/needs.
