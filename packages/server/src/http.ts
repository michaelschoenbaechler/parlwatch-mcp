import { Collection, fetchCollection, Vote } from 'swissparl';
import { Config, QueryOptions } from '@parlwatch/shared';
import { SwissParlEntity } from 'swissparl/dist/models';

export async function makeVotesRequest({
  top,
  skip,
  searchTerm
}: {
  top: number;
  skip?: number;
  searchTerm?: string;
}): Promise<Vote[]> {
  const filter: {
    eq: { Language: string; BusinessNumber?: number }[];
    ne: { BusinessShortNumber: string }[];
    substringOf?: { BusinessTitle: string; BusinessShortNumber: string }[];
  } = {
    eq: [{ Language: 'DE' }],
    ne: [{ BusinessShortNumber: '00.000' }]
  };

  if (searchTerm) {
    filter.substringOf = [
      {
        BusinessTitle: searchTerm,
        BusinessShortNumber: searchTerm
      }
    ];
  }

  return await fetchSwissParlEntity<Vote>('Vote', {
    top,
    skip,
    filter,
    orderby: { property: 'VoteEnd', order: 'desc' }
  });
}

export function fetchSwissParlEntity<T extends SwissParlEntity>(
  collection: keyof typeof Collection,
  options: QueryOptions<T>,
  config?: Config
): Promise<T[]> {
  return fetchCollection<T>(collection, options, config);
}
