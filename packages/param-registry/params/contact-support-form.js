Params.contactSupportForm = (val, state, done) => {
  Session.set('hideButtons', val);

  let height = $(window).height();
  let modal = $('.contact-support-modal');

  if (state.added) {
    modal.velocity({
      translateY: [0, height]
    }, {
      duration: Hoopla.velocityDuration,
      display: 'block',
      easing: "ease-in-out",
      complete: done,
    });
    formhackhide('contact-support-form');

  } else if (state.removed) {
    modal.velocity({
      translateY: [height, 0]
    }, {
      duration: Hoopla.velocityDuration,
      display: 'none',
      easing: "ease-in-out",
      complete: done,
    });

    formhackshow();

  } else { done() }
};
