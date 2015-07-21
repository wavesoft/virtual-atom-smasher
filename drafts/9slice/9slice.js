$(function() {
	 
    // Handle drop
    var pictureDrop = $("#picture-drop"),
    	previewDOM = $("#preview #resizable"),
    	BORDER_PICTURE = "about:blank";

	// Make preview resizable
	previewDOM.draggable().resizable();

    // Apply function
    var applyChanges = function() {
    	previewDOM.css({
    		'border-image-source': 'url(' + BORDER_PICTURE + ') ',

    		'border-image-slice':
    				$("#inpSliceTop").val() + ' ' + $("#inpSliceRight").val() + ' ' + 
    				$("#inpSliceBottom").val() + ' ' + $("#inpSliceLeft").val() + ' fill',

    		'border-image-width':
    				$("#inpBorderTop").val() + 'px ' + $("#inpBorderRight").val() + 'px ' + 
    				$("#inpBorderBottom").val() + 'px ' + $("#inpBorderLeft").val() + 'px',

    		'border-image-repeat': $("#inpBorder").val(),

    	});

    };
    $("#btnApply").click(applyChanges);

    // Register drag/drop handlers
    pictureDrop.on('dragover', function(e) {
    	pictureDrop.addClass("hover");
    	return false;
    });
    pictureDrop.on('dragend', function(e) {
    	pictureDrop.removeClass("hover");
    	return false;
    });
    pictureDrop.on('drop', function(e) {
    	pictureDrop.removeClass("hover");
    	e.preventDefault();

		var file = e.originalEvent.dataTransfer.files[0],
			reader = new FileReader();

		// Read file
		reader.onload = function (event) {

			BORDER_PICTURE = event.target.result;

			pictureDrop.text("Image Defined");
    		pictureDrop.addClass("defined");

			applyChanges();

		};
		reader.readAsDataURL(file);

    	return false;
    });

});