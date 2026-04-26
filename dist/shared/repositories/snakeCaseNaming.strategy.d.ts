import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
export declare class SnakeCaseNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    tableName(className: string, customName: string): string;
    columnName(propertyName: string, customName: string): string;
    relationName(propertyName: string): string;
    joinColumnName(relationName: string, referencedColumnName: string): string;
    joinTableName(firstTableName: string, secondTableName: string): string;
    joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string;
    private toSnakeCase;
}
