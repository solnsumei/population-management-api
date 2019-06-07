# Population Management System API

Api to manage locations and their population.

## Built with
- NodeJs
- MongoDb
- KoaJs

## Features
- User registration and login
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

Request type | Endpoint              | Requires Auth | Action
-------------|-----------------------|---------------| ---------------------------------
POST         | /api/v1/register      | No           | Register
POST         | /api/v1/login         | No           | Login
GET          | /api/v1/locations     | No            | Fetch all locations and sub-locations from db
POST         | /api/v1/locations     | Yes           | Saves a location to the db
GET	         | /api/v1/location/:id  | No            | Gets a single location and it's sub-locations from db
PUT	         | /api/v1/location/:id  | Yes           | Modifies a location in the db
DELETE	     | /api/v1/location/:id  | Yes           | Deletes a location and its's sub-locations from db
