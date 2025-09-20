// Initialize Lucide icons
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons()

  // Initialize animations and interactions
  initializeAnimations()
  initializeFeatureRotation()
  initializeScrollEffects()
  initializeMobileMenu()
  initializeInteractiveElements()
})

// Animation initialization
function initializeAnimations() {
  // Add slide-in-up animation to hero content
  const heroContent = document.querySelector(".hero-content")
  if (heroContent) {
    setTimeout(() => {
      heroContent.classList.add("slide-in-up")
    }, 100)
  }

  // Add fade-in animation to stats when they come into view
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in")

        // Animate stat values
        if (entry.target.classList.contains("stat-item")) {
          animateStatValue(entry.target)
        }
      }
    })
  }, observerOptions)

  // Observe stat items
  document.querySelectorAll(".stat-item").forEach((item) => {
    observer.observe(item)
  })

  // Observe role cards
  document.querySelectorAll(".role-card").forEach((card) => {
    observer.observe(card)
  })

  // Observe feature cards
  document.querySelectorAll(".feature-card").forEach((card) => {
    observer.observe(card)
  })
}

// Feature rotation
function initializeFeatureRotation() {
  const featureCards = document.querySelectorAll(".feature-card")
  let activeIndex = 1 // Start with second card active

  if (featureCards.length === 0) return

  // Set initial active state
  featureCards[activeIndex].classList.add("active")

  // Rotate active feature every 4 seconds
  setInterval(() => {
    featureCards[activeIndex].classList.remove("active")
    activeIndex = (activeIndex + 1) % featureCards.length
    featureCards[activeIndex].classList.add("active")
  }, 4000)
}

// Scroll effects
function initializeScrollEffects() {
  let ticking = false

  function updateScrollEffects() {
    const scrolled = window.pageYOffset
    const navbar = document.querySelector(".navbar")

    // Add/remove navbar background based on scroll
    if (scrolled > 50) {
      navbar.style.background = "rgba(255, 255, 255, 0.95)"
      navbar.style.backdropFilter = "blur(20px)"
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.9)"
      navbar.style.backdropFilter = "blur(10px)"
    }

    ticking = false
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects)
      ticking = true
    }
  }

  window.addEventListener("scroll", requestTick)
}

// Mobile menu
function initializeMobileMenu() {
  const mobileToggle = document.querySelector(".mobile-menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (!mobileToggle || !navMenu) return

  mobileToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")

    // Toggle hamburger icon
    const icon = mobileToggle.querySelector("i")
    if (navMenu.classList.contains("active")) {
      icon.setAttribute("data-lucide", "x")
    } else {
      icon.setAttribute("data-lucide", "menu")
    }
    lucide.createIcons()
  })
}

// Interactive elements
function initializeInteractiveElements() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Button click effects
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })

  // Role card interactions
  document.querySelectorAll(".role-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px) scale(1.02)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })

  // Feature card interactions
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("click", function () {
      // Remove active class from all cards
      document.querySelectorAll(".feature-card").forEach((c) => c.classList.remove("active"))
      // Add active class to clicked card
      this.classList.add("active")
    })
  })
}

// Animate stat values
function animateStatValue(statItem) {
  const valueElement = statItem.querySelector(".stat-value")
  if (!valueElement) return

  const finalValue = valueElement.textContent
  const numericValue = Number.parseInt(finalValue.replace(/[^\d]/g, ""))
  const suffix = finalValue.replace(/[\d]/g, "")

  if (isNaN(numericValue)) return

  let currentValue = 0
  const increment = numericValue / 50
  const timer = setInterval(() => {
    currentValue += increment
    if (currentValue >= numericValue) {
      currentValue = numericValue
      clearInterval(timer)
    }
    valueElement.textContent = Math.floor(currentValue) + suffix
  }, 30)
}

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Add CSS for ripple effect
const style = document.createElement("style")
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        border-top: 1px solid var(--border);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`
document.head.appendChild(style)

// Performance optimization
window.addEventListener("load", () => {
  // Preload critical images
  const criticalImages = ["/school-management-dashboard.png", "/student-analytics-chart.jpg"]

  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
})

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
})