# Gutenberg Book Collector
#### Description: Collects data from [gutenberg.org](https://www.gutenberg.org/cache/epub/feeds/pg_catalog.csv) and acquires books information.

Gutenberg Book Collector is an API service that allows users to collect book information from Gutenberg.org and store it in a MongoDB database. This service provides endpoints for accessing, updating, and deleting book data.

### Postman Collection
You can test all API endpoints using Postman.

1. Download the Postman collection: [Download Postman Collection](./postman/book-collector.json)
2. Open Postman and click **Import**.
3. Select the downloaded JSON file to import the collection.
4. Test the API by running the requests in Postman.

### Book Schema
- gutenbergId (Number): Unique identifier for each book on Gutenberg. This is the primary key. **REQUIRED**
- title (String): The title of the book. **REQUIRED**
- authors (String): The name of the book’s authors.
- releaseDate (String): The date when the book was released.
- subjects (String): Genre or category of the book.
- language (String): Language of the book.

### User Schema
- id (Number): Unique identifier for each user. This is the primary key. **REQUIRED**
- username (String): Unique identifier for authentication. **REQUIRED**
- salt (String): Randomly generated string to enhance password security. **REQUIRED**
- hash (String): Hashed version of user password. **REQUIRED**
- role (String): User role in the system (admited: `admin` or `user`). **REQUIRED**

### Requirements:
#### mongoDB
You can create a MongoDB cluster at [MongoDB](https://www.mongodb.com/).
Ensure that you have MongoDB set up and accessible, either locally or via a cloud database.

### Installation:
1. Create a `.env` file in `src` directory with `MONGO_URL=url`, `PORT=3000` and a `SECRET_KEY=random-secure-key`.
2. Install dependencies from the root folder:
```
npm install
```

### Endpoints
- GET /books
- GET /books/:id
- GET /books/author/:author
- GET /books/subject/:subject
- POST /books/ **admin role required**
- POST /books/delete/:id **admin role required**
- GET /collect_gutenberg **localhost restricted**
- POST /users/create_admin **localhost restricted**
- POST /users/login
- POST /users/logout
- POST /users/delete/:id **admin role required**

### How to use
In root directory you can start the server with: <b>npm run start</b>. </br>

### GET Requests
GET Requests are paginated. Page navigation is as follows: `http://localhost:3000/endpoint-name?page=1&limit=10`. </br>
`page` is the desired page to request and `limit` is the maximum number o results per page. </br>
If no `page` or `limit` is defined, the default number of 1 for `page` and 10 for `limit` will be used. </br>
GET requests will include, at the end of all results pagination information.</br>
```json
{
    "books": [
        {
            ...
        }
    ],
    "books_total": 3470,
    "current_page": 1, // Default value is 1
    "total_pages": 3470,
    "books_per_page": 10 // Default value is 10
}
```
Book results are sorted by `title`.</br>

#### GET /books
GET all books at [/books](http://localhost:3000/books), returns JSON.
```json
{
    "books": [
        {
            "gutenbergId": 2186,
            "authors": "Kipling, Rudyard, 1865-1936",
            "img": "https://www.gutenberg.org/cache/epub/2186/pg2186.cover.medium.jpg",
            "language": "en",
            "releaseDate": 957139200000,
            "subjects": "Sea stories; Bildungsromans; Children of the rich -- Fiction; Saltwater fishing -- Fiction; Fishing boats -- Fiction; Teenage boys -- Fiction; Rescues -- Fiction; Fishers -- Fiction; Grand Banks of Newfoundland -- Fiction",
            "title": "\"Captains Courageous\": A Story of the Grand Banks",
            "url": "https://www.gutenberg.org/ebooks/2186"
        }
    ],
    "books_total": 3470,
    "current_page": 1,
    "total_pages": 3470,
    "books_per_page": 1
}
```
`200 OK` on success. </br>
`400 Bad Request` if there's an error.</br>

#### GET /books/:id
GET book with corresponding gutenbergId at [/books/:id](http://localhost:3000/books/45), returns JSON.
```json
{
    "gutenbergId": "900012345",
    "title": "Example: A New Journey",
    "authors": "Jason, The Gramatical Terror",
    "releaseDate": "1 jul 1970",
    "subjects": "thriller",
    "language": "en",
    "img": "https://www.gutenberg.org/cache/epub/900012345/pg900012345.cover.medium.jpg",
    "url": "https://www.gutenberg.org/ebooks/900012345"
}
```
`200 OK` on success. </br>
`400 Bad Request` if there's an error.</br>

#### GET /books/author/:author
GET all books with corresponding author at [/books/author/:author](http://localhost:3000/books/author/Dickens), returns JSON.
```json
{
    "books": [
        {
            "gutenbergId": 2186,
            "authors": "Kipling, Rudyard, 1865-1936",
            "img": "https://www.gutenberg.org/cache/epub/2186/pg2186.cover.medium.jpg",
            "language": "en",
            "releaseDate": 957139200000,
            "subjects": "Sea stories; Bildungsromans; Children of the rich -- Fiction; Saltwater fishing -- Fiction; Fishing boats -- Fiction; Teenage boys -- Fiction; Rescues -- Fiction; Fishers -- Fiction; Grand Banks of Newfoundland -- Fiction",
            "title": "\"Captains Courageous\": A Story of the Grand Banks",
            "url": "https://www.gutenberg.org/ebooks/2186"
        }
    ],
    "books_total": 3470,
    "current_page": 1,
    "total_pages": 3470,
    "books_per_page": 1
}
```
`200 OK` on success. </br>
`400 Bad Request` if there's an error.</br>

#### GET /books/subject/:subject
GET all books with corresponding subject at [/books/subject/:subject](http://localhost:3000/books/subject/thriller), returns JSON.
```json
{
    "books": [
        {
            "gutenbergId": 2186,
            "authors": "Kipling, Rudyard, 1865-1936",
            "img": "https://www.gutenberg.org/cache/epub/2186/pg2186.cover.medium.jpg",
            "language": "en",
            "releaseDate": 957139200000,
            "subjects": "Sea stories; Bildungsromans; Children of the rich -- Fiction; Saltwater fishing -- Fiction; Fishing boats -- Fiction; Teenage boys -- Fiction; Rescues -- Fiction; Fishers -- Fiction; Grand Banks of Newfoundland -- Fiction",
            "title": "\"Captains Courageous\": A Story of the Grand Banks",
            "url": "https://www.gutenberg.org/ebooks/2186"
        }
    ],
    "books_total": 3470,
    "current_page": 1,
    "total_pages": 3470,
    "books_per_page": 1
}
```
`200 OK` on success. </br>
`400 Bad Request` if there's an error.</br>

#### POST /books
**admin role required** </br>
UPSERT book at [/books](http://localhost:3000/books), returns JSON. </br>
If the `gutenbergId` already exists, it updates the existing entry. </br>
If the `gutenbergId` is not found, it creates a new entry. </br>
Expected JSON:
```json
{
    "gutenbergId": "900012345",
    "title": "Example: A New Journey",
    "authors": "Jason, The Gramatical Terror",
    "releaseDate": "1 jul 1970",
    "subjects": "thriller",
    "language": "en",
    "img": "https://www.gutenberg.org/cache/epub/900012345/pg900012345.cover.medium.jpg",
    "url": "https://www.gutenberg.org/ebooks/900012345"
}
```
**Required fields:** </br>
`gutenbergId` (Number). </br>
`title` (String).</br>
**Response codes:** </br>
`201 Created` Book created or updated successfully.  </br>
`400 Bad Request` There was an error (e.g. missing fields...). </br>

#### POST /books/delete/:id
**admin role required** </br>
DELETE existing book with corresponding `gutenbergId` at [/books/delete/:id](http://localhost:3000/books/delete/90013), returns JSON. </br>
**Success returns:** </br>
```json
{
    "msg": "Book with gutenbergId 900012345 was deleted..."
}
```
**Error returns:** </br>
```json
{
    "error": "Book with gutenbergId 900012345 not found..."
}
```
`200 OK` book was deleted.  </br>
`400 Bad Request` There was an error (e.g. missing gutenbergId). </br>

#### GET /collect_gutenberg
**admin role required** </br>
Start collector at [/collect_gutenberg](http://localhost:3000/collect_gutenberg). </br>
Will read Gutenberg.org csv file collection with all books, parse and save to database. </br>
If access is granted:
```json
{
    "msg": "Access granted..."
}
```
If access is denied will return:
```json
{ 
    "error": "Access denied..."
}
```
**Response codes:** </br>
`200 OK` Collector started.  </br>
`403 Forbidden` Access was denied. </br>

#### POST /users/create_admin
**localhost restricted** </br>
Creates user account at [/users/create_admin](http://localhost:3000/users/create_admin). </br>
Role-based access control and token-based authentication are enforced.
Required body:
```json
{
    "username":"admin",
    "password":"admin",
    "role":"user"
}
```
If access is granted:
```json
{
    "msg": "Access granted..."
}
```
If access is denied will return:
```json
{ 
    "error": "Access denied..."
}
```
**Response codes:** </br>
`201 Created` Collector started.  </br>
`403 Forbidden` Access was denied. </br>

#### POST /users/login
Login at [/users/login](http://localhost:3000/users/login). </br>
Required body:
```json
{
    "username":"admin",
    "password":"admin"
}
```
On success:
```json
{
    "token": "token-value"
}
```
On fail:
```json
{
    "invalid_credential": true,
    "error": true
}
```
**Response codes:** </br>
`200 OK` Login was successful.  </br>
`401 Unauthorized` Login unauthorized. </br>

#### POST /users/logout
Logout at [/users/login](http://localhost:3000/users/logout). </br>
On success:
```json
{
    "msg": "Logged out successfully..."
}
```
On fail:
```json
{
    "error": "You must be logged in to logout..."
}
```
**Response codes:** </br>
`200 OK` logged out was successful.  </br>
`400 Bad Request` Something went wrong. </br>

#### POST /users/delete:id
**admin role required** </br>
DELETE existing user with corresponding `id` at [/users/delete/:id](http://localhost:3000/users/delete/2), returns JSON. </br>
```json
{
    "username":"admin",
    "password":"admin"
}
```
On success:
```json
{
    "msg": "User with id 2 was deleted..."
}
```
On fail:
```json
{
    "error": "User with id 2 not found..."
}
```
**Response codes:** </br>
`200 OK` Login was successful.  </br>
`401 Unauthorized` Login unauthorized. </br>

#### License
**Creative Commons Attribution-ShareAlike 4.0 International**