Template.PersonListItem.helpers({
  inactiveStatus (){
    const {hiddenPersonClass, context} = this;

    if (hiddenPersonClass && context && context.isHidden) {
      return {
        className: hiddenPersonClass,
        text: '(hidden)'
      };

    } else {
      return {};
    }
  },
  plusOneGuest (){
    return this.context && this.context.inviteStatus === "attending" && this.context.bringingPlusOne;
  },
  role (){
    return this.context && this.context.inviteStatus === "attending" && this.context.hostRole;
  },
  displayedName (){
    return lodash.trim(this.identifier) || this.context.phone || this.context.email;
  },
});
