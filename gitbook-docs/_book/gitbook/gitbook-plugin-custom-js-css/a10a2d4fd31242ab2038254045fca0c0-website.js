(function() {
	$('body').delegate('.rong-top-nav-menu a', 'click', function(e) {
		var el = $(this);
		var siblings = el.parent().siblings();
		siblings.children().removeClass('active');
		el.addClass('active');
	});
})();