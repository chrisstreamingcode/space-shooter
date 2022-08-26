# Basic Node.js-powered Website Template

A basic Node.js-powered website template.

## Table of Contents

 - [Features](#features)
 - [Prerequisites](#prerequisites)
 - [Running](#running)
 - [Usage](#usage)
 - [Using with React](#using-with-react)
 - [Examples Using This Template](#examples-using-this-template)
 - [Configuration](#configuration)

## Features

 - Easy to customize 
 - Uses Express to server the files
 - Uses Babel (with env preset) for building the files
 - Serves JavaScript files with `type="module"` so no bundling required between changes
 - Pipeline has `watch` commands for seamless development without having to rerun anything in between.
 - Can work with React for single-page applications with two very minor tweaks.
 
Note: This project does **not** bundle the JavaScript files. Instead, it uses 
[`<script type="module">`](https://github.com/samanime/chris-streaming-code-website) which lets it serve the
individual JavaScript files as needed. It does require a more modern browser though, so this might not be
optimal for proper production releases depending on your target audience.

Also note that with this approach you currently can't `import` from `node_modules` very well directly. Instead,
you should use CDN hosted versions of their UMD build. This can have some performance improvements by doing this, but
there are trade-offs that might not make this optimal. A future version of this template will implement support for
using those.

## Prerequisites

### Node

You must have a modern version of Node.js installed.

## Running

Make sure you have the prerequisites above met.
    
### Quick Start

    npm install
    npm run build
    npm start
    
### Running for Development

If you want to run all necessary commands in one terminal, with watch, you can run:

    npm run dev
    
If you'd like to run the commands separately, run each of the following in different terminals:

    npm run server:run:watch
    npm run server:build:watch
    npm run client:build:watch
    npm run public:build:watch
    
Note: The first time you run `npm run dev`, you may see an error on startup 
(about missing `Cannot find module dist/server`), but this can be safetly ignored as once it builds the server
will start up anyways. You'll only see this if you've never run any of the `server:build` commands before.

### NPM Scripts

  - `start` - Runs the server. Must be built already.
  - `build` - Builds the project.
  - `dev` - Runs the server and builds the project in watch mode.
  - `clean` - Cleans the dist directory.
  - `client:build` - Builds the client
  - `client:build:watch` - Builds the client in watch mode.
  - `server:run` - Runs the server. Must be built already.
  - `server:run:watch` - Runs the server. Restarts if there are any changes.
  - `server:build` - Builds the server.
  - `server:build:watch` - Builds the server in watch mode.
  - `public:build` - Copies the public directory for the build.
  - `public:build:watch` - Copies the public directory for the build and watches for more changes.
    
## Usage

The basic usage is simply put the correct files in the correct places, run it using one of the three options
from the [Running](#running) section and the build pipeline will handle the rest. Then you should simply be able to
go to localhost:8000 in your browser and see your project.

### Folder Structure

  - `src/client` - JavaScript files to serve to the user's browser.
    - `src/client/index.js` - The default entry point file which is already linked in `public/index.html`.
  - `src/server` - Node.js files which are run on your server.
    - `src/server/index.js` - The entry point for the server.
  - `public` - Public files which will be available from the user's browser.
    - `public/index.html` - The main HTML file if you hit `/` on the site. 
      Pre-wired to pull in `client/index.js` and `public/index.css`.
    - `public/index.css` - The main CSS file connected to `public/index.html`.
    
### Web Paths

From your browser, with the server running, the following mappings are default:

    - `src/client` maps to `/client/`
    - `public` maps to `/public/`
    - `src/public/index.html` maps to `/`

Example: if you go to `localhost:8000/public/images/my-image.png` that will serve `public/images/my-image.png` from your
project.
    
## Using With React

This template works very well with React, you just have to make a few minor tweaks.

In `src/server/index.js`, change the `/` to `**`:

    app.get('/', (_, res) => {
      res.sendFile(join(__dirname, '../public/index.html'));
    });
    
to:

    app.get('**', (_, res) => { // <-- here, about line 18
      res.sendFile(join(__dirname, '../public/index.html'));
    });
    
Then, run `npm install --save-dev @babel/preset-react` to install the Babel React preset. 

Finally, add the preset to the client porition of `babel.config.js`:

    presets: [
      [
        '@babel/preset-env', // <-- here, about line 24
        {
          modules: false,
          targets: {
            esmodules: true
          }
        }
      ]
    ]
    
to:

    presets: [
      '@babel/preset-react'
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            esmodules: true
          }
        }
      ]
    ]
    
Restart your pipeline(s) if they are running and you are now all set to start writing React.

## Examples Using This Template

  - [Chris Streaming Code Website](https://github.com/samanime/chris-streaming-code-website)
  
    This example is using it with the React tweaks and a slightly expanded server to add Mongo support.

## Configuration

### Environment Variables

  - `PORT` - Default: 8000. The port for the server to listen on.