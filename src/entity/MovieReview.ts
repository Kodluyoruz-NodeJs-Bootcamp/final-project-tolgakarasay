import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Post from './Movie';
import User from './User';

@Entity()
export class MovieReview {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsNotEmpty()
  public text: string;

  @ManyToOne(() => User, (user) => user.movie_reviews, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public user: User;

  @ManyToOne(() => Post, (post) => post.movie_reviews, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public post: Post;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}

export default MovieReview;
