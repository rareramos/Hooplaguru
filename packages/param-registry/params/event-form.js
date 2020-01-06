Params.eventForm = (val, state, done) => {
  Session.set('hideButtons', val);

  let modal = $('.event-modal');
  let height = $(window).height();

  if (state.added) {
    modal.velocity({
      translateY: [0, height]
    }, {
      duration: Hoopla.velocityDuration,
      display: 'block',
      easing: "ease-in-out",
      complete () {
        Array.from($('.event-form-swiper')).forEach(el => el.swiper.update());

        if (! PM.get('event-form-id')) {
          Meteor.call('Events.createNew', (err, eventId) => {
            PM.set('event-form-id', eventId, true);
            Meteor.subscribe('guest-list', eventId);
            done();
          });

        } else {
          Meteor.subscribe('guest-list', PM.get('event-form-id'));
          done()
        }
      }
    });

    formhackhide('event-base-form');

  } else if (state.removed) {
    modal.velocity({
      translateY: [height, 0]
    }, {
      duration: Hoopla.velocityDuration,
      easing: "ease-in-out",
      display: 'none',
      complete (){
        PM.set('event-form-id', null, true);
        AutoForm.resetForm('event-base-form');
        done();
      }
    });

    formhackshow();

  } else { done() }
};
