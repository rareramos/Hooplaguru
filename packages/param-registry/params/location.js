Params.location = (val, state, done) => {
  let swiper = $('.event-form-swiper')[0].swiper;

  if (state.added) {
    Session.set('secondSlide', 'Location');
    Hoopla.transforms.slideAndFade(swiper, 2, '.header-stacked.location', done);

    formhackhide('all');

  } else if (state.removed) {
    if (PM.get('edit-activity')) {
      Hoopla.transforms.slideAndFade(swiper, 1, '.header-stacked.edit-activity', function(){
        Session.set('secondSlide', null);
        done()
      });
    } else {
      Hoopla.transforms.slideAndFade(swiper, 1, '.header-stacked.add-activity', function(){
        Session.set('secondSlide', null);
        done()
      });
    }

    formhackshow();
    formhackhide('edit-activity-form,datepicker-form');

  } else { done() }
};
