const Actor = require('./Actor');

describe('Actor model', () => {
  it('actor without name is invalid', () => {
    const actor = new Actor({});
    const { errors } = actor.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });
});

