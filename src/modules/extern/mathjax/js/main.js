define("mathjax", ['jquery'], function($) {

	/**
	 * Prepare MathJax namespace
	 */
	var AMD_MathJax = {
	};

	/**
	 * Asynchronously load MathJax from CDN
	 */
	require(["//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"], function(dummy) {

		// Configure MathJax Hub
		MathJax.Hub.Config({
		  tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
		});

	});

	/**
	 * Run typeset on specified element
	 */
	AMD_MathJax.typesetElement = function(dom) {

		// Typeset every element in the selection
		$(dom).each(function(i, elm) {
			if (window.MathJax)
				MathJax.Hub.Queue(["Typeset",MathJax.Hub,elm]);
		});

	}

	/**
	 * Run typeset on the entire page
	 */
	AMD_MathJax.typeset = function() {

		// Typeset every element in the selection
		if (window.MathJax)
			MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

	}

	return AMD_MathJax;

});