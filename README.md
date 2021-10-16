# scribble-api
Scribble is a collaborative story writing platforms for anyone who wants to write and share ideas.

# notes
* for api docs lookup localhost:<port>/documentation
* following tdd and ddd
* coding convections
  - table names, small case with underscore
  - column names, camelcase works
  - function and variables, camelcase
  - commits, defined a task no or issue
  - branch names, feature/<name> , fix/<name>

## intial setup
* install nodesj 14.x.x (use nvm)
```
nvm use 14.x.x
```

## install npm packages
```
npm install
```

## update environment configuration
```
cp .env.sample .env
```

## install postgres & setup db
```
./setup_db.sh
```

## run database migration
```
npm run db:migrate
```

## start the server
```
npm run start:dev
```

## run test cases
```
npm run test
```

## create new db migrations
```
npm run db:make-migrate <migration_name>
```

##
- To debug Knex queries: `export DEBUG=knex*`
