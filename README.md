Typescript-React-Express-Starter
================================

A simple base for fullstack Typescript projects with a shared completely typed
api. Note that the server allows CORS from everywhere. This project is based on
[Typescript-Node-Starter](https://github.com/Microsoft/TypeScript-Node-Starter)
and
[Typescript-React-Starter](https://github.com/Microsoft/TypeScript-React-Starter).

Running backend
---------------
    cd server; yarn; npm run watch

Running frontend
----------------
    cd client; yarn; npm run start

Development
-----------
In order to add a new api endpoint, it must be added first in
server/api/base.ts. After that, the compiler will throw errors until both
server/controllers/routes.ts and client/src/App.tsx are updated accordingly.

