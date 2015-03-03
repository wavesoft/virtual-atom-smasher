$(function() {

	function on_scroll() {
		var ofs = $(window).scrollTop(),
			bt = ofs/2;

		$("#pxback").css({
			'top': bt
		});
	}

	function on_resize() {
		$(".page-full").css({
			'height': $(window).height()
		});
		$("#pxback").css({
			'height': $(window).height()*1.25
		});
		on_scroll();
	}

	function register_email(email) {
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var e = email.trim();
		if (!e || !re.test(email)) {
			$("#register input").addClass("wrong").focus();
			return;
		}
		$("#register .form").hide();

		// Send ajax request
		$.ajax({
			url: "subscribe.php",
			type: "POST",
			data: { 'email' : email },
			dataType: 'json'
		})
		.done(function(data) {
				if (data['status'] != "ok") {
					$("#register .thankyou")
						.html("An error occured: " + data['message'])
						.fadeIn();
				} else {
					$("#register .thankyou")
						.html("You will be notified to <b>"+email+"</b> when the beta-testing opens!")
						.fadeIn();
				}
			})
		.fail(function() {
			$("#register .thankyou")
				.html("Registration failed due to a server error!")
				.fadeIn();
			});

	}

	on_resize();
	$(window).resize(on_resize);
	$(window).scroll(on_scroll);
	$("#register button").click(function() {
		register_email($("#register input").val());
	});
	$("#register input").keydown(function() {
		$("#register input").removeClass("wrong");
	});

	$("#register .thankyou").hide();

});