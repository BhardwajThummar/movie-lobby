import chai from 'chai';
import jwt from 'jsonwebtoken';
import { describe, it, before, after } from 'mocha';
import chaiHttp from 'chai-http';
import app from '../../app';
import User from '../../models/user';
import Movie from '../../models/movie';
import dotenv from 'dotenv';
import {
    getAllMovies,
    searchMovies,
    createMovie,
    updateMovie,
    deleteMovie,
} from '../../service/movieService';

dotenv.config();
chai.use(chaiHttp);

const expect = chai.expect;

describe('Movie Service - Unit Tests', () => {
    let userToken: string;
    let movieId: string;
    let userId: string;
    let adminToken: string;

    before(async () => {
        // Clear the User and Movie collections before running the tests
        await User.deleteOne({
            email: 'testuser@example.com'
        })

        await Movie.deleteOne({
            title: 'Test Movie'
        })

        const adminResponse = await chai
            .request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@gmail.com',
                password: 'securepass',
            });

        adminToken = adminResponse?.body?.token;

    });

    it('should create a new movie for the authenticated admin user', async () => {
        const movieData = {
            title: 'New Test Movie',
            genre: 'This is another test genre.',
            rating: 5,
            streamingLink: "https://www.youtube.com/watch?v=12345"
        }
        const result: any = await createMovie(movieData);
        movieId = result ? result?._id : '';
        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
        expect(result?.title).to.equal('New Test Movie');
    });

    it('should get all movies for the authenticated user', async () => {
        const result: any = await getAllMovies();
        expect(result.status).to.equal(200);
        expect(result.data).to.be.an('array');
        expect(result.data).to.have.length.greaterThan(0);
    });

    it('should find movies by title/genre for the authenticated user', async () => {
        let keyword = 'Test Movie';
        const result = await searchMovies(keyword);
        expect(result.status).to.equal(200);
        expect(result.data).to.not.be.null; // Add null check
        expect(result.data).to.have.length.greaterThan(0);
        expect(result.data?.[0]?.title).to.equal('New Test Movie');
    });

    it('should update a movie for the authenticated admin user', async () => {
        const movieData = {
            title: 'Updated Movie',
            genre: 'This movie has been updated.',
        }
        const result = await updateMovie(movieId, movieData);
        expect(result.status).to.equal(200);
        expect(result.data).to.have.property('title');
        expect(result?.data?.title).to.equal('Updated Movie');
    });

    it('should delete a movie for the authenticated admin user', async () => {
        const result = await deleteMovie(movieId);
        expect(result.status).to.equal(200);
        expect(result.data).to.have.property('isDeleted');
        expect(result?.data?.isDeleted).to.be.true;
    });

    after(async () => {
        // Clear the User and Movie collections after running the tests
        await User.deleteOne({
            email: 'testuser@example.com'
        })

        await Movie.deleteOne({
            title: 'Updated Movie'
        })
    })

});
