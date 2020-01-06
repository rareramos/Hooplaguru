Params.editActivity = (val, state, done) => {
  let swiper = $('.event-form-swiper')[0].swiper;

  if (state.added) {
    Session.set('firstSlide', 'EditActivity');
    Session.set('editMode', true);

    Hoopla.transforms.slideAndFade(swiper, 1, '.header-stacked.edit-activity', () =>{
      Hoopla.autoResizeTextArea($('.ea-textarea'));
      done();
    });

    formhackhide('edit-activity-form,datepicker-form');

  } else if (state.removed) {
    Hoopla.transforms.slideAndFade(swiper, 0, '.header-stacked.main', () => {
      Session.set('editMode', null);
      Session.set('firstSlide', null);
      Session.set('datetimeWarning', null);
      Session.set('locationWarning', null);

      AutoForm.resetForm('edit-activity-form');
      PM.set('activity-id', null, true);
      done();
    });

    formhackshow();
    formhackhide('event-base-form');

  } else { done() }
};
