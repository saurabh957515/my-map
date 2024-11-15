import Filter from '@/Components/Filter';

export default function Header({
  children,
  filters,
  sortBy,
  checkIsFilterAvailable,
  request,
}) {
  return filters ? (
    <Filter
      textFilters={filters.text}
      dateRangeFilters={filters.daterange}
      filterData={{
        sortOptions: sortBy ?? [],
        filters: filters.select ?? [],
      }}
      request={request}
      checkIsFilterAvailable={checkIsFilterAvailable}
    >
      {children}
    </Filter>
  ) : (
    <header className="flex flex-row flex-wrap items-center justify-end border-b border-mlmgray-400 px-8 py-4">
      <div>{children}</div>
    </header>
  );
}
