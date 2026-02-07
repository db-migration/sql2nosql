import type {
  AnalysisResult,
  NoSqlCollection,
  NoSqlField,
  NoSqlSchema,
  SqlSchema,
  SqlTable,
} from "./model";

/**
 * Map a SqlSchema to a NoSqlSchema using simple, deterministic rules:
 * - Each table becomes a collection.
 * - Primary key columns are kept as fields; caller can choose to treat them as _id.
 * - Foreign key columns become "reference" fields.
 * - Other columns are mapped by type.
 */
export function mapToNoSql(sqlSchema: SqlSchema): NoSqlSchema {
  const collections: NoSqlCollection[] = [];

  const tables = Array.isArray(sqlSchema.tables) ? sqlSchema.tables : [];
  const foreignKeys = Array.isArray(sqlSchema.foreignKeys) ? sqlSchema.foreignKeys : [];

  const fkByTableAndColumn = new Map<string, string>();
  for (const fk of foreignKeys) {
    fkByTableAndColumn.set(`${fk.fromTable}.${fk.fromColumn}`, fk.toTable);
  }

  for (const table of tables) {
    const fields: NoSqlField[] = table.columns.map((col) => {
      const fkKey = `${table.name}.${col.name}`;
      const refCollection = fkByTableAndColumn.get(fkKey);

      if (refCollection) {
        return {
          name: col.name,
          type: "reference",
          optional: col.nullable,
          refCollection,
          description: `Reference to ${refCollection}.${findPrimaryKey(
            { tables, foreignKeys },
            refCollection,
          )}`,
        };
      }

      return {
        name: col.name,
        type: mapColumnTypeToNoSql(col.type),
        optional: col.nullable,
      };
    });

    collections.push({
      name: table.name,
      fields,
      description: `Collection derived from table ${table.name}`,
    });
  }

  return { collections };
}

function mapColumnTypeToNoSql(
  type: SqlTable["columns"][number]["type"],
): NoSqlField["type"] {
  switch (type) {
    case "integer":
    case "bigint":
    case "serial":
    case "bigserial":
    case "numeric":
      return "number";
    case "boolean":
      return "boolean";
    case "timestamp":
    case "timestamptz":
    case "date":
      return "date";
    case "json":
    case "jsonb":
      return "object";
    case "text":
    case "varchar":
    case "uuid":
      return "string";
    default:
      return "unknown";
  }
}

function findPrimaryKey(
  schema: { tables: SqlSchema["tables"]; foreignKeys: SqlSchema["foreignKeys"] },
  tableName: string,
): string | string[] {
  const table = schema.tables.find((t) => t.name === tableName);
  if (!table) return "id";
  if (!table.primaryKey.length) return "id";
  return table.primaryKey.length === 1 ? table.primaryKey[0] : table.primaryKey;
}

export function buildAnalysisResult(sqlSchema: SqlSchema): AnalysisResult {
  const normalized: SqlSchema = {
    tables: Array.isArray(sqlSchema.tables) ? sqlSchema.tables : [],
    foreignKeys: Array.isArray(sqlSchema.foreignKeys) ? sqlSchema.foreignKeys : [],
  };
  return {
    sqlSchema: normalized,
    nosqlSchema: mapToNoSql(normalized),
  };
}

