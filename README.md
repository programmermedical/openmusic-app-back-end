# OpenMusic-API

## Application

- Node Version : 20.10.0 LTS
- Framework : Hapi
- RDBMS : PostgreSQL 16

# Tools

- esLint (AirBnB guide style)
- nodemon
- dotEnv
- JWT
- RabbitMQ
- Redis

## OpenMusic-API-V1

### 5 Kriteria Utama

1. Album Data Management

   - POST /albums
   - GET /albums/{id}
   - PUT /albums/{id}
   - DELETE /albums{id}

2. Song Data Management

   - POST /songs
   - GET /songs
   - GET /songs/{id}
   - PUT /albums/{id}
   - DELETE /albums{id}

3. Validation Data Implemented

   - POST /albums
     - name: string, required,
     - year: number, requiered
   - PUT /albums
     - name: string, required,
     - year: number, requiered
   - POST /songs
     - title: string, required,
     - year: number, required,
     - genre: string, required,
     - performer: string, required,
     - duration: number,
     - albumId: string
   - PUT /songs
     - title: string, required,
     - year: number, required,
     - genre: string, required,
     - performer: string, required,
     - duration: number,
     - albumId: string

4. Error Handling Implemented
5. Using a database to store data for albums and songs using Postgresql

#### Kriteria Optional

1. Brings up the track list in album details
   - endpoint: GET /albums/{albumId}
2. Query Parameter for song search
   - ?title,
   - ?performer
   * **Note:** The use of these two parameters can be combined

## OpenMusic-API-V2

### 6 Kriteria Utama

1. Registrasi dan Authentikasi Pengguna
   - POST /users
     - Body Request:
       - username, password, fullname: string
     - Response:
       - status code: 201
       - data: userId: "user_id"
     - Keterangan: Menambahkan pengguna
   - POST /authentications
     - Body Request:
       - username, password: string
     - Response:
       - status code: 201
       - data: accessToken: "token", refreshToken: "token"
     - Keterangan: Autentikasi pengguna/login
   - PUT /authentications
     - Body Request:
       - refreshTOken: string
     - Response:
       - status code: 200
       - data: accessToken: "token"
     - Keterangan: Memperbaharui access token
   - DELETE /authentications
     - Body Request:
       - refreshToken: string
     - Response:
       - status code: 200
       - message: \*any (nilai string apapun selama tidak kosong)
     - Keterangan: Menghapus autentikasi

**Ketentuan**:

- Username harus unik
- Authentication menggunakan JWT token
- JWT token harus mengandung payload berisi **userId** yang merupakan id dari user autentik
- Nilai secret key token JWT baik access token ataupun refresh token wajib menggunakan environment variabel **ACCESS_TOKEN_KEY** dan **REFRESH_TOKEN_KEY**
- Refresh token memiliki signature yang benar serta terdaftar di didatabase

2. Pengelolaan Data Playlist
   - Endpoint
     - POST /playlists
       - Body Request:
         - name: string
       - Response:
         - status code: 201
         - data: playlistId: "playlist_id"
       - Keterangan: Menambahkan playlist
     - GET /playlists
       - Body Request: -
       - Response:
         - status code: 200
         - data: playlists: playlist[]
       - Keterangan: Melihat daftar playlist yang dimiliki
     - DELETE /playlist/{id}
       - Body Request: -
       - Response:
         - status code: 200
         - message: \*any (nilai string apapun selama tidak kosong)
     - POST /playlists/{id}/songs
       - Body Request:
         - songId: string
       - Response:
         - status code: 201
         - message: \*any (nilai string apapun selama tidak kosong)
       - Keterangan: Menambahkan lagu ke playlist
     - GET /playlists/{id}/songs
       - Body Request: -
       - Response:
         - status code: 200
         - data: playlist: playlist
       - Keterangan: Melihat daftar lagu di dalam playlist
     - DELETE /playlists/{id}/songs
       - Body Request:
         songId: string
       - Response:
         - status code: 200
         - message: \*any (nilai string apapun selama tidak kosong)
       - Keterangan: Mengapus lagu dari playlist

**Ketentuan**:

- Playlist merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token.
- Playlist yang muncul pada **GET /playlists** hanya yang ia miliki saja.
- Hanya owner playlist (atau kolabolator) yang dapat menambahkan, melihat, dan menghapus lagu ke/dari playlist.
- **songId** dimasukkan/dihapus ke/dari playlist wajib bernilai id lagu yang valid.
- Properti **owner** merupakan user id dari pembuat playlist. Anda bisa mendapatkan nilainya melalui artifacts payload JWT.

3. Menerapkan Foreign Key

   - Tabel songs terhadap albums;
   - Tabel playlist terhadap users;
   - dan relasi tabel lainnya.

4. Menerapkan Data Validation

   - POST /users:
     - username : string, required.
     - password : string, required.
     - fullname : string, required.
   - POST /authentications:
     - username : string, required.
     - password : string, required.
   - PUT /authentications:
     - refreshToken : string, required.
   - DELETE /authentications:
     - refreshToken : string, required.
   - POST /playlists:
     - name : string, required.
   - POST /playlists/{playlistId}/songs
     - songId : string, required.

5. Penanganan Eror (_Error Handling_)

   - Ketika proses validasi data pada request payload tidak sesuai (gagal), server harus mengembalikan response:
     - status code: **400 (Bad Request)**
     - response body:
       - status: **fail**
       - message: \*any (apapun selama tidak kosong)
   - Ketika pengguna mengakses resource yang tidak ditemukan, server harus mengembalikan response:
     - status code: **404 (Not Found)**
     - response body:
       - status: **fail**
       - message: \*any (apapun selama tidak kosong)
   - Ketika pengguna mengakses resource yang dibatasi tanpa access token, server harus mengembalikan response:
     - status code: **401 (Unauthorized)**
     - response body:
       - status: **fail**
       - message: \*any (apapun selama tidak kosong)
   - Ketika pengguna memperbarui access token menggunakan refresh token yang tidak valid, server harus mengembalikan response:
     - status code: **400 (Bad Request)**
     - response body:
       - status: **fail**
       - message: \*any (apapun selama tidak kosong)
   - Ketika pengguna mengakses resource yang bukan haknya, server harus mengembalikan response:
     - status code: **403 (Forbidden)**
     - response body:
       - status: **fail**
       - message: \*any (apapun selama tidak kosong)
   - Ketika terjadi server eror, server harus mengembalikan response:
     - status code: **500 (Internal Server Error)**
     - response body:
       - status: **error**
       - message: \*any (apapun selama tidak kosong)

6. Pertahankan Fitur OpenMusic API V1
   - Pengelolaan data album
   - Pengelolaan data song
   - Menerapkan data validations resource album dan song

#### Kriteria Opsional

1. Memiliki fitur kolaborator playlist
   - Endpoint
     - POST /collaborations
       - Body Request:
         - playlistId: string
         - userId: string
       - Response:
         - status code: 201
         - body:
           - data: collaborationId: "collab_id"
       - Keterangan: Menambahkan kolabortor playlist
     - DELETE /collaborations
       - Body Request;
         - playlistId: string
         - userId: string
       - Response:
         - status code: 200
         - body:
           - message: \*any (nilai string apapun selama tidak kosong)

**Hak akses kolaborator**:

- Playlist tampil pada permintaan **GET /playlists**.
- Dapat menambahkan lagu ke dalam playlist.
- Dapat menghapus lagu dari playlist.
- Dapat melihat daftar lagu yang ada di playlist.
- Dapat melihat aktifitas playlist (jika menerapkan kriteria opsional ke-2).

2. Memiliki fitur playlist activities

   - GET /playlists/{id}/activities
     - Response:
       - status code: 200
       - body:
         - data: {}

3. Mempertahankan Kriteria Opsional OpenMusic V1
   - Mendapatkan daftar lagu di dalam album detail
   - Query Parameter untuk pencarian lagu

## OpenMusic-API-V3 {NOW | 03-06-2024}

### 5 Kriteria Utama

1.  Ekspor Lagu Pada Playlist
    API yang Anda buat harus tersedia fitur ekspor lagu pada playlist melalui route:

    Method : POST
    URL : /export/playlists/{playlistId}
    Body Request:
    {
        "targetEmail": string
    }

    **Ketentuan**:

    - Wajib menggunakan message broker dengan menggunakan RabbitMQ.
    - Nilai host server RabbitMQ wajib menggunakan environment variable RABBITMQ_SERVER
    - Hanya pemilik Playlist yang boleh mengekspor lagu
    - Wajib mengirimkan program consumer.
    - Hasil ekspor berupa data json.
    - Dikirimkan melalui email menggunakan nodemailer.
    - Kredensial user dan password email pengirim wajib menggunakan environment variable SMTP_USER dan SMTP_PASSWORD.
    - Nilai host dan port dari server SMTP juga wajib menggunakan environment variable SMTP_HOST dan SMTP_PORT.

    Response yang harus dikembalikan:
    Status Code: 201
    Response Body:
    {
        "status": "success",
        "message": "Permintaan Anda sedang kami proses",
    }

    Struktur data JSON yang diekspor adalah seperti ini:
    {
        "playlist": {
            "id": "playlist-Mk8AnmCp210PwT6B",
            "name": "My Favorite Coldplay Song",
            "songs": [
            {
                "id": "song-Qbax5Oy7L8WKf74l",
                "title": "Life in Technicolor",
                "performer": "Coldplay"
            },
            {
                "id": "song-poax5Oy7L8WKllqw",
                "title": "Centimeteries of London",
                "performer": "Coldplay"
            },
            {
                "id": "song-Qalokam7L8WKf74l",
                "title": "Lost!",
                "performer": "Coldplay"
            }
            ]
        }
    }

2.  Mengunggah Sampul Album
    API yang Anda buat harus dapat mengunggah sampul album melalui route:

    Method : POST
    URL : /albums/{id}/covers
    Body Request (Form data):
    {
        "cover": file
    }

    **Ketentuan**:

    - Tipe konten yang diunggah harus merupakan MIME types dari images.
    - Ukuran file cover maksimal 512000 Bytes.
    - Anda bisa menggunakan File System (lokal) atau S3 Bucket dalam menampung object.
    - Bila menggunakan S3 Bucket, nama bucket wajib menggunakan variable environment AWS_BUCKET_NAME.

    Response yang harus dikembalikan:
    Status Code: 201
    Response Body:
    {
        "status": "success",
        "message": "Sampul berhasil diunggah"
    }

    Respons dari endpoint GET /albums/{id} harus menampilkan properti coverUrl. Itu berarti, alamat atau nama sampul album harus disimpan di dalam database.

    Berikut respons yang harus dikembalikan oleh endpoint GET /albums/{id}:
    {
        "status": "success",
        "data": {
            "album": {
                "id": "album-Mk8AnmCp210PwT6B",
                "name": "Viva la Vida",
                "coverUrl": "http://...."
            }
        }
    }

    **Ketentuan**:
    URL gambar harus dapat diakses dengan baik.
    Bila album belum memiliki sampul, maka coverUrl bernilai null.
    Bila menambahkan sampul pada album yang sudah memiliki sampul, maka sampul lama akan tergantikan.

3.  Menyukai Album
    API harus memiliki fitur menyukai, batal menyukai, serta melihat jumlah yang menyukai album. Berikut spesifikasinya:

    ![alt text](https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos:85cd9ff509db80e1c76b46fe018d9d1320230328110909.png)
    \*any merupakan nilai string apa pun selama nilainya tidak kosong

    **Keterangan**:
    Menyukai atau batal menyukai album merupakan resource strict sehingga dibutuhkan autentikasi untuk mengaksesnya. Hal ini bertujuan untuk mengetahui apakah pengguna sudah menyukai album. Pastikan pengguna hanya bisa menyukai album yang sama sebanyak 1 kali Kembalikan dengan response code 400 jika pengguna mencoba menyukai album yang sama.

4.  Menerapkan Server-Side Cache

    - Menerapkan server-side cache pada jumlah yang menyukai sebuah album (GET /albums/{id}/likes).
    - Cache harus bertahan selama 30 menit.
    - Respons yang dihasilkan dari cache harus memiliki custom header properti X-Data-Source bernilai “cache”.
    - Cache harus dihapus setiap kali ada perubahan jumlah like pada album dengan id tertentu.
    - Memory caching engine wajib menggunakan Redis atau Memurai (Windows).
    - Nilai host server Redis wajib menggunakan environment variable REDIS_SERVER

5.  Pertahankan Fitur OpenMusic API versi 2 dan 1

    Pastikan fitur dan kriteria OpenMusic API versi 2 dan 1 tetap dipertahankan seperti:

    - Pengelolaan Data Album
    - Pengelolaan Data Song
    - Fitur Registrasi dan Autentikasi Pengguna
    - Pengelolaan Data Playlist
    - Menerapkan Foreign Key
    - Menerapkan Data Validation
    - Penanganan Eror (Error Handling)

#### Kriteria Opsional

1.  Menerapkan server-side caching pada resource di luar yang sudah ditentukan.

2.  Memenuhi kriteria opsional yang diberikan pada seluruh submission sebelumnya.

3.  Menggunakan ESLint dan salah satu style guide agar gaya penulisan kode JavaScript lebih konsisten dan menghindari disable linter yang tidak diperlukan.

4.  Menuliskan kode dengan bersih:
    - Menghapus kode yang redundan (tidak perlu).
    - Menghapus impor kode yang tidak digunakan.
    - Menghapus berkas yang tidak digunakan.
