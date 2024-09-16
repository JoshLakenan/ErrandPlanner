# Errand Planner

Errand Planner is a Google Maps directions management app.

Have a bunch of errands to run on the way home from work and want to minimize
your travel time? Not sure what traffic will be like, and what the quickest
way to visit each location will be? Create a path in the Errand Planner app, 
add your start, end, and errand locations, and click "Calculate Path" to 
generate a Google Maps directions link that will take you along the optimal
path. Something you can't do in Google Maps on it's own!

## Setup
### Requirements
- Docker
- git / github

### Notes
- The current docker-compose.yml file sets up persistant storage of postgres
  data and redis data on your device.

### Steps
1. Clone the github repo
2. Create a Google Developer account
    - Create a new project
    - Enable the [Places Api](https://developers.google.com/maps/documentation/places/web-service/overview) and [Routes Api](https://developers.google.com/maps/documentation/routes) within your new project.
    - Create an API key.
3. Create a .env within the cloned `ErrandPlanner` root directory that provides 
   the following environment variables, including the google maps API key 
   mentioned in step 2.
    - The ports on which each service will be exposed on your local machine,
      the Redis caching ttl value, and cors whitelist can all be customized
      through the .env given this current setup. 

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
  4. Execute the `docker compose up --build` command in the ErrandPlanner root
     directory to run the application.

  5. Navigate to the `http://localhost:8080`, to begin planning your your
     optimized errand routes!
