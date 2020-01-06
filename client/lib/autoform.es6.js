AutoForm.setDefaultTemplate('materialize');

AutoForm.hooks({
  'user-form': {
    after: {
      'method-update' (err, result){
        //PM.set('user-form', null);
      }
    }
  },

  'update-category-form': {
    after: {
      update (err, result){
        if (result) {
          Session.set('selectedCategoryId', null);
        }
      }
    }
  },
});
