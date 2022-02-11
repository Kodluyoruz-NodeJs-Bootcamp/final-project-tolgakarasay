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
import ActorReview from './ActorReview';
import ActorLike from './ActorLike';

@Entity()
export class Actor {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: '/images/actor.jpg' })
  public url: string;

  @Column()
  @IsNotEmpty()
  public fullname: string;

  @Column('text')
  @IsNotEmpty()
  public bio: string;

  @Column('int', { default: 0 })
  public likeCount: number;

  @Column('int', { default: 0 })
  public reviewCount: number;

  @Column('boolean', { default: false })
  public isShared: boolean = false;

  @ManyToOne(() => User, (user) => user.actors, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  public user: User;

  @OneToMany(() => ActorReview, (actor_review) => actor_review.actor)
  public actor_reviews: ActorReview[];

  @OneToMany(() => ActorLike, (actor_like) => actor_like.actor)
  public actor_likes: ActorLike[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}

export default Actor;
