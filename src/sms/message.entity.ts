import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  to: string;

  @Column()
  body: string;

  @CreateDateColumn()
  createdAt: Date;
}
