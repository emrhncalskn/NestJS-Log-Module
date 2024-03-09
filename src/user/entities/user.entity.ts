import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';



@Entity('user')
export class User {

    static TABLE_NAME = 'user';
    static ALIAS = 'u';

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    first_name: string;
    @Column()
    last_name: string;
    @Column()
    email: string;
    @Column()
    password: string;
    @Column()
    role_id: number;
    @Column()
    status: number;
    @Column()
    image: string;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;

    /*@ManyToOne(() => Roles, roles => roles.users)
    @JoinColumn({ name: "urole", referencedColumnName: "id", foreignKeyConstraintName: "fk_r_urole" })
    role: Roles;*/

}