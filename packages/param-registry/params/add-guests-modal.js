Params.addGuestsModal = (val, state, done) => {
  let modal = $('#add-guests-modal');

  if (state.added) {
    modal.velocity({opacity: 1}, {begin (){
      Hoopla.setHeight({
        container: $(window),
        target: $('.add-manually-slide'),
        offsets: [
          $('#add-guest-fixed-header'),
          $('.guests-tabs-row')
        ],
        padding: 80 // clears the initially not rendered .add-guest-btn-wrapper-collection div
      });

      Hoopla.setHeight({
        container: $(window),
        target: $('.contacts-collection'),
        offsets: [
          $('#add-guest-fixed-header'),
          $('.guests-tabs-row'),
        ],
          // clears the initially not rendered .add-guest-btn-wrapper-collection
          // and .location-serach-container divs
        padding: 130
      });

      modal.css({zIndex: 1});

      if (Meteor.isCordova) {
        if (! PM.get('add-guests-tab') && ! PM.get('guest-id')) {
          PM.set('add-guests-tab', Session.get('addGuestsTab'), true);
        }
      } else {
        if (! PM.get('add-guests-tab') && ! PM.get('guest-id')) {
          PM.set('add-guests-tab', true);
        }
      }

      if (! PM.get('guest-id') && Session.get('addGuestsTab') == 'from-contacts') {
        //PersonalContacts.init();
      }
      done();

    }, complete (){
        // workaround for strange bug that disables scroll after visiting
        // add guests modal from more than one event on mobile
      $('.guest-swiper-slide').css('overflow-y', 'initial');
      Meteor.setTimeout(() => {
        $('.guest-swiper-slide').css('overflow-y', 'auto');
      }, 1);
    }});

  } else if (state.removed) {
    modal.velocity({opacity: 0}, {complete (){
      PM.set('add-guests-tab', null, true);
      modal.css({zIndex: -100});

      if (Session.get('guestId')) {
        PM.set('guest-id', null, true);
      }

      if (PM.get('guest-id')) {
        PM.set('guest-id', null, true)
      }

      $('.short-slide').css('overflow-y', 'initial');
      Meteor.setTimeout(() => {
        $('.short-slide').css('overflow-y', 'auto');
      });

      done();
    }});

  } else { done() }
};
