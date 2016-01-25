'use strict';

var logoKampus = document.querySelector("#logo-kampus");

Reveal.initialize({
	autoSlide: false,
	transition:'slide',
	controls: false,
	// transitionSpeed: 'slow',
	history:true,
	// slideNumber: 'c/t',
	// backgroundTransition:'fade',
	parallaxBackgroundImage: 'images/lod-cloud_colored.png',
	parallaxBackgroundSize:'2288px 1145px',
	parallaxBackgroundHorizontal: 50,
    parallaxBackgroundVertical: 20,
    dependencies: [
    	{ 
    		src: 'public/components/reveal.js/plugin/highlight/highlight.js', 
    		async: true, 
    		callback: function() { 
    			hljs.initHighlightingOnLoad(); 
    		} 
    	}
    ]
});

Reveal.addEventListener('ready', function (event) {
	var mainBackground = document.querySelector('.backgrounds');
	mainBackground.style['opacity'] = 0.3;
	
	if ( Reveal.isFirstSlide() ) {
		logoKampus.setAttribute("style", "top:0px;left:0px;float:none;width:150px;position:relative;");
	}
});

Reveal.addEventListener('slidechanged', function (event) {
	if ( Reveal.isFirstSlide() ) {
		logoKampus.setAttribute("style", "top:0px;left:0px;float:none;width:150px;position:relative;");
	}
});

Reveal.addEventListener('video', function (e) {
	var video = document.getElementsByTagName('video')[0];
	window.addEventListener('keydown', function (event) {
		if ( event.keyCode === 86 ) {
			video.play();
		}
	}, true);
});