if (!customElements.get('countdown-timer')) {
	class Countdown extends HTMLElement {
		constructor() {
			super()
			const isMockEnabled =
				this.getAttribute('data-enable-mock-timer') === 'true'

			if (isMockEnabled) {
				const mockPickerDay = Number(
					this.getAttribute('data-enable-mock-picker-day')
				)
				const mockPickerHour = Number(
					this.getAttribute('data-enable-mock-picker-hours')
				)

				const nowDate = new Date()
				const mockTargetDate = new Date(
					nowDate.getTime() +
						(mockPickerDay * 24 + mockPickerHour) * 60 * 60 * 1000
				)

				this.countdownDate = mockTargetDate
			} else {
				const date = this.getAttribute('data-date')
				const time = this.getAttribute('data-time')

				const safeTime = time.length === 5 ? `${time}:00` : time
				const countdownDate = new Date(`${date}T${safeTime}`)
				this.countdownDate = countdownDate
			}

			this.completedCountdown = this.getAttribute('data-completed')
			this.countdown = this.querySelector('.countdown__main')
			this.countdownHeading = this.querySelector('.countdown__end-info')
			this.daysEl = this.querySelector('.countdown_block_days')
			this.hoursEl = this.querySelector('.countdown_block_hours')
			this.minutesEl = this.querySelector('.countdown_block_minutes')
			this.secondsEl = this.querySelector('.countdown_block_seconds')
			this.section = this.closest('.countdown-section')

			if (this.daysEl) this.daysEl.textContent = ''
			if (this.hoursEl) this.hoursEl.textContent = ''
			if (this.minutesEl) this.minutesEl.textContent = ''
			if (this.secondsEl) this.secondsEl.textContent = ''

			this.setInterval()
		}

		onInit() {
			const now = new Date()
			const distance = this.countdownDate.getTime() - now.getTime()

			const days = Math.floor(distance / (1000 * 60 * 60 * 24))
			const hours = Math.floor(
				(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			)
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
			const seconds = Math.floor((distance % (1000 * 60)) / 1000)

			if (distance < 0 && this.completedCountdown === 'hide_section') {
				clearInterval(this.interval)
				this.section.style.display = 'none'
			} else if (distance < 0 && this.completedCountdown === 'show_text') {
				clearInterval(this.interval)
				if (this.countdown) this.countdown.style.display = 'none'
				if (this.countdownHeading) this.countdownHeading.style.display = 'flex'
			} else {
				if (this.daysEl) this.daysEl.textContent = String(days).padStart(2, '0')
				if (this.hoursEl)
					this.hoursEl.textContent = String(hours).padStart(2, '0')
				if (this.minutesEl)
					this.minutesEl.textContent = String(minutes).padStart(2, '0')
				if (this.secondsEl)
					this.secondsEl.textContent = String(seconds).padStart(2, '0')
			}
		}

		setInterval() {
			clearInterval(this.interval)
			this.onInit()
			this.interval = setInterval(this.onInit.bind(this), 1000)
		}

		disconnectedCallback() {
			clearInterval(this.interval)
		}
	}

	customElements.define('countdown-timer', Countdown)
}
