import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { GameStatus } from '../models/enums/game-status.enum';
import { GameResult } from '../models/enums/game-result.enum';

@Entity('games')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'bet_amount', type: 'int', nullable: false })
  betAmount: number;

  @Column({ name: 'status', type: 'enum', enum: GameStatus, default: GameStatus.PLAYING })
  status: GameStatus;

  @Column({ name: 'result', type: 'enum', enum: GameResult, nullable: true })
  result: GameResult | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
