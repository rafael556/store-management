import { SearchParams } from "../search-params";

describe('SearchParams', () => {
  it('should set default values when no properties are provided', () => {
    const params = new SearchParams({});
    expect(params.page).toBe(1);
    expect(params.per_page).toBe(15);
    expect(params.sort).toBeNull();
    expect(params.sort_dir).toBeNull();
    expect(params.filter).toBeNull();
  });

  it('should accept valid values for all properties', () => {
    const params = new SearchParams({
      page: 2,
      per_page: 20,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'test',
    });

    expect(params.page).toBe(2);
    expect(params.per_page).toBe(20);
    expect(params.sort).toBe('name');
    expect(params.sort_dir).toBe('asc');
    expect(params.filter).toBe('test');
  });

  it('should throw an error if sort is an empty string', () => {
    expect(() => new SearchParams({ sort: '' })).toThrow(
      'Sort field cannot be an empty string.'
    );
  });

  it('should handle undefined or null sort gracefully', () => {
    const params = new SearchParams({ sort: undefined });
    expect(params.sort).toBeNull();

    const paramsNull = new SearchParams({ sort: null });
    expect(paramsNull.sort).toBeNull();
  });

  it('should trim sort field if it has extra spaces', () => {
    const params = new SearchParams({ sort: '   name   ' });
    expect(params.sort).toBe('name');
  });

  it('should accept valid sort_dir values', () => {
    const paramsAsc = new SearchParams({ sort_dir: 'asc' });
    expect(paramsAsc.sort_dir).toBe('asc');

    const paramsDesc = new SearchParams({ sort_dir: 'desc' });
    expect(paramsDesc.sort_dir).toBe('desc');
  });

  it('should handle undefined or null sort_dir gracefully', () => {
    const params = new SearchParams({ sort_dir: undefined });
    expect(params.sort_dir).toBeNull();

    const paramsNull = new SearchParams({ sort_dir: null });
    expect(paramsNull.sort_dir).toBeNull();
  });

  it('should handle null or undefined filter gracefully', () => {
    const params = new SearchParams({ filter: null });
    expect(params.filter).toBeNull();

    const paramsUndefined = new SearchParams({});
    expect(paramsUndefined.filter).toBeNull();
  });

  it('should trim sort field if it has extra spaces', () => {
    const params = new SearchParams({ sort: '   name   ' });
    expect(params.sort).toBe('name');
  });

  it('should round down page and per_page if they are floating-point numbers', () => {
    const params = new SearchParams({ page: 2.7, per_page: 10.9 });
    expect(params.page).toBe(2);
    expect(params.per_page).toBe(10);
  });
});
