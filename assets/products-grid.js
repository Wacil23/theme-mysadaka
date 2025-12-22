;(function () {
	function getCollectionUrl(baseUrl, sortType) {
		const sortTypes = {
			alphabetical: 'title-ascending',
			alphabetical_reversed: 'title-descending',
			products_low: 'price-ascending',
			products_high: 'price-descending',
			date: 'created-ascending',
			date_reversed: 'created-descending',
		}

		const sortBy = sortTypes[sortType] || sortTypes.alphabetical
		return `${baseUrl}?sort_by=${sortBy}`
	}

	async function handleResponse(response, section, limitProducts) {
		const html = await response.text()
		const parser = new DOMParser()
		const doc = parser.parseFromString(html, 'text/html')

		const targetGrid = section.querySelector('.collection-product-list')
		const sourceGrid = doc?.getElementById('product-grid')
		if (!targetGrid || !sourceGrid || !sourceGrid?.children) return

		const sourceItems = Array.from(sourceGrid.children)
		if (sourceItems.length > limitProducts) {
			const firstItems = sourceItems.slice(0, limitProducts)
			targetGrid.innerHTML = ''
			firstItems.forEach((item) => {
				targetGrid.appendChild(item)
			})
		} else {
			targetGrid.innerHTML = sourceGrid.innerHTML
		}
	}

	const initSection = async (section) => {
		if (!section || !section.classList.contains('products-grid-section')) return

		const box = section.querySelector('.products-grid')
		if (!box) return

		const baseUrl = box.dataset.baseUrl
		const totalShopProducts = Number(box.dataset.totalShopProducts)
		const sortType = box.dataset.sortType
		const limitProducts = Number(box.dataset.limitProducts)

		if (baseUrl && baseUrl !== 'none' && sortType && totalShopProducts > 50) {
			const url = getCollectionUrl(baseUrl, sortType)

			box.classList.add('products-grid--loading')
			try {
				const response = await fetch(url)
				await handleResponse(response, section, limitProducts)
				try {
					colorSwatches()
				} catch (err) {}
			} catch (error) {
				console.error(
					'Products grid: Error when fetching the collection page:',
					error
				)
			} finally {
				box.classList.remove('products-grid--loading')
			}
		} else {
			box.classList.remove('products-grid--loading')
		}
	}

	initSection(document.currentScript.parentElement)

	document.addEventListener('shopify:section:load', function (event) {
		initSection(event.target)
	})
})()
