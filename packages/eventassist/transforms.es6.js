Hoopla.transforms = {

  fadeIn (next, done){
    var headers = _.toArray($('.header-stacked'));
    var current = _.find(headers, header => {
      return $(header).css('display') === 'block';
    });

    if (current) { $(current).velocity('fadeOut') }

    $(next).velocity('fadeIn', {complete: done});
  },

  slideAndFade (swiper, slide, target, done){
    Meteor.setTimeout(() => {
      Hoopla.transforms.fadeIn(target, done);
      swiper.slideTo(slide);
    }, Hoopla.defaultInterval);
  },

  showModal (params){
    if (params.transition === 'blur') {
      $(params.blurTarget).velocity({blur: '10px'}, {complete (){
        if (params.complete) { params.complete() }
      }});
    }
  },

  hideModal (params){
    if (params.transition === 'blur') {
      $(params.blurTarget).velocity({blur: '0px'}, {complete (){
        if (params.complete) { params.complete() }
      }});
    }
  },

  toEvent (params){
    let clone = params.from[0].cloneNode(true);
    let top = params.from[0].getBoundingClientRect().top + 'px';
    let options = {duration: 400, easing: [.1, .7, .1, 1]};

    clone.setAttribute('data-clone-node', 'true');
    document.body.appendChild(clone);

    let $clone = $('[data-clone-node="true"]');

    $clone.css({width: params.width, height: params.height})
      .css({position: 'fixed', top: top, zIndex: 99999});

    $clone.find('.card-image-bg').velocity({height: '140px'}, options);

    $clone.velocity({height: '140px', top: '50px'}, {complete (){
      params.done();
    }, duration: 400, easing: [.1, .7, .1, 1]});

    let translation = `-${params.width}px`

    $('.ea_event-listing').velocity({left: 0}, options);
  },

  fromEvent (params){
    let clone = params.from[0].cloneNode(true);
    let eventCardTop = params.to[0].getBoundingClientRect().top + 'px';

    clone.setAttribute('data-clone-node', 'true');
    document.body.appendChild(clone);

    let $clone = $('[data-clone-node="true"]');

    $clone.css({width: params.width, height: params.height})
      .css({position: 'fixed', top: params.top, zIndex: 99999});

    $clone.velocity({height: '250px', top: eventCardTop}, {complete (){
      document.body.removeChild(clone);
      params.done();
    }, duration: 400, easing: [
      .1, .7, .1, 1
    ]});

    $('.ea_event-listing').velocity({left: params.width}, {duration: 400, easing: [
      .1, .7, .1, 1
    ]});
  }
};

