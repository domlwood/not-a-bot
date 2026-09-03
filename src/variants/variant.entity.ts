import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../products/product.entity.js';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.id)
  Product: Product;

  @Column()
  label: string;

  @Column()
  total: number;

  @Column()
  remaining: number;
}
