import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class SnakeCaseNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  tableName(className: string, customName: string): string {
    return customName ?? this.toSnakeCase(className);
  }

  columnName(propertyName: string, customName: string): string {
    return customName ?? this.toSnakeCase(propertyName);
  }

  relationName(propertyName: string): string {
    return this.toSnakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return this.toSnakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName(firstTableName: string, secondTableName: string): string {
    return this.toSnakeCase(`${firstTableName}_${secondTableName}`);
  }

  joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
    return this.toSnakeCase(`${tableName}_${columnName ?? propertyName}`);
  }

  private toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`)
      .replace(/^_/, '');
  }
}
