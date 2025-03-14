import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  firstName: string;

  @Column({
    length: 100,
    type: 'varchar',
    nullable: true,
  })
  lastName: string;

  @Column({ unique: true, type: 'citext', nullable: false })
  email: string;

  @Column({
    length: 100,
    type: 'varchar',
    nullable: false,
  })
  password: string;
}
