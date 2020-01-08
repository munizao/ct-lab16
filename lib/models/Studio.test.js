const Studio = require('./Studio');

describe('Studio model', () => {
  it('studio without name is invalid', () => {
    const studio = new Studio({});
    const { errors } = studio.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });
});
