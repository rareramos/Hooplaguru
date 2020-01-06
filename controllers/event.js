EventController = ApplicationController.extend({
  loadingTemplate: 'Loading',

  waitOn (){
    let {groupCode} = this.params;

    return [
      Meteor.subscribe('event', groupCode),
    ];
  },

  data (){
    let {groupCode: code} = this.params;
    let group = Groups.findOne({code});

    if (group) {
      return {
        event: Events.findOne({_id: group.eventId}),
        group,
      };
    }
  },
});
