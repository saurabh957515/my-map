import {
  Configure,
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  useInfiniteHits,
} from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import React from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ListTerritories = () => {
  const { showMore, results } = useInfiniteHits();
  console.log(results);
  return (
    <div className="flex items-center py-2 ">
      <div className="">
        <XMarkIcon className="h-5 w-5 " />
      </div>
      <div className="border-r px-2 text-sm font-medium text-latisSecondary-800">
        434345 records selected
      </div>
      <div className="flex items-center gap-4 pl-2">
        <div className="text-sm capitalize">New Activity</div>
        <div className="text-sm capitalize">Comms</div>
        <div className="text-sm capitalize">Re Assign</div>
        <div className="text-sm capitalize">Change Stage</div>
      </div>
      {/* {results?.hits?.length ? (
        results.hits.map(hit => (
          <div key={hit.id} className="p-2 mb-2 border rounded-lg hit-item">
            <h2 className="text-lg font-semibold">
              <Highlight attribute="name" hit={hit} />
            </h2>
            <p className="text-sm">
              <Highlight attribute="description" hit={hit} />
            </p>
            <span className="text-gray-500">ID: {hit.id}</span>
          </div>
        ))
      ) : (
        <p>No results found within the selected area.</p>
      )}
      <button onClick={showMore} className="mt-4 btn btn-primary">
        Show More
      </button> */}
    </div>
  );
};

const TerritoriesSearch = ({ dataLoading, polyGons }) => {
  console.log(Configure);
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
      const polygon = [
        [-52.93117089844555, 45.05886443274703],
        [-54.21107812500772, 29.408365694807717],
        [-52.93117089844555, 45.05886443274703],
      ];

      const latitudes = polygon.map(coord => coord[1]);
      const longitudes = polygon.map(coord => coord[0]);

      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      const geoBoundingBoxFilter = `_geoBoundingBox([${minLng}, ${minLat}], [${maxLng}, ${maxLat}])`;

      console.log(geoBoundingBoxFilter);

      try {
        body = JSON.parse(opts.body);
      } catch (error) {
        console.error('Error parsing request body:', error);
        throw new Error('Invalid request body');
      }

      if (body.queries) {
        body.queries.forEach(query => {
          query.filter = geoBoundingBoxFilter;
        });
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

  return (
    <div className="absolute bottom-1/4 left-1/3 z-50 h-fit rounded-3xl bg-white px-2">
      <InstantSearch indexName="canvas_leads" searchClient={searchClient}>
        <Configure hitsPerPage={10} />

        <ListTerritories />
      </InstantSearch>
    </div>
  );
};

export default TerritoriesSearch;
