const Reviewer = require('./Reviewer');

describe('Reviewer model', () => {
  it('reviewer without name is invalid', () => {
    const reviewer = new Reviewer({});
    const { errors } = reviewer.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('reviewer without company is invalid', () => {
    const reviewer = new Reviewer({});
    const { errors } = reviewer.validateSync();
    expect(errors.company.message).toEqual('Path `company` is required.');
  });
});
