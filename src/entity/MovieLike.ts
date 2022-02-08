import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Movie from './Movie';
import User from './User';

@Entity()
export class MovieLike {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, (user) => user.movie_likes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public user: User;

  @ManyToOne(() => Movie, (movie) => movie.movie_likes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public movie: Movie;
}

export default MovieLike;
