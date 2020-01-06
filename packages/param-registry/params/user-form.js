Params.userForm = (val, state, done) => {
  Session.set('hideButtons', val);

  let height = $(window).height();
  let modal = $('.user-modal');

  if (state.added) {
    modal.velocity({
      translateZ: 0,
      translateX: 0,
      translateY: [0, height]
    }, {
      duration: Hoopla.velocityDuration,
      display: 'block',
      easing: "ease-in-out",
      complete: done,
    });
    formhackhide('user-form');

  } else if (state.removed) {
    modal.velocity({
      translateZ: 0,
      translateX: 0,
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
