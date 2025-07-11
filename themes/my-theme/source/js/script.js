// Modern JavaScript for Hexo Theme - Inspired by doeshing.site

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Check if it's home page and add body class for footer positioning
  const footer = document.querySelector('.doeshing-footer');
  if (footer && footer.classList.contains('home-page')) {
    document.body.classList.add('home-page');
  }
  
  // Initialize effects based on theme configuration
  // Check if elements exist to determine if features are enabled
  if (document.getElementById('bg-ball')) {
    initBackgroundBall();
  }
  
  if (document.getElementById('trailing-cursor')) {
    initTrailingCursor();
  }
  
  // Always initialize core functionality
  initArticleAnimations();
  initSocialLinks();
  initNavigationEffects();
  initMobileMenu();
  initSidebarNavigation();
  
  // Initialize Twitter actions if enabled
  if (document.querySelector('.tweet-action')) {
    initTwitterActions();
  }
  
  // Initialize search if enabled
  initSearch();
  
  // Initialize smooth scrolling (can be controlled via CSS)
  initSmoothScrolling();
  
  // Initialize back to top if enabled
  initBackToTop();
  
  // Initialize reading widgets if on post page
  if (document.body.classList.contains('post-page')) {
    initReadingWidgets();
  }
});

// Background Ball Effect
function initBackgroundBall() {
  const bgBall = document.getElementById('bg-ball');
  if (!bgBall) return;
  
  let mouseX = 0;
  let mouseY = 0;
  let isMoving = false;
  
  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;
    isMoving = true;
    
    // Update CSS custom properties for the gradient
    document.documentElement.style.setProperty('--mouse-x', mouseX + '%');
    document.documentElement.style.setProperty('--mouse-y', mouseY + '%');
    
    // Clear the timeout if it exists
    clearTimeout(bgBall.timeout);
    
    // Set timeout to reduce opacity when mouse stops
    bgBall.timeout = setTimeout(() => {
      isMoving = false;
    }, 100);
  });
  
  // Fade out when mouse leaves window
  document.addEventListener('mouseleave', () => {
    bgBall.style.opacity = '0.3';
  });
  
  document.addEventListener('mouseenter', () => {
    bgBall.style.opacity = '1';
  });
}

// Trailing Cursor Effect
function initTrailingCursor() {
  const cursor = document.getElementById('trailing-cursor');
  if (!cursor) return;
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  
  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '1';
  });
  
  // Hide cursor when mouse leaves
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  
  // Smooth cursor following animation
  function animateCursor() {
    // Smooth interpolation
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Add hover effects for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .read-more, .social-link');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.style.transform += ' scale(1.5)';
      cursor.style.background = 'rgba(59, 130, 246, 0.6)';
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
      cursor.style.background = 'rgba(59, 130, 246, 0.3)';
    });
  });
}

// Smooth Scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"], a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.length > 1) { // Not just "#"
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// Article animations on scroll
function initArticleAnimations() {
  const articles = document.querySelectorAll('article');
  
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Setup initial state and observe articles
  articles.forEach((article, index) => {
    article.style.opacity = '0';
    article.style.transform = 'translateY(30px)';
    article.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    
    observer.observe(article);
  });
}

// Navigation effects and active states
function initNavigationEffects() {
  // Add active state to navigation
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
      link.style.color = 'var(--accent)';
      link.style.background = 'rgba(59, 130, 246, 0.1)';
    }
  });
  
  // Navbar scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > 100) {
        header.style.background = 'rgba(24, 24, 27, 0.95)';
        header.style.backdropFilter = 'blur(20px) saturate(180%)';
      } else {
        header.style.background = 'rgba(24, 24, 27, 0.8)';
        header.style.backdropFilter = 'blur(20px)';
      }
    }, 16));
  }
}

// Enhanced social link interactions
function initSocialLinks() {
  const socialLinks = document.querySelectorAll('.social-link');
  
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-4px) scale(1.05)';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateY(0) scale(1)';
    });
    
    link.addEventListener('click', (e) => {
      // Add click ripple effect
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.5)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.left = '50%';
      ripple.style.top = '50%';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.marginLeft = '-10px';
      ripple.style.marginTop = '-10px';
      
      link.style.position = 'relative';
      link.style.overflow = 'hidden';
      link.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Header Search functionality
function initSearch() {
  const headerSearchInput = document.querySelector('#header-search');
  const searchResults = document.querySelector('#search-results');
  const oldSearchInput = document.querySelector('#search');
  
  // Initialize header search
  if (headerSearchInput && searchResults) {
    initHeaderSearch(headerSearchInput, searchResults);
  }
  
  // Legacy search functionality for page-specific search
  if (oldSearchInput) {
    initPageSearch(oldSearchInput);
  }
}

function initHeaderSearch(searchInput, searchResults) {
  let searchTimeout;
  
  // Sample posts data - in a real implementation, this would come from your site data
  const posts = getAllPosts();
  
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    
    clearTimeout(searchTimeout);
    
    if (query === '') {
      searchResults.classList.remove('visible');
      return;
    }
    
    searchTimeout = setTimeout(() => {
      const results = posts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const contentMatch = post.content.toLowerCase().includes(query);
        const categoryMatch = post.categories && post.categories.some(cat => 
          cat.toLowerCase().includes(query)
        );
        const tagMatch = post.tags && post.tags.some(tag => 
          tag.toLowerCase().includes(query)
        );
        
        return titleMatch || contentMatch || categoryMatch || tagMatch;
      });
      
      displaySearchResults(results, searchResults, query);
    }, 300);
  });
  
  // Hide results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('visible');
    }
  });
  
  // Show results when focusing on search input
  searchInput.addEventListener('focus', function() {
    if (this.value.trim() !== '' && searchResults.children.length > 0) {
      searchResults.classList.add('visible');
    }
  });
}

function getAllPosts() {
  // Use global search data if available
  if (window.searchData && Array.isArray(window.searchData)) {
    return window.searchData;
  }
  
  // Fallback: Extract posts from current page
  const posts = [];
  const tweetCards = document.querySelectorAll('.tweet-card');
  tweetCards.forEach(card => {
    const titleElement = card.querySelector('.tweet-title a');
    const excerptElement = card.querySelector('.tweet-excerpt');
    
    if (titleElement) {
      posts.push({
        title: titleElement.textContent.trim(),
        content: excerptElement ? excerptElement.textContent.trim() : '',
        url: titleElement.href,
        date: '',
        categories: [],
        tags: []
      });
    }
  });
  
  return posts;
}

function displaySearchResults(results, searchResults, query) {
  searchResults.innerHTML = '';
  
  if (results.length === 0) {
    searchResults.innerHTML = `
      <div class="search-result-item">
        <div class="search-result-title">沒有找到相關文章</div>
        <div class="search-result-excerpt">請嘗試其他關鍵字</div>
      </div>
    `;
  } else {
    results.slice(0, 5).forEach(post => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      
      // Create tags/categories display
      let metaInfo = '';
      if (post.categories && post.categories.length > 0) {
        metaInfo += `<span class="search-meta">分類: ${post.categories.join(', ')}</span>`;
      }
      if (post.tags && post.tags.length > 0) {
        if (metaInfo) metaInfo += ' • ';
        metaInfo += `<span class="search-meta">標籤: ${post.tags.slice(0, 3).join(', ')}</span>`;
      }
      if (post.date) {
        if (metaInfo) metaInfo += ' • ';
        metaInfo += `<span class="search-meta">${post.date}</span>`;
      }
      
      item.innerHTML = `
        <div class="search-result-title">${highlightText(post.title, query)}</div>
        <div class="search-result-excerpt">${highlightText(truncateText(post.content, 100), query)}</div>
        ${metaInfo ? `<div class="search-result-meta">${metaInfo}</div>` : ''}
      `;
      
      item.addEventListener('click', () => {
        // Handle relative URLs properly
        const url = post.url.startsWith('http') ? post.url : 
                   post.url.startsWith('/') ? post.url : `/${post.url}`;
        window.location.href = url;
      });
      
      searchResults.appendChild(item);
    });
  }
  
  searchResults.classList.add('visible');
}

function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark style="background: rgba(59, 130, 246, 0.3); color: inherit;">$1</mark>');
}

function truncateText(text, length) {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Legacy page search functionality
function initPageSearch(searchInput) {
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    const articles = document.querySelectorAll('article');
    
    if (query === '') {
      articles.forEach(article => {
        article.style.display = 'block';
        article.style.opacity = '1';
      });
      return;
    }
    
    articles.forEach(article => {
      const title = article.querySelector('h2')?.textContent.toLowerCase() || '';
      const content = article.querySelector('.excerpt')?.textContent.toLowerCase() || '';
      
      if (title.includes(query) || content.includes(query)) {
        article.style.display = 'block';
        article.style.opacity = '1';
        article.style.transform = 'translateY(0)';
      } else {
        article.style.opacity = '0.3';
        article.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          if (article.style.opacity === '0.3') {
            article.style.display = 'none';
          }
        }, 300);
      }
    });
  });
}

// Performance optimization: Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Loading animation
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Keyboard navigation and accessibility
document.addEventListener('keydown', (e) => {
  // ESC key functionality
  if (e.key === 'Escape') {
    const openElements = document.querySelectorAll('.open, .active');
    openElements.forEach(el => {
      el.classList.remove('open', 'active');
    });
  }
  
  // Tab key for keyboard navigation
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});

// Initialize search when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSearch);
} else {
  initSearch();
}

// Add CSS animations and styles via JavaScript
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .keyboard-navigation *:focus {
    outline: 2px solid var(--accent) !important;
    outline-offset: 2px !important;
    border-radius: 4px;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .fade-in-up {
    animation: fadeInUp 0.6s ease forwards;
  }
`;
document.head.appendChild(dynamicStyles);

// Enhanced error handling and fallbacks
window.addEventListener('error', (e) => {
  console.warn('Theme script error:', e.error);
  // Fallback behavior if needed
});

// Page transition effects
function initPageTransitions() {
  // Only enable if page transitions are enabled
  if (!document.body.classList.contains('page-transitions')) {
    return;
  }
  
  const links = document.querySelectorAll('a:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([target="_blank"])');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.hostname === window.location.hostname) {
        e.preventDefault();
        document.body.classList.add('page-loading');
        
        setTimeout(() => {
          window.location.href = link.href;
        }, 300);
      }
    });
  });
}

// Initialize page transitions
initPageTransitions();

// Back to Top functionality
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, 100));
  
  // Smooth scroll to top when clicked
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Mobile Menu Functionality
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (!mobileToggle || !mobileMenu) return;
  
  // Toggle mobile menu
  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('active');
    
    // Update aria attributes for accessibility
    const isOpen = mobileMenu.classList.contains('active');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      mobileMenu.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close menu when pressing escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.focus();
    }
  });
  
  // Close menu when clicking on menu items
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Twitter-style Actions
function initTwitterActions() {
  // Like button animation
  const likeButtons = document.querySelectorAll('.like-action');
  likeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const icon = button.querySelector('.action-icon');
      const count = button.querySelector('.action-count');
      const currentCount = parseInt(count.textContent) || 0;
      
      // Toggle liked state
      if (button.classList.contains('liked')) {
        button.classList.remove('liked');
        count.textContent = Math.max(0, currentCount - 1);
        icon.setAttribute('data-lucide', 'heart');
      } else {
        button.classList.add('liked');
        count.textContent = currentCount + 1;
        icon.setAttribute('data-lucide', 'heart');
        
        // Add animation
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 150);
      }
      
      // Recreate icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  });
  
  // Retweet button animation
  const retweetButtons = document.querySelectorAll('.retweet-action');
  retweetButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const count = button.querySelector('.action-count');
      const currentCount = parseInt(count.textContent) || 0;
      
      // Toggle retweeted state
      if (button.classList.contains('retweeted')) {
        button.classList.remove('retweeted');
        count.textContent = Math.max(0, currentCount - 1);
      } else {
        button.classList.add('retweeted');
        count.textContent = currentCount + 1;
        
        // Add animation
        button.style.transform = 'rotate(180deg) scale(1.2)';
        setTimeout(() => {
          button.style.transform = 'rotate(0deg) scale(1)';
        }, 300);
      }
    });
  });
  
  // Reply button (just show alert for demo)
  const replyButtons = document.querySelectorAll('.reply-action');
  replyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Simple demo - in real app this would open a reply modal
      const tweetCard = button.closest('.tweet-card');
      const title = tweetCard.querySelector('.tweet-title a').textContent;
      alert(`Reply to: "${title}"`);
    });
  });
  
  // Share button (copy link)
  const shareButtons = document.querySelectorAll('.share-action');
  shareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const tweetCard = button.closest('.tweet-card');
      const link = tweetCard.querySelector('.tweet-title a').href;
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(link).then(() => {
          // Show feedback
          const originalColor = button.style.color;
          button.style.color = '#00ba7c';
          setTimeout(() => {
            button.style.color = originalColor;
          }, 1000);
        });
      }
    });
  });
  
  // Tweet card click to read
  const tweetCards = document.querySelectorAll('.tweet-card');
  tweetCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking on action buttons
      if (e.target.closest('.tweet-action') || e.target.closest('.tweet-menu-btn')) {
        return;
      }
      
      const link = card.querySelector('.tweet-title a');
      if (link) {
        window.location.href = link.href;
      }
    });
  });
}

// Reading Widgets Functions
function initReadingWidgets() {
  generateTableOfContents();
  initReadingProgress();
  initContextActions();
  calculateReadingStats();
  setupStickyWidgets();
}

// Setup sticky positioning for widgets after TOC
function setupStickyWidgets() {
  const tocWidget = document.querySelector('.post-page .widget.toc-widget');
  const infoWidget = document.querySelector('.post-page .widget.info-widget');
  
  if (!tocWidget || !infoWidget) return;
  
  function updateStickyPositions() {
    const tocHeight = tocWidget.offsetHeight;
    const tocTop = 80; // 5rem = 80px
    const margin = 24; // 1.5rem = 24px
    
    // Set info widget to stick right after TOC
    const infoWidgetTop = tocTop + tocHeight + margin;
    infoWidget.style.top = `${infoWidgetTop}px`;
    
    // Check if info widget would go below viewport
    const maxTop = window.innerHeight - infoWidget.offsetHeight - 20;
    if (infoWidgetTop > maxTop) {
      infoWidget.style.top = `${maxTop}px`;
    }
  }
  
  // Update positions initially and on window resize
  updateStickyPositions();
  window.addEventListener('resize', throttle(updateStickyPositions, 100));
  
  // Also update when TOC content changes (after it's generated)
  setTimeout(updateStickyPositions, 100);
}

// Generate Table of Contents
function generateTableOfContents() {
  const tocContainer = document.getElementById('table-of-contents');
  if (!tocContainer) return;
  
  const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4');
  if (headings.length === 0) {
    tocContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.875rem;">此文章沒有標題</p>';
    return;
  }
  
  const tocList = document.createElement('ul');
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1));
    const id = heading.id || `heading-${index}`;
    
    if (!heading.id) {
      heading.id = id;
    }
    
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = heading.textContent;
    link.className = `toc-level-${level}`;
    
    listItem.appendChild(link);
    tocList.appendChild(listItem);
    
    // Add click handler for smooth scroll
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update active state
        document.querySelectorAll('.toc-nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
  
  tocContainer.appendChild(tocList);
  updateTOCActiveState();
}

// Update TOC active state based on scroll position
function updateTOCActiveState() {
  const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4');
  const tocLinks = document.querySelectorAll('.toc-nav a');
  const tocNav = document.querySelector('.toc-nav');
  
  if (!headings.length || !tocLinks.length) return;
  
  window.addEventListener('scroll', throttle(() => {
    const scrollPos = window.scrollY + 150; // Offset for header height
    
    let activeHeading = null;
    let currentIndex = -1;
    
    // Find the current heading
    headings.forEach((heading, index) => {
      if (heading.offsetTop <= scrollPos) {
        activeHeading = heading;
        currentIndex = index;
      }
    });
    
    // Remove all active states
    tocLinks.forEach(link => link.classList.remove('active'));
    
    // Add active state to current section
    if (activeHeading) {
      const activeLink = document.querySelector(`.toc-nav a[href="#${activeHeading.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        
        // Auto-scroll TOC to keep active item visible
        if (tocNav) {
          const linkRect = activeLink.getBoundingClientRect();
          const navRect = tocNav.getBoundingClientRect();
          
          if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
            activeLink.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            });
          }
        }
      }
    }
  }, 100));
}

// Reading Progress
function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress-bar');
  
  if (!progressBar) return;
  
  window.addEventListener('scroll', throttle(() => {
    const article = document.querySelector('.post-content');
    if (!article) return;
    
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    
    // Accurate progress calculation considering page scroll limits
    const articleBottom = articleTop + articleHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScrollTop = documentHeight - windowHeight;
    
    // Debug information
    console.log('=== Reading Progress Debug ===');
    console.log('scrollTop:', scrollTop);
    console.log('windowHeight:', windowHeight);
    console.log('articleTop:', articleTop);
    console.log('articleHeight:', articleHeight);
    console.log('articleBottom:', articleBottom);
    console.log('documentHeight:', documentHeight);
    console.log('maxScrollTop:', maxScrollTop);
    console.log('isAtBottom:', scrollTop >= maxScrollTop - 10);
    
    let progress = 0;
    
    // If we've reached the bottom of the page, always show 100%
    if (scrollTop >= maxScrollTop - 10) {
      progress = 100;
    } else if (scrollTop < articleTop) {
      // Before the article starts
      progress = 0;
    } else {
      // Calculate progress based on article reading
      // But consider the reading area (from article start to when article bottom is at viewport center)
      const readingEndPoint = Math.min(articleBottom - windowHeight/2, maxScrollTop);
      const readingDistance = readingEndPoint - articleTop;
      
      if (readingDistance <= 0) {
        // Very short article
        progress = 100;
      } else {
        const scrolledIntoReading = scrollTop - articleTop;
        progress = (scrolledIntoReading / readingDistance) * 100;
      }
    }
    
    progress = Math.max(0, Math.min(100, progress));
    
    console.log('readingEndPoint:', Math.min(articleBottom - windowHeight/2, maxScrollTop));
    console.log('calculated progress:', progress);
    console.log('=========================');
    
    progressBar.style.width = `${progress}%`;
  }, 50));
}

// Context Actions
function initContextActions() {
  // Scroll to top
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // Share article
  const shareBtn = document.getElementById('share-article');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const originalText = shareBtn.querySelector('.action-text').textContent;
          shareBtn.querySelector('.action-text').textContent = '已複製!';
          setTimeout(() => {
            shareBtn.querySelector('.action-text').textContent = originalText;
          }, 2000);
        });
      }
    });
  }
  
  // Bookmark article
  const bookmarkBtn = document.getElementById('bookmark-article');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      const article = {
        title: document.title,
        url: window.location.href,
        date: new Date().toISOString()
      };
      
      const existingIndex = bookmarks.findIndex(b => b.url === article.url);
      if (existingIndex >= 0) {
        bookmarks.splice(existingIndex, 1);
        bookmarkBtn.querySelector('.action-text').textContent = '收藏';
      } else {
        bookmarks.push(article);
        bookmarkBtn.querySelector('.action-text').textContent = '已收藏';
      }
      
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    });
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (bookmarks.some(b => b.url === window.location.href)) {
      bookmarkBtn.querySelector('.action-text').textContent = '已收藏';
    }
  }
  
  // Print article
  const printBtn = document.getElementById('print-article');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
  
  // Reading mode toggle
  const readingModeBtn = document.getElementById('toggle-reading-mode');
  if (readingModeBtn) {
    readingModeBtn.addEventListener('click', () => {
      document.body.classList.toggle('reading-mode');
      const isReading = document.body.classList.contains('reading-mode');
      readingModeBtn.querySelector('.action-text').textContent = isReading ? '退出專注' : '專注模式';
    });
  }
}

// Calculate Reading Stats
function calculateReadingStats() {
  const content = document.querySelector('.post-content');
  if (!content) return;
  
  const text = content.textContent || content.innerText;
  const wordCount = text.length;
  const readingTime = Math.ceil(wordCount / 300);
  
  const wordCountElement = document.getElementById('word-count');
  const readingTimeElement = document.getElementById('reading-time');
  
  if (wordCountElement) {
    wordCountElement.textContent = `${wordCount.toLocaleString()} 字`;
  }
  
  if (readingTimeElement) {
    readingTimeElement.textContent = `約 ${readingTime} 分鐘`;
  }
}

// Sidebar Navigation
function initSidebarNavigation() {
  // Update active states for category links
  const currentPath = window.location.pathname;
  const categoryLinks = document.querySelectorAll('.category-link, .nav-link');
  
  categoryLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // Remove existing active classes
    link.classList.remove('active');
    
    // Add active class for current page
    if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
      link.classList.add('active');
    }
  });
  
  // Smooth scroll to top when clicking category links
  const internalLinks = document.querySelectorAll('.category-link[href^="/"], .nav-link[href^="/"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Small delay to ensure page loads first
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
  });
}