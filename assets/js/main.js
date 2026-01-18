(function() {
  "use strict";

  const headerToggleBtn = document.querySelector('.header-toggle');
  const scrollTop = document.querySelector('.scroll-top');
  const preloader = document.querySelector('#preloader');
  const navLinks = document.querySelectorAll('.navmenu a');

  /* ===== Header Toggle ===== */
  function headerToggle() {
    const header = document.querySelector('#header');
    header.classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }

  /* ===== Hide Mobile Nav On Click ===== */
  function hideMobileNavOnClick() {
    navLinks.forEach(navmenu => {
      navmenu.addEventListener('click', () => {
        if (document.querySelector('.header-show')) {
          headerToggle();
        }
      });
    });
  }

  /* ===== Mobile Nav Dropdowns ===== */
  function initMobileNavDropdowns() {
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
      navmenu.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });
  }

  /* ===== Update Active Nav Link On Scroll ===== */
  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    let foundActive = false;

    navLinks.forEach(link => link.classList.remove('active'));

    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionBottom && !foundActive) {
        const activeLink = document.querySelector(`.navmenu a[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
          foundActive = true;
        }
      }
    });

    if (!foundActive) {
      const homeLink = document.querySelector('.navmenu a[href="#hero"]');
      if (homeLink) homeLink.classList.add('active');
    }
  }

  /* ===== Smooth Scroll On Nav Click ===== */
  function initNavLinkClicks() {
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const scrollMarginTop = parseInt(getComputedStyle(target).scrollMarginTop) || 0;
            window.scrollTo({
              top: target.offsetTop - scrollMarginTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  /* ===== Preloader ===== */
  function initPreloader() {
    if (preloader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.remove();
        }, 500);
      });
    }
  }

  /* ===== Scroll Top Button ===== */
  function initScrollTop() {
    function toggleScrollTop() {
      if (scrollTop) {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      }
    }

    if (scrollTop) {
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      window.addEventListener('load', toggleScrollTop);
      document.addEventListener('scroll', toggleScrollTop);
    }
  }

  /* ===== Typed.js ===== */
  function initTypedJS() {
    const selectTyped = document.querySelector('.typed');
    if (selectTyped && typeof Typed !== 'undefined') {
      let typed_strings = selectTyped.getAttribute('data-typed-items');
      if (typed_strings) {
        typed_strings = typed_strings.split(',');
        new Typed('.typed', {
          strings: typed_strings,
          loop: true,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000
        });
      }
    }
  }

  /* ===== Stats Counter ===== */
  function initStatsCounter() {
    const counters = document.querySelectorAll('.purecounter');
    const speed = 200; 

    const runCounter = (counter) => {
      const target = +counter.getAttribute('data-purecounter-end');
      const start = +counter.getAttribute('data-purecounter-start') || 0;
      const duration = +counter.getAttribute('data-purecounter-duration') * 1000 || 1000;
      const increment = (target - start) / (duration / 16);

      let current = start;

      function updateCount() {
        current += increment;
        if ((increment > 0 && current < target) || (increment < 0 && current > target)) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      }
      updateCount();
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(counter => observer.observe(counter));
  }

  /* ===== Skills Animation ===== */
  function initSkillsAnimation() {
    const skills = document.querySelectorAll('.skills-animation .progress .progress-bar');
    if (skills.length > 0) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            skills.forEach(el => {
              el.style.width = el.getAttribute('aria-valuenow') + '%';
            });
            observer.disconnect();
          }
        });
      }, { threshold: 0.5 });

      skills.forEach(skill => observer.observe(skill));
    }
  }

  /* ===== GLightbox ===== */
  function initGlightbox() {
    if (typeof GLightbox !== 'undefined') {
      GLightbox({ selector: '.glightbox' });
    }
  }

  /* ===== Isotope ===== */
  function initIsotope() {
    const isotopeLayouts = document.querySelectorAll('.isotope-layout');
    if (isotopeLayouts.length > 0 && typeof Isotope !== 'undefined' && typeof imagesLoaded !== 'undefined') {
      isotopeLayouts.forEach(isotopeItem => {
        let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
        let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
        let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

        let initIsotope;
        imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
          initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
            itemSelector: '.isotope-item',
            layoutMode: layout,
            filter: filter,
            sortBy: sort
          });
        });

        isotopeItem.querySelectorAll('.isotope-filters li').forEach(filters => {
          filters.addEventListener('click', function() {
            isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
            this.classList.add('filter-active');
            initIsotope.arrange({ filter: this.getAttribute('data-filter') });
            if (typeof initAOS === 'function') initAOS();
          });
        });
      });
    }
  }

  /* ===== Swipers ===== */
  function initSwipers() {
    if (typeof Swiper !== 'undefined') {
      document.querySelectorAll(".init-swiper").forEach(swiperElement => {
        let config = JSON.parse(swiperElement.querySelector(".swiper-config").innerHTML.trim());
        new Swiper(swiperElement, config);
      });
    }
  }

  /* ===== Handle Hash Links On Load ===== */
  function handleHashLinksOnLoad() {
    if (window.location.hash) {
      const targetSection = document.querySelector(window.location.hash);
      if (targetSection) {
        setTimeout(() => {
          const scrollMarginTop = parseInt(getComputedStyle(targetSection).scrollMarginTop) || 0;
          window.scrollTo({
            top: targetSection.offsetTop - scrollMarginTop,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }

  /* ===== Initialization ===== */
  function init() {
    if (headerToggleBtn) headerToggleBtn.addEventListener('click', headerToggle);
    hideMobileNavOnClick();
    initMobileNavDropdowns();
    initNavLinkClicks();
    initPreloader();
    initScrollTop();
    initTypedJS();
    initStatsCounter();
    initSkillsAnimation();
    initGlightbox();
    initIsotope();
    initSwipers();
    handleHashLinksOnLoad();
    setTimeout(() => { if (typeof AOS !== 'undefined') AOS.init({ duration: 600, easing: 'ease-in-out', once: true }); }, 100);
    updateActiveNav(); // ensure active nav is correct on load
    window.addEventListener('scroll', updateActiveNav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
