$(function() {

	function on_scroll() {
		var ofs = $(document.body).scrollTop(),
			bt = ofs/2;

		$("#pxback").css({
			'top': bt
		});
		var rt = $("#register").position().top - bt;
		$("#pxblur").css({
			'top': -rt
		});
	}

	function on_resize() {
		$(".page-full").css({
			'height': $(window).height()
		});
		on_scroll();
	}

	on_resize();
	$(window).resize(on_resize);
	$(window).scroll(on_scroll);
});