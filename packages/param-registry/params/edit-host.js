Params.editHost = (val, state, done) => {
  let swiper = $('.event-form-swiper')[0].swiper;

  if (state.added) {
    Session.set('firstSlide', 'EditHost');
    Hoopla.transforms.slideAndFade(swiper, 1, '.header-stacked.edit-host', done);

  } else if (state.removed) {
    Hoopla.transforms.slideAndFade(swiper, 0, '.header-stacked.main', () => {
      Session.set('firstSlide', null);
      PM.set('host-invite-id', null, true);
      AutoForm.resetForm('host-update-form');
      done();
    });

  } else { done() }
};
