;(function () {
	const initCollapsibleContent = () => {
		$('.collapsible-content__toggle')
			.off('click')
			.on('click', function () {
				const parent = $(this).parent()
				const answer = $(this).next('.collapsible-content__answer')

				if (!parent.hasClass('active')) {
					parent
						.siblings('.collapsible-content__item.active')
						.removeClass('active')
						.find('.collapsible-content__answer')
						.stop()
						.slideUp(300, function () {
							$(this).css('display', 'none')
						})

					parent.addClass('active')
					answer.stop().slideDown(300, function () {
						$(this).css('display', 'block')
					})
				} else {
					parent.removeClass('active')
					answer.stop().slideUp(300, function () {
						$(this).css('display', 'none')
					})
				}
			})
	}

	const handleResize = () => {
		$('.collapsible-content__answer').removeAttr('style')

		$('.collapsible-content__item.active .collapsible-content__answer').css(
			'display',
			'block'
		)
	}

	window.addEventListener('resize', handleResize)

	document.addEventListener('shopify:section:load', function () {
		initCollapsibleContent()
		handleResize()
	})

	initCollapsibleContent()
	handleResize()
})()
