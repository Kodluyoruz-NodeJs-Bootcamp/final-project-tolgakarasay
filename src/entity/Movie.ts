import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import MovieReview from './MovieReview';
// import MovieLike from './MovieLike';
import User from './User';
import MovieReview from './MovieReview';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  public id: number;

  //   @Column()
  //   public url: string;

  @Column()
  @IsNotEmpty()
  public title: string;

  @Column()
  public description: string;

  @ManyToOne(() => User, (user) => user.movies, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public user: User;

  @OneToMany(() => MovieReview, (movie_review) => movie_review.movie)
  public movie_reviews: MovieReview[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;
}

export default Movie;
