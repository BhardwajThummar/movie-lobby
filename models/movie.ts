import { Document, Schema, Model, model } from 'mongoose';

export interface IMovie {
    title: string;
    genre: string;
    rating: number;
    streamingLink: string;
    isDeleted?: boolean;
}

export interface IMovieDocument extends IMovie, Document { }

export interface IMovieModel extends Model<IMovieDocument> { }

const movieSchema = new Schema<IMovieDocument, IMovieModel>({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    rating: { type: Number, required: true },
    streamingLink: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Enable text indexing for search functionality
movieSchema.index({ title: 'text' });
movieSchema.index({ genre: 'text' });

const Movie: IMovieModel = model<IMovieDocument, IMovieModel>('Movie', movieSchema);

export default Movie;
