import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export default class UserTypeOrmEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name:string

    @CreateDateColumn()
    creation_date:string

    @Column()
    email:string
}