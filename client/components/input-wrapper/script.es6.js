Template.InputWrapper.helpers({
  customized: function(){
    return !!(this.textarea || this.datetime || this.tel || this.select || this.nonstandard);
  }
});

Template.InputWrapper.events({
  'keyup .input-mask-tel'(e){
    var phone = AutoForm.getFieldValue(e.target.id);
    if (!phone) {
      return  $('.input-mask-tel').inputmask({mask:["999-999-9999"]})
    }

    phone = phone.replace(/\D+/g, "").length;
    if (phone < 11){
      $('.input-mask-tel').inputmask({mask:["999-999-9999", "999-999-99999"]})
    } else if (phone == 11){
      $('.input-mask-tel').inputmask({mask:["9-999-999-9999", "9-999-999-99999"]})
    } else {
      $('.input-mask-tel').inputmask("9{1,20}")
    }
  }
});
