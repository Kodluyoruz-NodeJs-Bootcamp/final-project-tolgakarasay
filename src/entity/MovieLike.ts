import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Movie from './Movie';
import User from './User';

@Entity()
export class MovieLike {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(() => User, (user) => user.movie_likes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public user: User;

  @OneToOne(() => Movie, (movie) => movie.movie_likes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public movie: Movie;
}

export default MovieLike;
