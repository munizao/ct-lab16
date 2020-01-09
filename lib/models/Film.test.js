const Film = require('./Film');

describe('Film model', () => {
  it('film without title is invalid', () => {
    const film = new Film({});
    const { errors } = film.validateSync();
    expect(errors.title.message).toEqual('Path `title` is required.');
  });

  it('film without studio is invalid', () => {
    const film = new Film({});
    const { errors } = film.validateSync();
    expect(errors.studio.message).toEqual('Path `studio` is required.');
  });

  it('film without released is invalid', () => {
    const film = new Film({});
    const { errors } = film.validateSync();
    expect(errors.released.message).toEqual('Path `released` is required.');
  });

  it('released must be in range', () => {
    let film = new Film({ released:999 });
    let { errors } = film.validateSync();
    expect(errors.released.message).toEqual('Path `released` (999) is less than minimum allowed value (1000).');
    film = new Film({ released:10000 });
    ({ errors } = film.validateSync());
    expect(errors.released.message).toEqual('Path `released` (10000) is more than maximum allowed value (9999).');
  });
});
