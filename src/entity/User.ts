import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Movie from './Movie';
import MovieLike from './MovieLike';
import MovieReview from './MovieReview';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  @Length(4, 20)
  @IsNotEmpty()
  username: string;

  @Column()
  @Length(4, 20)
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Movie, (movie) => movie.user)
  public movies: Movie[];

  @OneToMany(() => MovieReview, (movie_review) => movie_review.user)
  public movie_reviews: MovieReview[];

  @OneToMany(() => MovieLike, (movie_like) => movie_like.user)
  public movie_likes: MovieLike[];
}

export default User;
