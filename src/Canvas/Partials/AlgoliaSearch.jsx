import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import React, { useEffect } from 'react';
import { InstantSearch, useRefinementList } from 'react-instantsearch';

const AlgoliaSearch = ({
  boundingBox,
  children,
  dataLoading,
  isSearchOn,
  setIsSearchOn,
  setSearchQuery,
  setIsLeadAdded,
  isLeadAdded,
}) => {
  const { searchClient } = instantMeiliSearch('/meilisearch-proxy', '', {
    primaryKey: 'id',

    httpClient: async (url, opts) => {
      if (dataLoading) {
        return { results: [{ hits: [] }] };
      }
      let body;
      try {
        body = JSON.parse(opts.body);
      } catch (error) {
        console.error('Error parsing request body:', error);
        throw new Error('Invalid request body');
      }
      const { minLat, maxLat, minLon, maxLon } = boundingBox;
      const geoBoundingBoxFilter = `_geoBoundingBox([${maxLat},${maxLon}], [${minLat},${minLon}])`;
      if (body.queries) {
        body.queries.forEach(function (query, i) {
          query.filter = query.filters
            ? `${geoBoundingBoxFilter} AND ${query.filters}`
            : geoBoundingBoxFilter;
          // switch (searchOption) {
          //   case 'Recently Update':
          //     body.queries[i].attributesToSearchOn = ['updated_at'];
          //     break;
          //   case 'Recently Created':
          //     body.queries[i].attributesToSearchOn = ['created_at'];
          //     break;
          // }
          // query.facets = ['stage_name'];
          // if (active) {
          //   switch (active) {
          //     // case 1:
          //     //   if (!isEmpty(myLastEditedProposalIds)) {
          //     //     body.queries[i].filter = [
          //     //       [`id IN [${myLastEditedProposalIds.join(', ')}]`],
          //     //     ];
          //     //     body.queries[i]['sort'] = ['updated_at:desc'];
          //     //   }
          //     //   break;
          //     case 3:
          //       body.queries[i]['sort'] = ['created_at:desc'];
          //       break;
          //     default:
          //       body.queries[i]['sort'] = ['date:desc'];
          //   }
          // }
        });

        opts.body = JSON.stringify(body);
      }
      opts.body = JSON.stringify(body);
      const response = await axios.post('/meilisearch-proxy', opts.body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    },
  });

  function onSearchChange(value) {
    if (!value && isSearchOn) {
      setIsSearchOn(false);
      setSearchQuery('');
    } else if (!isSearchOn && value) {
      setIsSearchOn(true);
      setSearchQuery(value);
    }
  }
  const onStateChange = ({ uiState, setUiState }) => {
    setUiState(uiState);
    onSearchChange(uiState?.canvas_leads?.query);
  };
  return (
    <InstantSearch
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      onStateChange={onStateChange}
      indexName="canvas_leads"
      searchClient={searchClient}
    >
      {children}
    </InstantSearch>
  );
};

export default AlgoliaSearch;
