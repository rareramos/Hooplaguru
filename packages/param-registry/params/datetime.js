Params.datetime = (val, state, done) => {
  let swiper = $('.event-form-swiper')[0].swiper;

  if (state.added) {
    Session.set('secondSlide', 'DateAndTime');
    Hoopla.transforms.slideAndFade(swiper, 2, '.header-stacked.date-and-time', () => {
      $('select').material_select();
      done();
    });

  } else if (state.removed) {
    if (PM.get('edit-activity')) {
      Hoopla.transforms.slideAndFade(swiper, 1, '.header-stacked.edit-activity', done);

    } else {
      Hoopla.transforms.slideAndFade(swiper, 1, '.header-stacked.add-activity', done);
    }

  } else { done() }
};
