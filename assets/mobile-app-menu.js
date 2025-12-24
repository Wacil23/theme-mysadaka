;(function () {
  const body = document.body
  let scrollY = 0

  const lockScroll = () => {
    scrollY = window.scrollY || 0
    body.classList.add('app-menu-open')
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
  }

  const unlockScroll = () => {
    body.classList.remove('app-menu-open')
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.right = ''
    body.style.width = ''
    window.scrollTo(0, scrollY)
  }

  const setVh = () => {
    const vv = window.visualViewport
    const h = vv?.height || window.innerHeight
    document.documentElement.style.setProperty('--vh', `${h * 0.01}px`)
  }

  class MobileAppMenu extends HTMLElement {
    connectedCallback() {
      this.openBtn = this.querySelector('[data-app-menu-open]')
      this.overlay = this.querySelector('[data-app-menu-overlay]')
      this.panel = this.querySelector('[data-app-menu-panel]')
      this.closeBtn = this.querySelector('[data-app-menu-close]')
      this.views = Array.from(this.querySelectorAll('[data-app-menu-view]'))
      this.backBtns = Array.from(this.querySelectorAll('[data-app-menu-back]'))

      setVh()
      window.addEventListener('resize', setVh)
      window.visualViewport?.addEventListener('resize', setVh)

      this.openBtn?.addEventListener('click', () => this.open())
      this.closeBtn?.addEventListener('click', () => this.close())
      this.overlay?.addEventListener('click', () => this.close())

      this.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-app-menu-open-view]')
        if (!btn) return
        const viewId = btn.getAttribute('data-app-menu-open-view')
        if (!viewId) return
        this.openView(viewId)
      })

      this.backBtns.forEach((b) => b.addEventListener('click', () => this.back()))

      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return
        if (!body.classList.contains('app-menu-open')) return
        // Si une view est ouverte, retour, sinon close
        if (this.activeViewId) this.back()
        else this.close()
      })
    }

    open() {
      this.openBtn?.setAttribute('aria-expanded', 'true')
      this.overlay.hidden = false
      this.panel.hidden = false
      lockScroll()
    }

    close() {
      this.openBtn?.setAttribute('aria-expanded', 'false')
      this.clearViews()
      this.overlay.hidden = true
      this.panel.hidden = true
      unlockScroll()
    }

    clearViews() {
      this.activeViewId = null
      this.views.forEach((v) => {
        v.hidden = true
        v.classList.remove('is-active')
      })
    }

    openView(id) {
      const view = this.querySelector(`[data-app-menu-view="${CSS.escape(id)}"]`)
      if (!view) return
      this.clearViews()
      this.activeViewId = id
      view.hidden = false
      // next tick for transition
      requestAnimationFrame(() => view.classList.add('is-active'))
    }

    back() {
      this.clearViews()
    }
  }

  customElements.define('mobile-app-menu', MobileAppMenu)
})()


