Params.photoId = (val, state, done) => {
  if (state.added) {
    Session.set('photo-id', val);

    $('.full-photo-background').velocity(
      {opacity: 1}, {display: 'block',easing: "ease-in-out", complete: done}
    );

  } else if (state.removed) {
    $('.full-photo-background').velocity(
      {opacity: 0}, {display: 'none',easing: "ease-in-out", complete: done}
    );

  } else { done() }
};
