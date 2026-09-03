import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Variant } from '../variants/variant.entity.js';

enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @ManyToOne(() => Variant, (variant) => variant.id)
  variant: Variant;

  @Column({ default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  expires_at: Date;
}
