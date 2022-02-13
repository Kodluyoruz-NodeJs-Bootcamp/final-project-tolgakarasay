import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Actor from './Actor';
import ActorLike from './ActorLike';
import ActorReview from './ActorReview';
import Movie from './Movie';
import MovieLike from './MovieLike';
import MovieReview from './MovieReview';

export enum AuthMethod {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: AuthMethod,
  })
  authMethod: AuthMethod;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ unique: true })
  @Length(4, 20)
  @IsNotEmpty()
  username: string;

  @Column({ nullable: true })
  @Length(4, 20)
  password: string;

  @Column({ default: '/images/profile/13.png' })
  avatarUrl: string;

  @OneToMany(() => Movie, (movie) => movie.user)
  public movies: Movie[];

  @OneToMany(() => MovieReview, (movie_review) => movie_review.user)
  public movie_reviews: MovieReview[];

  @OneToMany(() => MovieLike, (movie_like) => movie_like.user)
  public movie_likes: MovieLike[];

  @OneToMany(() => Actor, (actor) => actor.user)
  public actors: Actor[];

  @OneToMany(() => ActorReview, (actor_review) => actor_review.user)
  public actor_reviews: ActorReview[];

  @OneToMany(() => ActorLike, (actor_like) => actor_like.user)
  public actor_likes: ActorLike[];
}

export default User;
