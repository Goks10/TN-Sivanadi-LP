document.addEventListener('DOMContentLoaded', function() {

  // --- 0. YOUTUBE FACADE (lazy-load iframes) ---
  document.querySelectorAll('iframe[data-src*="youtube"]').forEach(function(iframe) {
    var dataSrc = iframe.getAttribute('data-src');
    var match = dataSrc.match(/embed\/([^?/]+)/);
    if (!match) return;

    var videoId = match[1];
    var wrapper = iframe.parentElement;

    var facade = document.createElement('div');
    facade.className = 'yt-facade';
    facade.style.backgroundImage = 'url(https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg)';
    facade.innerHTML =
      '<button class="yt-play-btn" aria-label="Play video">' +
        '<svg viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M66.5 7.7c-.8-2.9-3-5.1-5.8-5.8C55.8 0 34 0 34 0S12.2 0 7.3 1.9C4.6 2.6 2.4 4.8 1.6 7.7 0 12.6 0 24 0 24s0 11.4 1.6 16.3c.8 2.9 3 5.1 5.8 5.8C12.2 48 34 48 34 48s21.8 0 26.7-1.9c2.8-.8 5-3 5.8-5.8C68 35.4 68 24 68 24s0-11.4-1.5-16.3z" fill="#ff0000"/>' +
          '<path d="M45 24L27 14v20" fill="#fff"/>' +
        '</svg>' +
      '</button>';

    facade.addEventListener('click', function() {
      var autoSrc = dataSrc.includes('?') ? dataSrc + '&autoplay=1' : dataSrc + '?autoplay=1';
      iframe.setAttribute('src', autoSrc);
      wrapper.replaceChild(iframe, facade);
    });

    wrapper.replaceChild(facade, iframe);
  });

  // --- 1. FAQ ACCORDION INTERACTION ---
  const faqHeaders = document.querySelectorAll('.faq-header');
  
  if (faqHeaders.length > 0) {
    faqHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const body = header.nextElementSibling;
        const isActive = item.classList.contains('active');
        
        // Close other accordion items for neatness on mobile
        document.querySelectorAll('.faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-body').style.maxHeight = null;
          }
        });
        
        // Toggle current accordion
        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = null;
        } else {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }
});
