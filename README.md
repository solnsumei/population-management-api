# Population Management System API

Api to manage locations and their population.

## Built with
- NodeJs
- MongoDb
- KoaJs

## Features
- Add a location and sub-locations
- Update a location's population data
- Delete a location and it's sub-locations

## Installation
After cloning this repository, cd into the root of the project, and run:
```
yarn install
```

### Start development server
```
yarn dev
```

### Run tests
```
yarn test
```

### API Endpoints

Request type | Endpoint                 | Action
-------------|--------------------------|--------------------------------------------------
GET           | /api/v1/locations        | fetch all locations and sub-locations from db
POST          | /api/v1/locations        | saves a location to the db
GET	         | /api/v1/location/:id    | Gets a single location and it's sub-locations from db
PUT	         | /api/v1/location/:id    | Modifies a location in the db
DELETE	     | /api/v1/location/:id    | Deletes a location and its's sub-locations from db
