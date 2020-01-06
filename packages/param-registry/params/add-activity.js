Params.addActivity = (val, state, done) => {
  let swiper = $('.event-form-swiper')[0].swiper;

  if (state.added) {
    Session.set('firstSlide', 'EditActivity');
    Hoopla.transforms.slideAndFade(swiper, 1, '.header-stacked.add-activity', done);

    if (! PM.get('activity-id')) {
      let eventId = PM.get('event-form-id');

      Meteor.call('Activities.createNew', eventId, (err, activityId) => {
        if (activityId) {
          PM.set('activity-id', activityId, true);

          let event = Events.findOne({_id: Session.get('eventFormId')});
          if(event.latestActivityWithFalse()) {
            let latestActivityTime = event.latestActivityWithFalse();
            let modifier = {$set: {}};
            modifier.$set['startTime'] = latestActivityTime;
            let getDataDate = event.latestActivityWithFalse();
            getDataDate.setHours(getDataDate.getHours() + 1); 
            modifier.$set['endTime'] = getDataDate; 
             
            Meteor.call('Activities.update', PM.get('activity-id'), modifier, function (e) {
              e && CrossPlatform.alert({msg: e.message.replace(' [400]','.'),title:'Error'})
            });
          }
        }
      });
    }

    formhackhide('edit-activity-form,datepicker-form');

  } else if (state.removed) {
    Hoopla.transforms.slideAndFade(swiper, 0, '.header-stacked.main', () => {
      Session.set('datetimeWarning', null);
      Session.set('locationWarning', null);
      AutoForm.resetForm('edit-activity-form');
      PM.set('activity-id', null, true);
      done();

      formhackshow();
      formhackhide('event-base-form');

    });

  } else { done() }
};
