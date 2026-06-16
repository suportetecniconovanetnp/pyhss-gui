type PaginatedLoader<T> = (params: { page: number; pageSize: number }) => Promise<{ data: T[] }>;

const DEFAULT_PAGE_SIZE = 200;

const fetchAllPages = async <T>(
  loader: PaginatedLoader<T>,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<T[]> => {
  const items: T[] = [];
  let page = 0;

  while (true) {
    const response = await loader({page, pageSize});
    const currentItems = response.data;
    items.push(...currentItems);

    if (currentItems.length < pageSize) {
      break;
    }

    page += 1;
  }

  return items;
};

export default fetchAllPages;
