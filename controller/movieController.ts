import { Request, Response } from 'express';
import { createMovie, deleteMovie, getAllMovies, searchMovies, updateMovie } from '../service/movieService';
import { createMovieValidation, deleteMovieValidation, searchMoviesValidation, updateMovieValidation } from '../validate/movieValidation';

export const getAllMoviesController = async (req: Request, res: Response) => {
  try {
    const movies = await getAllMovies();
    res.status(movies.status).json(movies);
  } catch (error) {
    console.log('getAllMoviesController');
    console.error("error getAllMoviesController :>>", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const searchMoviesController = async (req: Request, res: Response) => {
  try {
    const { error, value } = searchMoviesValidation.validate(req.query);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const movie = await searchMovies(value.q);
    res.status(movie.status).json(movie);
  } catch (error) {
    console.error("error searchMoviesController :>>", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const createMovieController = async (req: Request, res: Response) => {
  try {
    const { error, value } = createMovieValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const movie = await createMovie(value);

    res.status(201).json(movie);

  } catch (error) {
    console.error("error createMovieController :>>", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const updateMovieController = async (req: Request, res: Response) => {
  try {
    const { error, value } = updateMovieValidation.validate({ ...req.body, ...req.params });

    const { id, ...movieData } = value;

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const movie = await updateMovie(id, movieData);

    res.status(movie.status).json(movie);

  } catch (error) {
    console.error("error updateMovieController :>>", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const deleteMovieController = async (req: Request, res: Response) => {
  try {
    const { error, value } = deleteMovieValidation.validate(req.params);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const movie = await deleteMovie(value.id);

    res.status(movie.status).json(movie);

  } catch (error) {
    console.error("error deleteMovieController :>>", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
