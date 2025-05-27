# Order-Tracking-System
2. **Install dependencies for the frentend:**

    ```sh
    cd frentend
    npm install
    ```
3. **Install dependencies for the backend:**

    ```sh
    cd backend
    npm install
    ```


4. **Set up environment variables:**

    Create a `.env` file in the root directory and add your  connection string.

    
  ``
PG_USER ="postgres"
  PG_HOST ="localhost"
  PG_DATABASE ="db name"
  PG_PASSWORD ="********"
  PG_PORT =5432
    ``

5. **Run the backend:**

    ```sh
    cd backend
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    nodemon src/index.js 
    ```
   **Run the frentend:**

    Open a new terminal window and navigate to the `frentend` directory:

    ```sh
    cd frentend
     npm run dev   
