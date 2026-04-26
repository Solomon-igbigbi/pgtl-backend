import { BaseEntity as TypeOrmBaseEntity } from 'typeorm';
export declare abstract class BaseEntity extends TypeOrmBaseEntity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    updatedBy: string;
    createdBy: string;
}
