/* ==========================================================================
   Atyaf Al-Bayad - Site Interactive Engine
   Atyaf Al-Bayad Architecture Dynamic Map State Machine, Camera Pan/Zoom, 
   White Project Card Carousel, and Form Handlers.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroTextRotator();
  initHeaderScroll();
  initMobileDrawer();
  initOdometerCounters();
  initHeroVideoState();
  initQuoteForm();
  
});

/* Header Scroll Behavior & Collapsible Pill (Atyaf Al-Bayad Architecture) */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const pill = document.querySelector('.header-pill');
  const toggleBtn = document.querySelector('.pill-toggle-btn');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
      if (pill && window.innerWidth > 768) pill.classList.remove('is-expanded');
    }
  });

  if (toggleBtn && pill) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.innerWidth <= 768) {
        const drawer = document.querySelector('.mobile-nav-drawer');
        const overlay = document.querySelector('.drawer-overlay');
        if (drawer && overlay) {
          drawer.classList.add('open');
          overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      } else {
        pill.classList.toggle('is-expanded');
      }
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth > 768 && !pill.contains(e.target)) {
        pill.classList.remove('is-expanded');
      }
    });

    pill.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) {
        pill.classList.remove('is-expanded');
      }
    });
  }
}

/* Mobile Drawer */
function initMobileDrawer() {
  const trigger = document.querySelector('.mobile-menu-trigger');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const overlay = document.querySelector('.drawer-overlay');
  
  if (!drawer || !overlay) return;
  
  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  if (trigger) trigger.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
}

/* Odometer Metric Counters */
function initOdometerCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;
  
  let started = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          let current = 0;
          const increment = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = current;
            }
          }, 35);
        });
      }
    });
  }, { threshold: 0.3 });
  
  const section = document.querySelector('.facts-section-bar');
  if (section) observer.observe(section);
}

/* Hero Video Autoplay */
function initHeroVideoState() {
  const video = document.querySelector('.hero-video-bg');
  const fallback = document.querySelector('.hero-fallback-bg');
  if (!video) return;
  
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      if (fallback) fallback.style.opacity = '0';
    }).catch(() => {
      if (fallback) fallback.style.opacity = '0.35';
    });
  }
}

/* Quote Form WhatsApp Dispatcher */
function initQuoteForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('qName').value.trim();
    const phone = document.getElementById('qPhone').value.trim();
    const type = document.getElementById('qType').value;
    const area = document.getElementById('qArea').value.trim();
    const district = document.getElementById('qDistrict').value.trim();
    const notes = document.getElementById('qNotes').value.trim();
    
    let rawText = `*طلب عرض سعر معتمد - أطياف البياض*\n\n`;
    rawText += `• *الاسم الكريم:* ${name}\n`;
    rawText += `• *رقم الجوال:* ${phone}\n`;
    rawText += `• *نوع المشروع:* ${type}\n`;
    if (area) rawText += `• *المساحة التقديرية:* ${area} م²\n`;
    if (district) rawText += `• *الحي / الموقع:* ${district}\n`;
    if (notes) rawText += `• *تفاصيل إضافية:* ${notes}\n`;
    
    const encodedMsg = encodeURIComponent(rawText);
    window.open(`https://wa.me/966555439543?text=${encodedMsg}`, '_blank');
  });
}







// ==========================================================================
// REAL RIYADH MAP SCROLLYTELLING & PIECE ENLARGEMENT
// ==========================================================================
function initProjectMapScroll() {
  const projectItems = document.querySelectorAll('.scrolly-project-item');
  const sectors = document.querySelectorAll('.riyadh-real-map-svg .map-piece');
  const badgeName = document.getElementById('activeDistrictName');
  const mapGroup = document.querySelector('.map-sectors-group');

  const sectorNames = {
    'sec-north': 'شمال الرياض (حي النرجس والياسمين)',
    'sec-west': 'غرب الرياض (بوابة الدرعية)',
    'sec-center': 'وسط الرياض (طريق الملك فهد والعليا)',
    'sec-southwest': 'جنوب غرب الرياض (المزاحمية والقويعية)',
    'sec-east': 'شرق الرياض (ضاحية الفرسان واليرموك)',
    'sec-southeast': 'جنوب شرق الرياض (الخرج والمناطق الصناعية)',
    'sec-south': 'جنوب الرياض (حي ديراب والمقر الرئيسي)'
  };

  if (!projectItems.length || !sectors.length) return;

  function setActiveSector(secId) {
    if (mapGroup) mapGroup.classList.add('has-active');
    
    sectors.forEach(s => {
      s.classList.remove('active-piece');
    });

    const activeEl = document.getElementById(secId);
    if (activeEl) {
      activeEl.classList.add('active-piece');
      // Bring active sector to front so enlarged edges render over adjacent pieces
      activeEl.parentNode.appendChild(activeEl);
    }

    if (badgeName && sectorNames[secId]) {
      badgeName.textContent = sectorNames[secId];
    }
  }

  // Set default initial state
  const firstSector = projectItems[0].getAttribute('data-sector');
  if (firstSector) {
    setActiveSector(firstSector);
  }

  // IntersectionObserver for natural mouse scroll
  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -40% 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetSector = entry.target.getAttribute('data-sector');
        if (targetSector) {
          setActiveSector(targetSector);
        }
      }
    });
  }, observerOptions);

  projectItems.forEach(item => observer.observe(item));

  // Interactive click on map pieces to scroll to corresponding project
  sectors.forEach(sector => {
    sector.addEventListener('click', () => {
      const secId = sector.id;
      const targetCard = document.querySelector(`.scrolly-project-item[data-sector="${secId}"]`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initProjectMapScroll);



/* Dynamic Rotating Single-Line Hero Text */
function initHeroTextRotator() {
  const textEl = document.getElementById('heroRotatingText');
  if (!textEl) return;

  const phrases = [
    "مؤسسة أطياف البياض للمقاولات العامة",
    "تنفيذ الهياكل الخرسانية والمباني المتكاملة بالرياض",
    "مقاولات عامة معتمدة وفق كود البناء السعودي SBC",
    "إشراف هندسي ميداني وضمانات إنشائية تصل إلى 10 سنوات"
  ];

  let currentIndex = 0;

  setInterval(() => {
    textEl.classList.remove('fade-in');
    textEl.classList.add('fade-out');

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % phrases.length;
      textEl.textContent = phrases[currentIndex];
      textEl.classList.remove('fade-out');
      textEl.classList.add('fade-in');
    }, 550);
  }, 3800);
}



/* Atyaf Al-Bayad Architecture Splash Screen Dismissal */
function initSplashScreen() {
  const splash = document.getElementById('siteSplashScreen');
  if (!splash) return;

  const hideSplash = () => {
    splash.classList.add('loaded');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 800);
  };

  const startTime = Date.now();
  const minDuration = 1400; // 1.4s smooth brand presentation

  if (document.readyState === 'complete') {
    setTimeout(hideSplash, minDuration);
  } else {
    window.addEventListener('load', () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);
      setTimeout(hideSplash, remaining);
    });
  }

  // Safety fallback timeout
  setTimeout(hideSplash, 3000);
}

// Trigger early
initSplashScreen();

/* ==========================================================================
   FIELD PHOTO GALLERY — Tab Switcher
   ========================================================================== */
function initGalleryTabs() {
  const tabs = document.querySelectorAll('.gallery-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all tabs and panels
      document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.gallery-panel').forEach(p => p.classList.remove('active'));

      // Activate clicked tab and its panel
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initGalleryTabs();
  initImageLightbox();
  initNewsletterForm();
  initToastAndModals();
});

/* ==========================================================================
   FULLSCREEN IMAGE LIGHTBOX (Interactive Modal Viewer)
   ========================================================================== */
function initImageLightbox() {
  const cards = document.querySelectorAll('.gallery-card');
  if (!cards.length) return;

  // Create lightbox DOM elements if not already present
  let lightbox = document.querySelector('.image-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'معاينة الصورة بكامل الشاشة');
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <button type="button" class="lightbox-close-btn" aria-label="إغلاق">&times;</button>
      <button type="button" class="lightbox-nav-btn lightbox-prev" aria-label="الصورة السابقة">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      <button type="button" class="lightbox-nav-btn lightbox-next" aria-label="الصورة التالية">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div class="lightbox-dialog">
        <img class="lightbox-img" src="" alt="معاينة ميدانية - أطياف البياض">
      </div>
      <div class="lightbox-counter">
        <span class="lightbox-current">1</span> من <span class="lightbox-total">1</span>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const backdrop = lightbox.querySelector('.lightbox-backdrop');
  const closeBtn = lightbox.querySelector('.lightbox-close-btn');
  const prevBtn = lightbox.querySelector('.lightbox-nav-btn.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-nav-btn.lightbox-next');
  const imgEl = lightbox.querySelector('.lightbox-img');
  const currentEl = lightbox.querySelector('.lightbox-current');
  const totalEl = lightbox.querySelector('.lightbox-total');

  let currentList = [];
  let currentIndex = 0;

  function updateImage(index) {
    if (!currentList.length) return;
    if (index < 0) index = currentList.length - 1;
    if (index >= currentList.length) index = 0;
    currentIndex = index;

    imgEl.style.opacity = '0';
    imgEl.style.transform = 'scale(0.96)';

    const newSrc = currentList[currentIndex];
    const preloader = new Image();
    preloader.onload = () => {
      imgEl.src = newSrc;
      imgEl.style.opacity = '1';
      imgEl.style.transform = 'scale(1)';
    };
    preloader.src = newSrc;

    if (currentEl) currentEl.textContent = currentIndex + 1;
    if (totalEl) totalEl.textContent = currentList.length;

    // Show/hide nav buttons if single image
    if (currentList.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }

  function openLightbox(list, index) {
    currentList = list;
    updateImage(index);
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  // Click on any card
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      // Find parent panel to scope navigation within current category
      const panel = card.closest('.gallery-panel') || document;
      const panelImgs = Array.from(panel.querySelectorAll('.gallery-card img')).map(img => img.getAttribute('src') || img.src);
      const clickedImg = card.querySelector('img');
      const clickedSrc = clickedImg ? (clickedImg.getAttribute('src') || clickedImg.src) : '';
      const clickedIdx = panelImgs.indexOf(clickedSrc);

      openLightbox(panelImgs, clickedIdx >= 0 ? clickedIdx : 0);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);

  // In RTL: prev (right arrow) goes to previous image, next (left arrow) goes to next
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateImage(currentIndex - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateImage(currentIndex + 1);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') updateImage(currentIndex - 1);
    if (e.key === 'ArrowLeft') updateImage(currentIndex + 1);
  });

  // Mobile Touch Swipe Gesture Support
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) {
          updateImage(currentIndex - 1);
        } else {
          updateImage(currentIndex + 1);
        }
      }
    }
  }, { passive: true });
}


/* ==========================================================================
   FOOTER NEWSLETTER INTERACTION
   ========================================================================== */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-box');
  if (!forms.length) return;

  forms.forEach(form => {
    const input = form.querySelector('.newsletter-input');
    const btn = form.querySelector('.newsletter-btn');
    const feedback = form.querySelector('.newsletter-feedback');
    if (!input || !btn) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        if (feedback) {
          feedback.className = 'newsletter-feedback error';
          feedback.textContent = 'يرجى إدخال عنوان بريد إلكتروني صحيح';
        }
        input.focus();
        return;
      }

      // Successful subscription simulation with UI feedback
      const originalText = btn.innerHTML;
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      btn.style.backgroundColor = '#16a34a';

      if (feedback) {
        feedback.className = 'newsletter-feedback success';
        feedback.textContent = 'تم تسجيل اشتراكك بنجاح. شكراً لتواصلك معنا!';
      }

      input.value = '';
      input.disabled = true;

      // Reset state after 4.5 seconds
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
        input.disabled = false;
        if (feedback) {
          feedback.textContent = '';
          feedback.className = 'newsletter-feedback';
        }
      }, 4500);
    });
  });
}

/* ==========================================================================
   TOAST NOTIFICATIONS & OFFICIAL CORPORATE MODALS
   ========================================================================== */
function showToast(message, duration = 3500) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'site-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <div class="toast-content">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      <span>${message}</span>
    </div>
  `;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

function openCorporateModal(title, contentHtml) {
  let modal = document.getElementById('siteCorporateModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'siteCorporateModal';
    modal.className = 'site-modal-overlay';
    modal.innerHTML = `
      <div class="site-modal-dialog">
        <div class="site-modal-header">
          <div class="site-modal-title">
            
            <span id="modalHeaderTitle"></span>
          </div>
          <button type="button" class="site-modal-close" aria-label="إغلاق">&times;</button>
        </div>
        <div class="site-modal-body" id="modalBodyContent"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.site-modal-close').addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  document.getElementById('modalHeaderTitle').textContent = title;
  document.getElementById('modalBodyContent').innerHTML = contentHtml;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function initToastAndModals() {


  // Privacy Policy Modal
  document.querySelectorAll('.js-open-privacy').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openCorporateModal('سياسة الخصوصية وسرية المعلومات', `
        <div class="modal-section-item">
          <h4>١. الالتزام بالسرية الهندسية</h4>
          <p>تلتزم مؤسسة أطياف البياض للمقاولات العامة بالحفاظ على خصوصية وسرية كافة المخططات المعمارية والإنشائية، وجداول الكميات، والمراسلات الفنية التي يزودنا بها عملاؤنا الكرام.</p>
        </div>
        <div class="modal-section-item">
          <h4>٢. حماية البيانات التعاقدية</h4>
          <p>لا يتم الإفصاح عن أي بيانات خاصة بالمشاريع أو أرقام التواصل أو وثائق الملكية لأي طرف ثالث، وتُستخدم حصراً لإعداد عروض الأسعار والدراسات الميدانية وفق الأنظمة واللوائح السعودية.</p>
        </div>
        <div class="modal-section-item">
          <h4>٣. أمان وسائط الاتصال</h4>
          <p>كافة النماذج المباشرة وطلبات التسعير عبر موقعنا الإلكتروني مشفرة ومحمية بما يضمن سلامة التواصل المباشر مع المهندسين المشرفين.</p>
        </div>
      `);
    });
  });

  // Terms & Conditions Modal
  document.querySelectorAll('.js-open-terms').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openCorporateModal('الشروط والأحكام والالتزامات التعاقدية', `
        <div class="modal-section-item">
          <h4>١. الامتثال لكود البناء السعودي (SBC)</h4>
          <p>تخضع كافة أعمال الإنشاءات والمقاولات العامة والتشطيبات المنفذة من قبل المؤسسة للاشتراطات الفنية والهندسية المعتمدة في كود البناء السعودي واللوائح البلدية الصادرة بالرياض.</p>
        </div>
        <div class="modal-section-item">
          <h4>٢. عروض الأسعار والمواصفات الفنية</h4>
          <p>تعتبر عروض الأسعار الصادرة مبدئية حتى اعتماد المخططات التنفيذية ومعاينة الموقع على الطبيعة وتوقيع العقد الإنشائي الموحد وتحديد جداول الدفعات والمراحل الزمنية.</p>
        </div>
        <div class="modal-section-item">
          <h4>٣. الضمانات الإنشائية المعتمدة</h4>
          <p>تقدم المؤسسة وثائق ضمان خطية موثقة بالسجل التجاري الرسمي 7031019404 تشمل ضمانات الهيكل الإنشائي حتى 10 سنوات، وضمانات العزل المائي والحراري والأعمال الكهروميكانيكية المعتمدة.</p>
        </div>
      `);
    });
  });
}


