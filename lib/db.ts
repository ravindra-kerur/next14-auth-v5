import { PrismaClient } from "@prisma/client";

// This is only required in development mode.
// We are doing this because of nextjs hot reload. Whenever we save a this file, nextjs will run a hot reload.
// So what that will do is initilize a 'new PrismaClient()' every time. Then we will get the warning message
// every time in the terminal that you have too many active prisma clients.
// 'globalThis' is not affected by hot reload
declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// OR We can easily done this. This is going to happen in production mode.
// export const db = new PrismaClient();


// STEPS For Prisma setup 
// 1. npm i -D Prism
// 2. npm i @prisma/client
// 3. create the prisma util file in - lib/db.ts folder 
// 4. npx prisma init 
// 5. In .env, have to update actual DATABASE_URL
// 6. We need to use the 'Neon' a postgresql DB. Login and creare a new project / db
// 7. Go to 'schema.prisma' file in 'prisma' folder and add the db connection details
// 8. Also update the .env file with - DATABASE_URL, DIRECT_URL
// 9. Create a 'User' model in 'schema.prisma' file
// 10. Then run - 'npx prisma generate' in terminal
// 11. By using db.ts, we can access the database
// 12. Test by adding this code in Layout.ts file: const user = await db.user;
// 13. Then run - 'npx prisma db push'.
// If it is success, we will get: Your database is now in sync with your Prisma schema. Done in 5.92s

// So, we successfully connected to 'postgresql' using Prisma

//Next go to the Auth.js (v5) documentation 
// Getting started -> Database Adapters -> select 'prisma'
// Note: Database Adapters are the bridge we use to connect Auth.js to your database. (https://authjs.dev/reference/prisma-adapter)
// We have already installed: npm install @prisma/client  
// We need to install: npm install @auth/prisma-adapter

// Note: Any changes we do in the "schema.prisma" file, we need to run generate cmd and push cmd:
//  1. npx prisma generate, 2. npx prisma db push
