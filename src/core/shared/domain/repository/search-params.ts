export type SortDirection = 'asc' | 'desc';

export type SearchParamsConstructorProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams<Filter = string> {
  private _page: number;
  private _per_page: number;
  private _sort: string | null;
  private _sort_dir: SortDirection | null;
  private _filter: Filter | null;

  constructor(props: SearchParamsConstructorProps<Filter>) {
    this._page = props.page && props.page > 0 ? Math.floor(props.page) : 1;
    this._per_page = props.per_page && props.per_page > 0 ? Math.floor(props.per_page) : 15;
    this._sort = props.sort !== undefined && props.sort !== null ? props.sort.trim() : null;
    this._sort_dir = props.sort_dir || null;
    this._filter = props.filter ?? null;

    if (this._sort === '') {
      throw new Error('Sort field cannot be an empty string.');
    }
  }

  // Getters para acessar os valores
  get page(): number {
    return this._page;
  }

  get per_page(): number {
    return this._per_page;
  }

  get sort(): string | null {
    return this._sort;
  }

  get sort_dir(): SortDirection | null {
    return this._sort_dir;
  }

  get filter(): Filter | null {
    return this._filter;
  }
}
