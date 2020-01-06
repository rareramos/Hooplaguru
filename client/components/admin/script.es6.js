Template.Admin.onCreated(function(){
  this.selectedCategory = new ReactiveVar();
  this.creatingCategory = new ReactiveVar(false);
});

Template.Admin.onRendered(() => {
  $('ul.tabs').tabs();
});

Template.Admin.helpers({
  selectedCategoryDoc (){
    return CoverPhotoCategories.findOne(
      Template.instance().selectedCategory.get()
    );
  },

  creatingCategory (){
    return Template.instance().creatingCategory.get();
  },

  filename (){
    return this.filename();
  },
});

Template.Admin.events({
  'change #add-cover-photos input[type="file"]' (event){
    Cloudinary.customUpload(event.currentTarget.files, function (image) {
      CrossPlatform.alert({msg: 'Your photo id is' + image.imageId})
    })
  },

  'click .edit-category-btn' (evt, template){
    template.selectedCategory.set(this._id);
  },

  'click #add-category-btn' (evt, template){
    template.creatingCategory.set(true);
  },

  'click #new-category-cancel' (evt, template){
    AutoForm.resetForm('new-category-form');
    template.creatingCategory.set(false);
  },

  'click #update-category-cancel' (evt, template){
    template.selectedCategory.set(null);
  },
});
