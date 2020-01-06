Params.eventNavMain = (val, state, done) => {
  Session.set('eventNavMain', val)

  Array.from($('.event-show-swiper')).forEach(el => el.swiper.update());

  if (state.added) {
    if (PM.get('event-id')) {

      let interval = setInterval(() => {
        let swiper = $('.event-show-swiper');

        if (swiper[0] && swiper[0].swiper) {
          clearInterval(interval);
          swiper[0].swiper.slideTo(val);
          done();
        }
      }, Hoopla.defaultInterval);
    }
  }

  let eventId = Session.get('eventId');

  setTimeout(() => {
    done();
  }, 100);
};