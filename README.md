# Errand Planner

Errand Planner is a Google Maps directions management app.

Have a bunch of errands to run on the way home from work and want to minimize
your travel time? Not sure what traffic will be like, and what the quickest
way to visit each location will be? Create a path in the Errand Planner app, 
add your start, end, and errand locations, and click "Calculate Path" to 
generate a Google Maps directions link that will take you along the optimal
path.

## Setup
### Requirements
- Docker
- git / github

### Setup Steps
1. Clone the github repository.
2. Create a Google Developer account.
    - Create a new project
    - Enable the [Places Api](https://developers.google.com/maps/documentation/places/web-service/overview) and [Routes Api](https://developers.google.com/maps/documentation/routes) within your new project.
    - Create an API key.
3. Create a .env within the cloned `ErrandPlanner` root directory that provides 
   the following environment variables, including the google maps API key 
   mentioned in step 2.
    - The .env file is used to configure ports and database credentials, but is 
    also used to customize the following functional/ performance / security 
    settings in the app:
      - `JWT_EXPIRES_IN` - This value sets the expiration time for the JSON
      web tokens issued by the backend. 
      - `CORS_ORIGINS` - This value should be set to a comma seperated list
      of origins, a "cors whitelist" that the backend api will accept requests from.
      - `REDIS_KEY_TTL` - Sets the duration in seconds that responses from the 
      Google Routes API will be cached for. Longer durations could allow users 
      to potentially have an out of date path if they are attempting to calculate 
      and reclaculate the same path repeatedly while traffic conditions change. 
      Shorter durations will provide more up to date responses to users 
      re-calculating a path, but have the potential to be costly, depending on 
      usage. 
      - `GOOGLE_MAPS_API_KEY` and `VITE_GOOGLE_MAPS_API_KEY` - The same API key
      can be used for both varibles, provided that the API key has both the 
      Routes API and Places API enabled in the associated google project. In 
      production you'd likely want to use seperate keys, assigning each the
      minimum possible "permissions" to limit the risk associated with either.
      The `VITE_GOOGLE_MAPS_API_KEY` value will be discoverable in the frontend,
      so [restricting the key](https://developers.google.com/maps/api-security-best-practices) of the key to a specific frontend domain is crucial.

    - the example below has sensible defaults set. All you *NEED* to replace is
      the google maps API key 

      ```
      #Example .env file with dummy info
      # Database configuration
      POSTGRES_USER=postgres
      POSTGRES_PASSWORD=postgres
      POSTGRES_DB=errand_planner
      POSTGRES_PORT=5432
      
      # Backend configuration
      BACKEND_PORT=3000
      JWT_SECRET=aVeryGoodSecret
      JWT_EXPIRES_IN=1d
      CORS_ORIGINS=http://frontend:80,http://localhost:5173,http://localhost:8080
      GOOGLE_MAPS_API_KEY=Google-Maps-Api-Key-Example
      
      # Redis configuration
      REDIS_PORT=6379
      REDIS_KEY_TTL=180
      
      # Frontend configuration
      VITE_FRONTEND_PORT=8080
      VITE_GOOGLE_MAPS_API_KEY=Google-Maps-Api-Key-Example
      VITE_BACKEND_API_URL=http://localhost:3000/api/v1
      ```
  4. Execute the `docker compose up --build` command in the root directory to 
     run the application for the first time. 
     - Use `docker compose down` to stop and remove the containers.
     - Use `docker compose start` to restart the containers.
     - Use `docker compose stop` to stop the containers.

### Setup Notes
- The current docker-compose.yml file sets up docker volumes for postgres
  data and redis data on your device. This enables the perstistance of data
  across container restarts. 

## Using the App
1. Navigate to the `http://localhost:8080`, to begin planning your your
    optimized errand routes!
2. Register as a user
3. Login
4. Create a path
    - The paths page is used to create and view your "paths" aka lists of
  locations. Click on a path card to view it's details.
5. Add locations to your path, and get an optimized google directions link
    - On the path detail page, you can add locations to your path via google
  places search, or by selecting from recently used / saved paths. 
    - Add paths using the controls on the right hand side.
    - Click the big purple button to calculate your path! This gets a google
    directions with all errand locations organized into the most optimal 
    order, along with the drive time / distance data for your selected locations.
6. Save / Edit locations
    - You can save names for your favorite locations from the path detail page, 
    or the locations page. 
    - Deleting a saved location from the locations page will also remove it from
    any associated paths.

## Testing the App
To run the current tests, follow these steps.
1. Navigate to the `backend` directory.
2. Run the `npm install` command.
3. Run the `npm run test` command. 

## Future Work
1. More tests are needed, especially for the more complex services that handle interacting with the Google Routes API and adding and removing locations from paths. I haven't yet had time to ensure that the functionality is robust for future use and development.

2. I plan to build out full documentation of the backend API.

3. I'd love to further integrate with Google's Places and Maps APIs to generate a visual representation of each path on a map and pull in images and other details from Google about each location.

4. Customization options for metric or standard distances, avoiding tolls, and many other settings associated with interacting with the Google Routes API would help make the app even more useful.



