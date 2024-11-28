import { SearchResult } from "../search-results";

describe("SearchResult", () => {
  it("should create a SearchResult instance with valid data", () => {
    const result = new SearchResult({
      items: [1, 2, 3],
      total: 10,
      current_page: 1,
      per_page: 5,
    });

    expect(result.items).toEqual([1, 2, 3]);
    expect(result.total).toBe(10);
    expect(result.current_page).toBe(1);
    expect(result.per_page).toBe(5);
    expect(result.last_page).toBe(2);
  });

  it("should throw an error if items is not an array", () => {
    expect(
      () =>
        new SearchResult({
          items: null as any,
          total: 10,
          current_page: 1,
          per_page: 5,
        })
    ).toThrow("Items must be an array.");
  });

  it("should throw an error if total is negative", () => {
    expect(
      () =>
        new SearchResult({
          items: [],
          total: -1,
          current_page: 1,
          per_page: 5,
        })
    ).toThrow("Total must be a non-negative number.");
  });

  it("should throw an error if current_page is not positive", () => {
    expect(
      () =>
        new SearchResult({
          items: [],
          total: 10,
          current_page: 0,
          per_page: 5,
        })
    ).toThrow("Current page must be a positive number.");
  });

  it("should throw an error if per_page is not positive", () => {
    expect(
      () =>
        new SearchResult({
          items: [],
          total: 10,
          current_page: 1,
          per_page: 0,
        })
    ).toThrow("Per page must be a positive number.");
  });

  it("should calculate last_page dynamically", () => {
    const result = new SearchResult({
      items: [],
      total: 23,
      current_page: 1,
      per_page: 10,
    });

    expect(result.last_page).toBe(3); // total: 23, per_page: 10
  });
});
