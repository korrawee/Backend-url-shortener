import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('url')
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  urlCode: string;

  @Column()
  shortedUrl: string;

  @Column()
  originalUrl: string;
}
