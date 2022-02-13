import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Movie from './Movie';
import User from './User';

@Entity()
export class MovieReview {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text')
  @IsNotEmpty()
  public text: string;

  @ManyToOne(() => User, (user) => user.movie_reviews, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public user: User;

  @ManyToOne(() => Movie, (movie) => movie.movie_reviews, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public movie: Movie;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;
}

export default MovieReview;
