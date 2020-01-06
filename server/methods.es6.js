Meteor.methods({
  createUserViaEmail (newUser){
    let userId = Accounts.createUser(newUser);

    if (userId) {
      let user = Meteor.users.findOne({_id: userId});

      return Meteor.call('Server.Emails.sendLogin', user, newUser.email);
    }
  },

  updateUser (modifier, userId){
    Meteor.users.update({_id: userId}, modifier);
  },

  serverConsole (context){
    this.unblock();
    console.log(context);
  },

  processSMSLogin (userId, phone, context){
    check(userId, String);
    check(phone, String);

    return Accounts.sendPhoneVerificationCode(userId, phone, context);
  },

  findUser (query){
    check(query, Object);
    return Meteor.users.findOne(query);
  },

  welcomeWallPost (eventId){
    check(eventId, String);
  
    HooplaBot.chat(Posts, {chatAs: 'userId',
      message: {
        eventId: eventId,
        createdAt: new Date(),
        body: TAPi18n.__('wall.event_boat')
      }
    });
  },

  sendPreviewInvite (email, eventId, user){
    check(email, String);
    check(eventId, String);
    
    let event = Events.findOne(eventId);
    let schedule = event.schedule().fetch();
    let formatEmailTime = event.formatEmailTime();
    let hostName = event.hostName();

    let logo = Meteor.settings.public.logo;
    let appStoreBadge = Meteor.settings.public.appStoreBadge;
    let googlePlayBadge = Meteor.settings.public.googlePlayBadge;

    let image = Cloudinary._helpers.url(event.coverPhotoId, {})
    let eventTitle = event.title;
    let eventDescription = event.description;
    let locationName = schedule[0].address.locationName;
    let fullAddress = schedule[0].address.address1;
    let addressArray = fullAddress.split(',');
    let addressPart3 = addressArray.length > 3 ? addressArray.pop() : ''
    let addressPart1 = addressArray.shift();
    let addressPart2 = addressArray.join(',');

    let mandrillRequest = {
      template_name: 'event-invite',
      template_content: [
        {
            name: 'body',
            content: ''
        }
      ],
      message: {
          subject: `Preview: You've been invited to ${event.title}.`,
          from_email: Hoopla.email.from,
          to: [
              { email: email }
          ],
          global_merge_vars: [
              {
                  name: 'image',
                  content: image
              },

              {
                  name: 'eventTitle',
                  content: eventTitle
              },

              {
                  name: 'eventDescription',
                  content: eventDescription
              },

              {
                  name: 'hostName',
                  content: hostName
              },

              {
                  name: 'eventTime',
                  content: formatEmailTime
              },

              {
                  name: 'locationName',
                  content: locationName
              },

              {
                  name: 'addressPart1',
                  content: addressPart1
              },

              {
                  name: 'addressPart2',
                  content: addressPart2
              },

              {
                  name: 'addressPart3',
                  content: addressPart3
              },

              {
                  name: 'eventLink',
                  content: ''
              },

              {
                  name: 'yesLink',
                  content: ''
              },

              {
                  name: 'noLink',
                  content: ''
              },

              {
                  name: 'logo',
                  content: logo
              },

              {
                  name: 'appStoreBadge',
                  content: appStoreBadge
              },

              {
                  name: 'googlePlayBadge',
                  content: googlePlayBadge
              }
          ],
      }
    }

    Mandrill.messages.sendTemplate(mandrillRequest, (err, res) => {
      return res;
    });
  },

  tryBotChatRsvp (message, guest, options){
    check(message, Object);
    check(guest, Object);
    check(options, Match.Optional(Object));

    var options = options || {};
    var guestUpdate = {$set: {previousYes: true}};
    var post;

    if (this.userId) {
      if (options.promptName) {
        guestUpdate['$set'].promptName = true;
        message.promptedGuest = guest._id;
      }

      post = Posts.findOne({
        userId: Hoopla.bot.defaultName,
        event: message.event,
        body: {$in: [
          Hoopla.bot.hostPrompt, Hoopla.bot.guestYesPrompt, Hoopla.bot.guestNoPrompt
        ]},
        promptedGuest: guest._id
      });

      if (! post) {
        HooplaBot.chat(Posts, {chatAs: 'userId',
                   message: message
        });

        Invites.update({_id: guest._id}, guestUpdate);
      }

    } else {
      throw new Meteor.Error('not authorized');
    }
  },

  removeLike (likeId){
    Likes.remove({_id: likeId});
  },

  insertLike (like){
    check(like, Object);
    Likes.insert(like);
  },

  duplicateEvent (eventId, eventName){
    eventsData = Events.findOne({_id:eventId});
    eventsData._id = "";
    eventsData.title = eventName;
    newId = Events.insert(eventsData);

    activitiesList = Activities.find({eventId:eventId}).fetch();

    for(i=0;i<activitiesList.length;i++){
      delete activitiesList[i]["_id"];
      activitiesList[i]["eventId"] = newId;
      Activities.insert(activitiesList[i]);
    }

    return newId;
  },

  createZendeskTicket (name, email, subject, message){

    var requester = {   
        name: name,
        email: email
    }; 

    var createTicketRequest = {
        ticket: { 
            subject: subject,
            comment: {
                body: message
            },
            type: 'task',
            priority: 'urgent',
            tags: [],
            requester: requester
        }
    };

    var zendesk = Zendesk();
    zendesk.tickets.create(createTicketRequest);
    return true;
  },

  getCurrentCoutryCallingCode(country){
      
    let countryData = SuxezCountries.findOne({cn_iso_2:country});
    if(countryData) {
      return countryData;
    }
    return '';
  },

  updateEventAsDraft(eventId){
    
    Events.update({_id: eventId}, {
      $set: {saveAsDraft: false}
    });
  },

  createdEventDeepLinkForCalendar(eventId){
    
    const loginToken = Accounts._generateStampedLoginToken();
    Accounts._insertLoginToken(Meteor.userId(), loginToken);
    const linkPathCal = `events?event-nav=0&event-id=${eventId}&login-token=${loginToken.token}`
    const inviteLinkCal = DeepLinks.createLink({
      feature: 'host announcement',
      channel: 'sms',
      data: {
        '$deeplink_path': linkPathCal,
        //'$fallback_url': Meteor.absoluteUrl(linkPathCal),
        '$og_title': Meteor.settings.public.APP_NAME,
        '$og_image_url': Meteor.settings.public.iconUrl,
        '$desktop_url': Meteor.absoluteUrl(linkPathCal),
        '$ios_url': Meteor.absoluteUrl(linkPathCal),
        '$ios_has_app_url': Meteor.absoluteUrl(linkPathCal),
        '$android_url': Meteor.absoluteUrl(linkPathCal)
      }
    });
    return inviteLinkCal;
  },

  syncCountryDatabase(){
    
    let countryData = SuxezCountries.find().fetch();
    if(countryData) {
      var ins = 0;
      var upd = 0;
      countryData.forEach(item => 
      {
        let cdata = {
          cn_address_format: item.cn_address_format, 
          cn_capital: item.cn_capital, 
          cn_currency_iso_3: item.cn_currency_iso_3, 
          cn_currency_uid: item.cn_currency_uid, 
          cn_iso_2: item.cn_iso_2, 
          cn_iso_3: item.cn_iso_3, 
          cn_iso_nr: item.cn_iso_nr,
          cn_official_name_en: item.cn_official_name_en,
          cn_official_name_local: item.cn_official_name_local,
          cn_phone: item.cn_phone,
          cn_short_en: item.cn_short_en,
          cn_short_local: item.cn_short_local,
          cn_tldomain: item.cn_tldomain,
          cn_zone_flag: item.cn_zone_flag,
          pid: item.pid,
          uid: item.uid
        };
        
        let existing = Countries.findOne({'uid': Number(item.uid)});
        if(existing) {
          Countries.update({uid: Number(item.uid)}, {$set: cdata});
          upd++;
        } else {
          Countries.insert(cdata);
          ins++;
        }
      }); 
      //Countries.remove({uid:1});
      return 'Sync Successfully.'+ins+' records inserted and '+upd+' records updated.';
    }
  },

});
