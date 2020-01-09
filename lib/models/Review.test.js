const Review = require('./Review');

describe('Review model', () => {
  it('review without rating is invalid', () => {
    const review = new Review({});
    const { errors } = review.validateSync();
    expect(errors.rating.message).toEqual('Path `rating` is required.');
  });

  it('review without reviewer is invalid', () => {
    const review = new Review({});
    const { errors } = review.validateSync();
    expect(errors.reviewer.message).toEqual('Path `reviewer` is required.');
  });

  it('review without review is invalid', () => {
    const review = new Review({});
    const { errors } = review.validateSync();
    expect(errors.review.message).toEqual('Path `review` is required.');
  });

  it('review without film is invalid', () => {
    const review = new Review({});
    const { errors } = review.validateSync();
    expect(errors.film.message).toEqual('Path `film` is required.');
  });

  it('review with review longer than 140 characters is invalid', () => {
    const text = 'a'.repeat(141);
    const review = new Review({ review: text });
    const { errors } = review.validateSync();
    expect(errors.review.message).toEqual(`Path \`review\` (\`${text}\`) is longer than the maximum allowed length (140).`);
  });
});
