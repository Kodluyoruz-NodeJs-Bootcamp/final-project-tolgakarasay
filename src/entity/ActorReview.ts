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
import Actor from './Actor';
import User from './User';

@Entity()
export class ActorReview {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text')
  @IsNotEmpty()
  public text: string;

  @ManyToOne(() => User, (user) => user.actor_reviews, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public user: User;

  @ManyToOne(() => Actor, (actor) => actor.actor_reviews, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public actor: Actor;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;
}

export default ActorReview;
