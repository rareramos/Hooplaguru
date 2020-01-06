formhackhide = (formId,contacts = 0,pastevent = 0) => {
	$('form').hide();
	$('button').attr('tabindex','-1');
	if(contacts == 0) {
		$('#search-contacts').hide();
	}
	if(pastevent == 0) {
		$('#eventlist-select').hide();
	}
	if(formId != 'all') {
		formArr = formId.split(',');

		formArr.forEach(function(item, index) {
			$('#'+item).show();
		});
	}
}

formhackshow = () => {
	$('form').show();
	$('#search-contacts').show();
	$('#eventlist-select').show();
}