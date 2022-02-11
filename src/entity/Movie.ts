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

  @Column({ default: '/images/cinema.jpg' })
  public url: string;

  @Column()
  @IsNotEmpty()
  public title: string;

  @Column('text')
  @IsNotEmpty()
  public description: string;

  @Column('int', { default: 0 })
  public likeCount: number;

  @Column('int', { default: 0 })
  public reviewCount: number;

  @Column('boolean', { default: false })
  public isShared: boolean = false;

  @ManyToOne(() => User, (user) => user.movies, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  public user: User;

  @OneToMany(() => MovieReview, (movie_review) => movie_review.movie)
  public movie_reviews: MovieReview[];

  @OneToMany(() => MovieLike, (movie_like) => movie_like.movie)
  public movie_likes: MovieLike[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}

export default Movie;
