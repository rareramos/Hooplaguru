Params.eventAddMedia = (val, state, done) => {
  let modal = $('#add-photo-popup');
  let height = $(window).height();

  if (state.added) {
    modal.velocity({
      translateY: [0, height]
    }, {
      duration: Hoopla.velocityDuration,
      display: 'block',
      easing: "ease-in-out",
      complete: done,
    });

    modal.velocity({opacity: 1}, {begin (){
      Hoopla.setHeight({
        container: $(window),
        target: $('.addUserList'),
        offsets: [
          $('.navbar-fixed'),
        ],
        padding: 85 // clears the initially not rendered .add-guest-btn-wrapper-collection div
      });

      const scrollVal = document.getElementById("messages-wapper").scrollHeight;
      $("#messages-wapper").animate({ scrollTop: scrollVal }, 1000);

    }});

  } else if (state.removed) {
    modal.velocity({
      translateY: [height, 0]
    }, {
      duration: Hoopla.velocityDuration,
      easing: "ease-in-out",
      display: 'none',
      complete: done,
    });

  } else { done() }
};
