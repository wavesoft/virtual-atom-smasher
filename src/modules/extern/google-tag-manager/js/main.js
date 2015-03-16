define("google-tag-manager", function() {

	/**
	 * Google Tag Manager Helper
	 */
	var GoogleTagManager = function( id ) {

		// GTM Bootstrap script as-is from the gtm library
		(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer',id);

	};

	// Return GTM Helper
	return GoogleTagManager;

});