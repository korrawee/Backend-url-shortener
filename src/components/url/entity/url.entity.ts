import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('url')
export class Url {
  @Column({
    unique: true,
  })
  urlCode: string;

  @Column()
  originalUrl: string;
}
