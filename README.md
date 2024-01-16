# Application
+ Node Version : 20.10.0 LTS
+ Framework : Hapi
+ RDBMS : PostgreSQL 16

# Tools
+ esLint (AirBnB guide style)
+ dotEnv
+ nodemon

# Feature
1. Album Data Management (done)
    * POST /albums
    * GET /albums/{id}
    * PUT /albums/{id}
    * DELETE /albums{id}

2. Song Data Management (done)
    * POST /songs
    * GET /songs
    * GET /songs/{id}
    * PUT /albums/{id}
    * DELETE /albums{id}

3. Validation Data Implemented (done)
    * POST /albums
        - name: string, required,
        - year: number, requiered
    * PUT /albums
        - name: string, required,
        - year: number, requiered
    * POST /songs
        - title: string, required,
        - year: number, required,
        - genre: string, required,
        - performer: string, required,
        - duration: number,
        - albumId: string
    * PUT /songs
        - title: string, required,
        - year: number, required,
        - genre: string, required,
        - performer: string, required,
        - duration: number,
        - albumId: string

4. Error Handling Implemented (done)

5. Using a database to store data for albums and songs using Postgresql (done)

6. Brings up the track list in album details (done)
    - endpoint: GET /albums/{albumId}

7. Query Parameter for song search (done)
    - ?title,
    - ?performer
    > Note: The use of these two parameters can be combined

