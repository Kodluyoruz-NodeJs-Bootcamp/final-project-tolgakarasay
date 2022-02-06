import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import Movie from './Movie';
import MovieLike from './MovieLike';
import MovieReview from './MovieReview';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Movie, (movie) => movie.user)
  public movies: Movie[];

  @OneToMany(() => MovieReview, (movie_reviews) => movie_reviews.user)
  public movie_reviews: MovieReview[];
}

export default User;
