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
import User from './User';
import MovieReview from './MovieReview';
import MovieLike from './MovieLike';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  public id: number;

  //   @Column()
  //   public url: string;

  @Column()
  @IsNotEmpty()
  public title: string;

  @Column('text')
  public description: string;

  @Column('int', { default: 0 })
  public likeCount: number;

  @Column('boolean', { default: false })
  public isShared: boolean = false;

  @ManyToOne(() => User, (user) => user.movies, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public user: User;

  @OneToMany(() => MovieReview, (movie_review) => movie_review.movie)
  public movie_reviews: MovieReview[];

  @OneToMany(() => MovieLike, (movie_likes) => movie_likes.movie)
  public movie_likes: MovieLike[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;
}

export default Movie;
