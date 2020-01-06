EventsController = ApplicationController.extend({
  loadingTemplate: 'Loading',

  onRun (){
    Session.set('startingOverlayTemplate', true);
    Session.set('overlayTemplate', 'Loading')

    const loginToken = PM.get('login-token')
    const router = this

    if (loginToken) {
      PM.set('login-token', null)

      Meteor.loginWithToken(loginToken, function(err){ 
        if (err) {
          Session.set('overlayTemplate', null)
          CrossPlatform.alert({msg: 'Token not valid. Please sign in.'})
          Router.go('/')
        } else {
          Session.set('overlayTemplate', null)
          router.render('Events')
        }
      })

      this.render('Loading')

    } else {
      Session.set('overlayTemplate', null);
      this.next()
    }
  },

  onBeforeAction (){
    if (! Meteor.userId()) {
      Router.go('/');

    } else {
      this.next();
    }
  },

  waitOn (){
    let userId = Meteor.userId();
    return [
      Meteor.subscribe('events', userId,{
        onReady: function () {  }
      }),
    ];
  },

  data (){
    let slide = PM.get('event-nav') || 0;

    return {
      swiper: {
        main: {
          initialSlide: 0,
          touchRatio: 0,
        },
        eventForm: {
          touchRatio: 0,
          preloadImages: false,
          lazyLoading: true,
        },
        eventNav: {
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          initialSlide: slide,
          spaceBetween: 0,
          centeredSlides: true,
          slidesPerView: 3,
          centeredSlides: true,
          slideToClickedSlide: true,
          slidesPerView: 'auto',
          onTransitionEnd (e){
            PM.set('event-nav', e.activeIndex.toString());
            
            if(e.activeIndex.toString() == 0) {
              $(".event-back-btn").css('z-index','2');
            } else {
              $(".event-back-btn").css('z-index','1');
            }
          },
        },
        eventSlides: {
          initialSlide: slide,
          threshold: 10,
          preloadImages: false,
          lazyLoading: true,
          onTransitionEnd (e){
            PM.set('event-nav', e.activeIndex.toString());
          },
        },
      }
    };
  }
});
