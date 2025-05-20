import { Op, OrderItem } from 'sequelize';
import { databaseConstants } from '../../constants/database.constants';

/** Create a search condition clause */
export function buildSearchClause(
  search: string,
  searchColumns: string[]
): Record<string, any> {
  if (!search) return {};

  const likeOp = databaseConstants.connection === 'postgres' ? Op.iLike : Op.like;

  const searchConditions = searchColumns.map((column) => {
    return { [column]: { [likeOp]: `%${search}%` } };
  });

  return { [Op.or]: searchConditions };
}

/** Build filter condition clause */
export function buildFilterClause(
  filter: Record<string, string> = {},
  relationMap: Record<string, string> = {}
): Record<string, any> {
  const clause: Record<string, any> = {};
  const likeOp = databaseConstants.connection === 'postgres' ? Op.iLike : Op.like;

  for (const [key, value] of Object.entries(filter)) {
    const fieldKey = relationMap[key] || key;
    clause[fieldKey] = { [likeOp]: `%${value}%` };
  }

  return clause;
}

/** Build tags clause */
export function buildTagsClause(tags?: string[]): Record<string, any> {
  if (!tags || tags.length === 0) return {};
  return {
    tags: {
      [Op.in]: tags,
    },
  };
}

/** Build ORDER clause from config */
export function buildSortClause(
  sortKey: string | undefined,
  sortOrder: 'asc' | 'desc' | undefined,
  config: Record<string, OrderItem>
): OrderItem[] {
  const key = sortKey ?? 'created';
  const order = sortOrder ?? 'desc';
  const resolved = config[key];

  return resolved ? [[resolved[0], order]] : [['created_at', 'desc']];
}

/** Merge multiple WHERE clauses */
export function combineWhereClauses(...clauses: Record<string, any>[]): Record<string, any> {
  return clauses.reduce((acc, clause) => ({ ...acc, ...clause }), {});
}