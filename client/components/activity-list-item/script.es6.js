Template.ActivityListItem.events({
  'click .collection-item': function(){
    PM.set('activity-id', this._id);
    PM.set('edit-activity', true, true);
  }
});

Template.ActivityListItem.helpers({

  location () {
    if (this.address) {
      return this.address.address1;
    }
  }
});
