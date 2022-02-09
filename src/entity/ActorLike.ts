import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Actor from './Actor';
import User from './User';

@Entity()
export class ActorLike {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, (user) => user.actor_likes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public user: User;

  @ManyToOne(() => Actor, (actor) => actor.actor_likes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public actor: Actor;
}

export default ActorLike;
