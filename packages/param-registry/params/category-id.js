Params.categoryId = (val, state, done) => {
  Session.set('category-id', (val || null));
  done();
};
