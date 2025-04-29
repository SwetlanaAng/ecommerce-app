# Ecommerce App

## Project Description & Purpose

The Ecommerce App serves as a comprehensive front-end reference implementation for building modern e-commerce experiences. It showcases:

- **CommerceTools Integration**: Easy connection to Merchant Center, product, cart, and order APIs.
- **React & TypeScript**: Strongly-typed, component-based architecture.
- **Developer Efficiency**: Includes Vite for fast builds, ESLint/Prettier for consistent code, Husky for automated checks, and Jest for reliable testing

## Technology Stack

- **Framework & Bundler**: React 18, Vite  

- **Language**: TypeScript  

- **Styling & Assets**: CSS Modules

- **Linting**: ESLint with `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`  

- **Formatting**: Prettier  

- **Git Hooks**: Husky + lint-staged  

- **Testing**: Jest, `@testing-library/react`, `ts-jest`  

- **Commerce Platform**: CommerceTools Merchant Center & API Client

## Available Scripts

`npm run dev` Launches Vite dev server with hot-reload

`npm run build` Compiles TypeScript, then builds production bundles

`npm run preview` Serves the production build locally

`npm run lint` Runs ESLint across all source files

`npm run format` Formats code using Prettier

`npm run test` Runs Jest test suite once

`npm run test:watch` Runs Jest in watch mode

`npm run prepare` Installs Husky Git hooks (pre-commit, pre-push checks)

## Setup Instructions

- Use `node v16.x` or higher

- Clone this repo: `$ git clone https://github.com/olya-us/ecommerce-app.git`

- Go to downloaded folder: `$ cd ecommerce-app`

- Install dependencies: `$ npm install`

- Configure environment: `$ cp .env.example .env`

- Initialize Git hooks: `$ npm run prepare`

- Start server: `$ npm run dev`

- Now you can send requests to the address: `http://localhost:5173/`
