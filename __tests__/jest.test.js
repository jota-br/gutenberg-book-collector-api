const app = require('../src/app');
const crypto = require('crypto');
const request = require('supertest');

const {
    mongoConnect,
    mongoDisconnect,
} = require('../src/services/mongo');

const { gutenbergParser } = require('../data/gutenberg.collector');

describe('Launches API', () => {
    const secretKey = crypto.randomBytes(32).toString('hex');

    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Create Admin', () => {
        test('Should respond 201 Created', async () => {
            const mockUserData = {
                username: 'secretUser',
                password: secretKey,
                role: 'admin',
            };
            const mockUserDataReturn = {
                username: 'secretUser',
                role: 'admin',
                oauth: {
                    provider: null,
                    provider_id: null,
                },
            };

            const response = await request(app)
                .post('/users/create_admin')
                .send(mockUserData)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toMatchObject(mockUserDataReturn);
        });

        test('Should respond 400 Bad Request with missing_username: true', async () => {
            const mockUserData = {
                username: '',
                password: secretKey,
                role: 'admin',
            };
            const returnData = {
                "missing_username": true,
                "username_spaces": false,
                "username_exists": false,
                "missing_password": false,
                "password_spaces": false,
                "invalid_role": false,
                "error": true
            };

            const response = await request(app)
                .post('/users/create_admin')
                .send(mockUserData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toMatchObject(returnData);
        });

        test('Should respond 400 Bad Request with username_spaces: true', async () => {
            const mockUserData = {
                username: 'secret User',
                password: secretKey,
                role: 'admin',
            };
            const returnData = {
                "missing_username": false,
                "username_spaces": true,
                "username_exists": false,
                "missing_password": false,
                "password_spaces": false,
                "invalid_role": false,
                "error": true
            };

            const response = await request(app)
                .post('/users/create_admin')
                .send(mockUserData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toMatchObject(returnData);
        });

        test('Should respond 400 Bad Request with username_exists: true', async () => {
            const mockUserData = {
                username: 'secretUser',
                password: secretKey,
                role: 'admin',
            };
            const returnData = {
                "missing_username": false,
                "username_spaces": false,
                "username_exists": true,
                "missing_password": false,
                "password_spaces": false,
                "invalid_role": false,
                "error": true
            };

            const response = await request(app)
                .post('/users/create_admin')
                .send(mockUserData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toMatchObject(returnData);
        });

        test('Should respond 400 Bad Request with missing_password: true', async () => {
            const mockUserData = {
                username: 'secret_User',
                password: '',
                role: 'admin',
            };
            const returnData = {
                "missing_username": false,
                "username_spaces": false,
                "username_exists": false,
                "missing_password": true,
                "password_spaces": false,
                "invalid_role": false,
                "error": true
            };

            const response = await request(app)
                .post('/users/create_admin')
                .send(mockUserData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toMatchObject(returnData);
        });

        test('Should respond 400 Bad Request with password_spaces: true', async () => {
            const mockUserData = {
                username: 'secret_User',
                password: 'secret Key',
                role: 'admin',
            };
            const returnData = {
                "missing_username": false,
                "username_spaces": false,
                "username_exists": false,
                "missing_password": false,
                "password_spaces": true,
                "invalid_role": false,
                "error": true
            };

            const response = await request(app)
                .post('/users/create_admin')
                .send(mockUserData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toMatchObject(returnData);
        });

        test('Should respond 400 Bad Request with invalid_role: true', async () => {
            const mockUserData = {
                username: 'secret_User',
                password: secretKey,
                role: 'Not_admin_or_user',
            };
            const returnData = {
                "missing_username": false,
                "username_spaces": false,
                "username_exists": false,
                "missing_password": false,
                "password_spaces": false,
                "invalid_role": true,
                "error": true
            };

            const response = await request(app)
                .post('/users/create_admin')
                .send(mockUserData)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toMatchObject(returnData);
        });
    });

    describe('Logged in as Admin', () => {
        let session;
        test('Login should respond 200 OK', async () => {
            const mockUserData = {
                username: 'secretUser',
                password: secretKey,
            };
            const returnData = {
                username: 'secretUser',
                role: 'admin',
            };
            const response = await request(app)
                .post('/auth/login')
                .send(mockUserData)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(response.body).toMatchObject(returnData);
            session = response.headers['set-cookie'];
        });

        describe('POST /books', () => {
            test('Should respond 201 Created', async () => {
                const mockBookData = {
                    "gutenbergId": "900012345",
                    "title": "Example: A New Journey",
                    "authors": "Jason, The Gramatical Terror",
                    "releaseDate": "1 jul 1970",
                    "subjects": "thriller",
                    "language": "en"
                }
                const returnData = {
                    "gutenbergId": 900012345,
                    "title": "Example: A New Journey",
                    "authors": "Jason, The Gramatical Terror",
                    "releaseDate": 15649200000,
                    "subjects": null,
                    "language": "en",
                    "img": "https://www.gutenberg.org/cache/epub/900012345/pg900012345.cover.medium.jpg",
                    "url": "https://www.gutenberg.org/ebooks/900012345"
                }
                const response = await request(app)
                    .get('/books')
                    .set('Cookie', session)
                    .expect('Content-Type', /json/)
                    .expect(201)

                expect(response.body).toMatchObject(returnData);
            });
        });
    });

    describe('Get /books', () => {
        test('Should respond 200 OK', async () => {
            const response = await request(app)
                .get('/books')
                .expect('Content-Type', /json/)
                .expect(200)
        });
    });

    describe('Get /books/:id', () => {
        test('Should respond 200 OK', async () => {
            const response = await request(app)
                .get('/books/900012345')
                .expect('Content-Type', /json/)
                .expect(200)
        });
    });

    describe('Get /books/:author/', () => {
        test('Should respond 200 OK', async () => {
            const response = await request(app)
                .get('/books/author/Jason')
                .expect('Content-Type', /json/)
                .expect(200)
        });
    });

    describe('Get /books/:subject/', () => {
        test('Should respond 200 OK', async () => {
            const response = await request(app)
                .get('/books/subject/thriller')
                .expect('Content-Type', /json/)
                .expect(200)
        });
    });

    describe('Login with invalid credentials', () => {
        test('Login should respond with 400 Bad Request for invalid_username', async () => {
            const mockUserData = {
                username: 'secretUser__',
                password: secretKey,
            };
            const returnData = {
                "invalid_username": true,
                "invalid_credential": false,
                "error": true
            };
            const response = await request(app)
                .post('/auth/login')
                .send(mockUserData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toMatchObject(returnData);
        });

        test('Login should respond with 400 Bad Request for invalid_credential', async () => {
            const mockUserData = {
                username: 'secretUser',
                password: 'secretKey',
            };
            const returnData = {
                "invalid_username": false,
                "invalid_credential": true,
                "error": true
            };
            const response = await request(app)
                .post('/auth/login')
                .send(mockUserData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toMatchObject(returnData);
        });
    });
});

