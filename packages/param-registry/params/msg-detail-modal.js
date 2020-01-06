Params.EventsMessagesDetails = (val, state, done) => {
  let modal = $('#msg-detail-modal');
  let height = $(window).height();

  Session.set('msgConversationId', val);

  if (state.added) {
    modal.velocity({
      translateY: [0, height]
    }, {
      duration: Hoopla.velocityDuration,
      easing: "ease-in-out",
      display: 'block',
      complete: done,
    });

    modal.velocity({opacity: 1}, {begin (){
      Hoopla.setHeight({
        container: $(window),
        target: $('.messages-wrapper'),
        offsets: [
          $('.navbar-fixed'),
          $('.userlistContainer'),
        ],
        padding: 100 // clears the initially not rendered .add-guest-btn-wrapper-collection div
      });

      const scrollVal = document.getElementById("messages-wapper").scrollHeight;
      $("#messages-wapper").animate({ scrollTop: scrollVal }, 1000);
      
    }});
    Meteor.subscribe('guest-list',Session.get('eventId'));
    formhackhide('message-form');

  } else if (state.removed) {
    modal.velocity({
      translateY: [height, 0]
    }, {
      duration: Hoopla.velocityDuration,
      easing: "ease-in-out",
      display: 'none',
      complete: done,
    });

    formhackshow();

  } else { done() }
};
