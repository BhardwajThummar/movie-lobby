import chai from 'chai';
import jwt from 'jsonwebtoken';
import { describe, it, before, after } from 'mocha';
import chaiHttp from 'chai-http';
import app from '../../app';
import User from '../../models/user';
import Movie from '../../models/movie';
import dotenv from 'dotenv';

dotenv.config();
chai.use(chaiHttp);

const expect = chai.expect;

describe('Movie API - Integration Tests', () => {
    let userToken: string;
    let movieId: string;
    let userId: string;
    let adminToken: string;

    before(async () => {
        // Clear the User and Movie collections before running the tests
        await User.deleteOne({
            email: "testuser@example.com"
        })
        await Movie.deleteOne({
            title: "Test Movie"
        })

        // Register a user and create a movie
        const userResponse = await chai
            .request(app)
            .post('/api/auth/signup')
            .send({
                email: 'testuser@example.com',
                password: 'testpassword',
            });


        const adminResponse = await chai
            .request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@gmail.com',
                password: 'securepass',
            });

        userToken = userResponse?.body?.token;
        adminToken = adminResponse?.body?.token;

        // decode the jwt token to get the userId
        const decodedToken: any = jwt.verify(userToken, process.env.JWT_SECRET as string);
        userId = decodedToken._id;

        const movieResponse: any = await chai
            .request(app)
            .post(`/api/movies`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'Test Movie',
                genre: 'This is a test genre.',
                rating: 5,
                streamingLink: 'https://www.youtube.com/watch?v=12345',
            });

        movieId = movieResponse.body._id;
    });

    it('should get all movies for the authenticated user', async () => {
        const response = await chai
            .request(app)
            .get(`/api/movies`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data').to.be.an('array');
        expect(response.body.data).to.have.length.greaterThan(0);
    });

    it('should update a specific movie for the authenticated admin user', async () => {
        const response = await chai
            .request(app)
            .put(`/api/movies/${movieId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'Updated Movie Title',
                genre: 'This is a test genre.',
                rating: 10,
                streamingLink: 'https://www.youtube.com/watch?v=12345',
            });

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data').to.be.an('object');
        expect(response.body.data.title).to.equal('Updated Movie Title');
    });

    it('should find a movie using movie title or genre for authenticated user', async () => {
        const response = await chai
            .request(app)
            .get(`/api/movies/search?q=Movie`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data').to.be.an('array');
        expect(response.body.data).to.have.length.greaterThan(0);
    })

    it('should delete a specific movie for the authenticated admin user', async () => {
        const response = await chai
            .request(app)
            .delete(`/api/movies/${movieId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data').to.be.an('object');
        expect(response.body.data._id).to.equal(movieId);

        // Ensure the movie is deleted
        const deletedMovie = await Movie.findOne({ _id: movieId, isDeleted: false });
        expect(deletedMovie).to.be.null;
    });

    it('should not allow empty title or content when creating a movie', async () => {
        const response = await chai
            .request(app)
            .post('/api/movies')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: '',
                genre: '',
                rating: null,
                streamingLink: '',
            });

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal("\"title\" is not allowed to be empty");
    });

    after(async () => {
        // Close the MongoDB connection after all tests
        await User.deleteOne({
            email: "testuser@example.com"
        })
        await Movie.deleteOne({
            title: "Updated Movie Title"
        })
    });
});
