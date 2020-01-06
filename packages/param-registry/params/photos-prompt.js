Params._generatePhotosPrompt = function (modalSelector) {
  return (val, state, done) => {
    const modal = $(modalSelector);
    const height = $(window).height();
    const {velocityDuration: duration} = Hoopla;

    if (state.added) {
      modal.velocity({
        translateY: [0, height]
      }, {
        duration,
        display: 'flex',
        easing: "ease-in-out",
        complete: done
      });

    } else if (state.removed) {
      modal.velocity(
        {
          translateY: [height, 0]
        },
        {
          duration,
          easing: "ease-in-out",
          complete (){
            $(modalSelector).css({display: 'none'});
            done();
          }
      });

    } else { done() }
  };
}
