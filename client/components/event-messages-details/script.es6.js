Template.EventsMessagesDetails.helpers({
	msghirarchy() {
		conversation = Messages.find({conversationId: Session.get('msgConversationId')});
		return conversation;
	},

	postedByMe() {
		let user = Invites.findOne({_id: this.fromUser});
		if(user && user.userId == Meteor.userId()) {
			className =  'bubble bubble--alt';
		} else {
			className = 'bubble';
		}
		return className;
	},

	checkPost() {
		let user = Invites.findOne({_id: this.fromUser});
		return (user && user.userId) != Meteor.userId() ? true : false;
	},

	sender() {
		let user = Invites.findOne({_id: this.fromUser});
		return user ? user.firstName + " "+ user.lastName : "";
	},

	userLists() {
		let msgs =  Messages.findOne({conversationId: Session.get('msgConversationId')});
		
		if(!msgs) {
			return "";
		}
		let userNames = msgs.toUser.map(toUser => {
			user = Invites.findOne({userId: Meteor.userId(), eventId: Session.get('eventId')});

			if(user && toUser == user._id) {
				returnVal = "Me";
			} else {
				user = Invites.findOne({_id: toUser})
				if(!user) {
					returnVal = "";
				} else {
					returnVal = user.firstName + " "+ user.lastName;
				}
			}
			return returnVal;
		});
		let user = Invites.findOne({_id: msgs.fromUser});
		if(user && user.userId == Meteor.userId()) {
			userNames.push("Me");
		} else {
			if(user) {
				userNames.push(user.firstName + " "+ user.lastName);
			}
		}
		
		userNames = _.uniq(userNames);
		returnVal = userNames.join(", ");

		return returnVal;
	},

	oldConvo() {
		return Session.get('msgConversationId') != 'false';
	},

	newUserList() {

		if(Session.get('msg-to-ids')) {
			let userList = Session.get('msg-to-ids');

			if(userList.indexOf('yes') >= 0) {
				userList = getUserList(userList,'yes','attending');
			}

			if(userList.indexOf('no') >= 0) {
				userList = getUserList(userList,'no','not attending');
			}

			if(userList.indexOf('norply') >= 0) {
				userList = getUserList(userList,'norply','no reply');
			}

			userList = _.uniq(userList);

			let touserList = [];
			let userNames = userList.map(toUser => {
				let user = Invites.findOne({_id: toUser});

				touserList.push(user._id);

				if(!user) {
					returnVal = "";
				} else {
					returnVal = user.firstName + " "+ user.lastName;
				}

				return returnVal;
			});

			Session.set("touserlist", touserList);

			userNames.push("Me");

			returnVal = userNames.join(", ");
			return returnVal;
		}
	},
	allowsend() {
		return (Session.get('msgConversationId') != 'false' || Session.get("touserlist")) && Session.get('msgCount') > 0;
	},
	timeAgoPosted (){
	  return moment(this.createdAt).fromNow();
	},
	messageTitle(){
	  return TAPi18n.__('message.message_list');
	}
});

Template.EventsMessagesDetails.events({
	'click .left-header' (){
		PM.set('msg-detail-modal', null);
	},

	'click .post-form-submit' (evt, template){

		const textarea = $('#message-field');

		let user = Invites.findOne({userId: Meteor.userId(), eventId: Session.get('eventId')});

		if(Session.get('msgConversationId') != "false") {
			let msgData = Messages.findOne({conversationId: Session.get('msgConversationId')},{sort:{CreatedAt: -1}});
			
	    	let toUser = _.difference(msgData.toUser, [user._id]);
	    	toUser.push(msgData.fromUser);
			Meteor.call('Server.Messages.insert', {eventId: msgData.eventId, fromUser: user._id, toUser: _.uniq(toUser), message: textarea.val(), readStatus: [Meteor.userId()], parentMsgId: msgData._id, conversationId: msgData.conversationId});
			
		} else {
			const conversationId = Meteor.uuid();
			Session.set('msgConversationId',conversationId);
			Meteor.call('Server.Messages.insert', {eventId: Session.get('eventId'), fromUser: user._id, toUser: Session.get("touserlist"), message: textarea.val(), readStatus: [Meteor.userId()], parentMsgId: '0', conversationId: conversationId});

		}

		textarea.val('');
		Session.set('msgCount', 0);
    	textarea.focus();

		const scrollVal = document.getElementById("messages-wapper").scrollHeight;
		$("#messages-wapper").velocity({ scrollTop: scrollVal }, 1000);
		PM.set('msg-detail-modal', null);
	},

	'click .userlistContainer' (){
		if(Session.get('msgConversationId') == 'false' && Meteor.user().isHost(Session.get('eventId')))
		{
			loadingtext($('#add-msg-btn'));
			PM.set('msg-add-modal', true);
		}
	},

	'keyup #message-field' (evt, template){
		Session.set('msgCount', evt.target.value.length);
	}
});

var getUserList = function(userList,status,inviteStatus) {
    
    userList.splice(userList.indexOf(status), 1);
		let arr = Invites.find({eventId: Session.get('eventId'),inviteStatus: inviteStatus,userId:{$ne: Meteor.userId()}},{fields:{_id: 1}}).fetch();

		ids = [];
		arr.map(a => {
			ids.push(a._id);
		});

		return userList.concat([...ids]);
}