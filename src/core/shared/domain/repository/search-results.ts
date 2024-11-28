export type SearchResultConstructorProps<E> = {
  items: E[];
  total: number;
  current_page: number;
  per_page: number;
};

export class SearchResult<E> {
  private readonly _items: E[];
  private readonly _total: number;
  private readonly _current_page: number;
  private readonly _per_page: number;

  constructor(props: SearchResultConstructorProps<E>) {
    this._items = props.items;
    this._total = props.total;
    this._current_page = props.current_page;
    this._per_page = props.per_page;

    this.validate();
  }

  private validate(): void {
    if (!Array.isArray(this._items)) {
      throw new Error("Items must be an array.");
    }

    if (typeof this._total !== "number" || this._total < 0) {
      throw new Error("Total must be a non-negative number.");
    }

    if (typeof this._current_page !== "number" || this._current_page <= 0) {
      throw new Error("Current page must be a positive number.");
    }

    if (typeof this._per_page !== "number" || this._per_page <= 0) {
      throw new Error("Per page must be a positive number.");
    }
  }

  get items(): E[] {
    return this._items;
  }

  get total(): number {
    return this._total;
  }

  get current_page(): number {
    return this._current_page;
  }

  get per_page(): number {
    return this._per_page;
  }

  get last_page(): number {
    return Math.ceil(this._total / this._per_page);
  }
}
