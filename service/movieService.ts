import Movie from '../models/movie';
import { IMovie } from '../models/movie';

interface IMovieCreate extends Omit<IMovie, 'isDeleted'> {
}

// IMovieUpdate but all fields are optional except movieId which is required
interface IMovieUpdate extends Partial<IMovie> {
    title?: string,
    genre?: string,
    rating?: number,
    streamingLink?: string,
}

// getAllMovies
export const getAllMovies = async () => {
    try {
        const movies = await Movie.find({
            isDeleted: false
        });
        return {
            data: movies,
            status: 200,
            message: 'Success'
        }
    } catch (error) {
        console.error("error getAllMovies :>>", error);
        return {
            data: null,
            status: 500,
            message: 'Internal Server Error'
        }
    }
}

// searchMovies

export const searchMovies = async (key: string) => {
    try {
        const movies = await Movie.find({
            $or: [
                { title: { $regex: key, $options: 'i' } },
                { genre: { $regex: key, $options: 'i' } }
            ],
            isDeleted: false
        });

        if (movies.length === 0) {
            return {
                data: null,
                status: 404,
                message: 'Movie not found'
            }
        }

        return {
            data: movies,
            status: 200,
            message: 'Success'
        }
    } catch (error) {
        console.error("error searchMovies :>>", error);
        return {
            data: null,
            status: 500,
            message: 'Internal Server Error'
        }
    }
}

// createMovie
export const createMovie = async (movieData: IMovieCreate) => {
    try {

        const findMovie = await Movie.findOne({
            streamingLink: movieData.streamingLink
        });

        if (findMovie) {
            return {
                data: null,
                status: 400,
                message: 'Movie already exists'
            }
        }

        const movie = new Movie(movieData);
        return await movie.save();
    } catch (error) {
        console.error("error createMovie :>>", error);
        return error;
    }
}

// updateMovie
export const updateMovie = async (movieId: string, movieData: IMovieUpdate) => {
    try {

        const findMovie = await Movie.findOne({
            _id: movieId,
            isDeleted: false
        });

        if (!findMovie) {
            return {
                data: null,
                status: 404,
                message: 'Movie not found'
            }
        }

        const movie = await Movie.findByIdAndUpdate({
            _id: movieId
        }, movieData, {
            new: true
        });
        return {
            data: movie,
            status: 200,
            message: 'Success'
        }
    } catch (error) {
        console.error("error updateMovie :>> ", error);
        return {
            data: null,
            status: 500,
            message: 'Internal Server Error'
        }
    }
}

// deleteMovie
export const deleteMovie = async (movieId: string) => {
    try {

        const findMovie = await Movie.findOne({
            _id: movieId,
            isDeleted: false
        });

        if (!findMovie) {
            return {
                data: null,
                status: 404,
                message: 'Movie not found'
            }
        }

        const movie = await Movie.findOneAndUpdate({
            _id: movieId
        }, {
            isDeleted: true
        }, {
            new: true
        });
        return {
            data: movie,
            status: 200,
            message: 'Success'
        }
    } catch (error) {
        console.error("error deleteMovie :>>", error);
        return {
            data: null,
            status: 500,
            message: 'Internal Server Error'
        }
    }
}
