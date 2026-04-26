"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnakeCaseNamingStrategy = void 0;
const typeorm_1 = require("typeorm");
class SnakeCaseNamingStrategy extends typeorm_1.DefaultNamingStrategy {
    tableName(className, customName) {
        return customName ?? this.toSnakeCase(className);
    }
    columnName(propertyName, customName) {
        return customName ?? this.toSnakeCase(propertyName);
    }
    relationName(propertyName) {
        return this.toSnakeCase(propertyName);
    }
    joinColumnName(relationName, referencedColumnName) {
        return this.toSnakeCase(`${relationName}_${referencedColumnName}`);
    }
    joinTableName(firstTableName, secondTableName) {
        return this.toSnakeCase(`${firstTableName}_${secondTableName}`);
    }
    joinTableColumnName(tableName, propertyName, columnName) {
        return this.toSnakeCase(`${tableName}_${columnName ?? propertyName}`);
    }
    toSnakeCase(str) {
        return str
            .replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`)
            .replace(/^_/, '');
    }
}
exports.SnakeCaseNamingStrategy = SnakeCaseNamingStrategy;
//# sourceMappingURL=snakeCaseNaming.strategy.js.map