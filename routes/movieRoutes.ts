import express from 'express';
import { createMovieController, deleteMovieController, getAllMoviesController, searchMoviesController, updateMovieController } from '../controller/movieController';
import passport from '../middleware/authentication';
import { authorise } from '../middleware/authorization';
import { Role } from '../models/user';

const router = express.Router();

// Protect movie routes with authentication middleware
router.use(passport.authenticate('jwt', { session: false }));

// Define movie routes
router.get('/', getAllMoviesController);
router.get('/search', searchMoviesController);
router.post('/', authorise(Role.admin), createMovieController);
router.put('/:id', authorise(Role.admin), updateMovieController);
router.delete('/:id', deleteMovieController);

export default router;