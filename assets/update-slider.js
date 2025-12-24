(function () {
	function swiperInit() {
		subSliderInit(true, 16);
		sliderInit(true);
		popupSliderInit(true);
	}

	document.addEventListener('shopify:section:load', function (e) {
		swiperInit();
	});

	swiperInit();

	// Ré-initialise/détruit Swiper lors des changements de breakpoint (mobile <-> desktop)
	let resizeTimer = null;
	window.addEventListener('resize', function () {
		window.clearTimeout(resizeTimer);
		resizeTimer = window.setTimeout(function () {
			swiperInit();
		}, 200);
	});
})();
