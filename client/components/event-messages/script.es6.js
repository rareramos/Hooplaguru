Template.EventsMessages.helpers({
	msgList() {
		let invitesId = Invites.findOne({userId: Meteor.userId(), eventId: Session.get('eventId')});
		if(invitesId && invitesId._id)
		{
			let msgs =  Messages.find({eventId: Session.get('eventId'),$or:[{toUser: invitesId._id},{fromUser: invitesId._id}],parentMsgId: "0"});

			let msgLatest = msgs.map(msg => {
				return Messages.findOne({conversationId: msg.conversationId},{sort: {createdAt: -1}});
			});
			return msgLatest;
		}
	},

	envelopeIcon() {
		if(this.readStatus.indexOf(Meteor.userId()) == -1) {
			return '/icons/envelope-close@2x.png';
		}
		let read = true;
		if(read) {
			return '/icons/envelope-open@2x.png';
		} else {
	      return '/icons/envelope-close@2x.png';
	    }
	},

	readStatus() {
		if(this.readStatus.indexOf(Meteor.userId()) == -1) {
			return 'unread';
		}
		let read = true;
		if(read) {
			return 'read'; 
		} else {
			return 'unread';
		}
	},

	userList() {

		let msgs =  Messages.findOne({_id: this._id});

		if(!msgs) {
			return "";
		}
		let userNames = msgs.toUser.map(toUser => {
			user = Invites.findOne({userId: Meteor.userId(), eventId: Session.get('eventId')});

			if(user) {
				if(toUser == user._id) {
					returnVal = "Me";
				} else {
					user = Invites.findOne({_id: toUser});
					if(!user) {
						returnVal = "";
					} else {
						returnVal = user.firstName + " "+ user.lastName;
					}
				}
				return returnVal;
			}
		});

		let fromuser = Invites.findOne({_id: msgs.fromUser});

		if(fromuser) {
			if(fromuser.userId == Meteor.userId()) {
				userNames.push("Me");
			} else {
				if(fromuser) {
					userNames.push(fromuser.firstName + " "+ fromuser.lastName);
				}
			}
		}
		
		userNames = _.uniq(userNames);

		temp = [];

		for(let i of userNames) {
		    i && temp.push(i);
		}

		userNames = temp;
		delete temp;
		
		if(userNames.length > 3) {
			returnVal = userNames.slice(0, 3).join(", ") + "...";
		} else {
			returnVal = userNames.join(", "); 
		}
		return returnVal;
	},

	isHost() {
		return Meteor.user().isHost(Session.get('eventId'));
	}
});

Template.EventsMessages.events({
	'click .msg'  (evt, template){
		let count = Messages.find({_id: this._id, readStatus: Meteor.userId()}).count();

		if(count == 0) {
			Meteor.call('Server.Messages.update', this._id, { readStatus: Meteor.userId() });
		}
		
		PM.set('msg-detail-modal', this.conversationId);
	},

	'click #new-message-btn' (evt, template){
		loadingtext($(evt.target));
		Session.set("touserlist", null);
		Session.set('msg-to-ids', null);
		PM.set('msg-add-modal', true);
		PM.set('msg-detail-modal', false);
	}
});