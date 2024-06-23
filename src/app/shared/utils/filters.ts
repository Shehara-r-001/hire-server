import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

// import { fDateTime } from './datetime';
import { BadRequestException } from '@nestjs/common';

type DateField = 'createdAt' | 'updatedAt' | 'openFrom' | 'openTo';

type EntityAlias = 'user' | 'company' | 'vacancy';

type EntityKeys<T> = {
  [K in keyof T]: K;
}[keyof T];

// /**
//  * can be used to filter data by date range for the feeds
//  * @param qb the query builder
//  * @param requestedRange the date range to be filtered (comes in filters json)
//  * @param field the name of the date field in the entity
//  * @param entityAlias entity alias used for the query builder passed in
//  *
//  * @example
//  * const requestedRange = filters?.createdAt;
//     if (requestedRange) {
//       dateRangeFilter(qb, requestedRange, 'createdAt', 'post'); // filters posts on post.createdAt field
//     }
//  */
// export const dateRangeFilter = <T>(
//   qb: SelectQueryBuilder<T>,
//   requestedRange: string,
//   field: DateField,
//   entityAlias: EntityAlias
// ) => {
//   try {
//     const [from, to] = requestedRange
//       .split('~')
//       .map((date) => fDateTime(date.trim()));

//     if (from && to) {
//       qb.andWhere(`${entityAlias}.${field} BETWEEN :from AND :to`, {
//         from,
//         to,
//       });
//     } else {
//     throw new BadRequestException(`Error parsing date range`);
//     }
//   } catch (e) {
//     // console.error(e);
//     throw new BadRequestException(`Error parsing date range`);
//   }
// };

/**
 * can be used to apply search queries in the feeds
 * @param qb the query builder
 * @param alias  entity alias used for the query builder passed in
 * @param fields the fields that need to be searched on
 * @param query the query string
 * @returns
 *
 * @example
 *  if (pageRequest.query)
      applySearchQueries(qb, 'post', ['title', 'body'], pageRequest.query); // applies search on title, body fields of post entity
 */
export const applySearchQueries = <T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  alias: EntityAlias,
  fields: EntityKeys<T>[],
  query: string
): SelectQueryBuilder<T> => {
  return qb.andWhere(
    new Brackets((qb) => {
      fields.forEach((field, index) => {
        const parameterName = `search${index}`;
        if (index === 0) {
          qb.where(`${alias}.${String(field)} LIKE :${parameterName}`, {
            [parameterName]: `%${query}%`,
          });
        } else {
          qb.orWhere(`${alias}.${String(field)} LIKE :${parameterName}`, {
            [parameterName]: `%${query}%`,
          });
        }
      });
    })
  );
};
