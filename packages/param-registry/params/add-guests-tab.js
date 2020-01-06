Params.addGuestsTab = (val, state, done) => {

	if (state.added) {
		if (val === 'from-contacts') {
	    formhackhide('all',1);
	 	}
	 	else {
	 		formhackhide('add-guest-form');
	 	}
	} else if(state.removed) {
		formhackshow();
	}
  if (val === 'from-contacts') {
    $('.guest-tabs-swiper')[0].swiper.slideTo(0);
  }

  if (val === 'add-manually') {
    $('.guest-tabs-swiper')[0].swiper.slideTo(1);
  }

  done();
};
