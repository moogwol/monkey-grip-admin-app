# Monkey Grip BJJ Club Frontend

A modern React application for managing BJJ club members and class coupons, built with React Router v7 and TypeScript.

## Features

- Member management with belt rank tracking
- Real-time search and filtering
- Belt promotion interface
- Payment status management
- Class coupon tracking
- Club statistics dashboard
- Responsive design
- Built with React Router v7 and Vite

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in React Router app server is production-ready.

Make sure to deploy the output of `react-router build`

- `build/server`
- `build/client`
