Invites.helpers({
  fullName (){
    if(this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;  
    } else if(this.firstName) {
      return `${this.firstName}`;  
    } else if (this.lastName) {
      return `${this.lastName}`;
    } else {
      return '';
    }
    
  },

  rsvpUrl ({autofill, sendSignInToken} = {}){
    let group = Groups.findOne(this.groupId)
    let url = group.code + '/'

    if (group.inviteId) {
      url += this.firstName.toLowerCase()
    }

    if (autofill) {
      url += this.getAutofillParams()

      if (sendSignInToken) {
        let signInToken = Random.secret(10)
        Invites.update(this._id, { $set: {signInToken} })
        url += `&sign-in-token=${signInToken}`
      }
    }

    return url
  },

  getAutofillParams (){
    let {_id, firstName, lastName, phone, email} = this
    let queryString = `?invite-id=${_id}&first-name=${firstName}&last-name=${lastName}`

    if (phone) {
      return `${queryString}&phone=${phone}`

    } else if (email) {
      return `${queryString}&email=${email}`

    } else {
      return queryString
    }
  },

  isAttending (){
    return this.inviteStatus === 'attending';
  },
});
