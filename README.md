# Next.js Teslo Shop

## Getting Started

The database is needed to run it locally

```
docker-compose up -d
```

MongoDB local connection string:

```
mongodb://localhost:27017/tesloDB
```

Add the necessary environment variables and rename the **.env.template** to **.env**

Install the dependencies and run the development server:

```
npm install
npm run dev
```

## Populate the database with test data (dev env)

To fill the database with test data, you can add data in **@/database/seed-data.ts** and call:

```
http://localhost:3000/api/seed
```
