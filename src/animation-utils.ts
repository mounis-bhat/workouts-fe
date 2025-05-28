// Typing Animation Utility
export function typeWriter(node: HTMLElement, { text = '', speed = 50, delay = 0 }) {
  let currentText = '';
  let currentIndex = 0;
  
  const timeout = setTimeout(() => {
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        node.textContent = currentText;
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);
  }, delay);

  return {
    destroy() {
      clearTimeout(timeout);
    }
  };
}

// Stagger Animation Utility
export function staggerReveal(node: HTMLElement, { delay = 0, stagger = 100 }) {
  const children = Array.from(node.children) as HTMLElement[];
  
  children.forEach((child, index) => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(30px)';
    child.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
      child.style.opacity = '1';
      child.style.transform = 'translateY(0)';
    }, delay + (index * stagger));
  });

  return {
    destroy() {
      children.forEach(child => {
        child.style.removeProperty('opacity');
        child.style.removeProperty('transform');
        child.style.removeProperty('transition');
      });
    }
  };
}

// Counter Animation Utility
export function countUp(node: HTMLElement, { start = 0, end = 100, duration = 2000, delay = 0 }) {
  const startTime = Date.now() + delay;
  const range = end - start;
  
  const animate = () => {
    const now = Date.now();
    const elapsed = Math.max(0, now - startTime);
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (range * easeOutCubic));
    
    node.textContent = current.toString();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  setTimeout(() => {
    requestAnimationFrame(animate);
  }, delay);

  return {
    destroy() {
      // Cleanup if needed
    }
  };
}

// Intersection Observer for scroll animations
export function revealOnScroll(node: HTMLElement, { threshold = 0.1, rootMargin = '0px' } = {}) {
  if (typeof IntersectionObserver === 'undefined') {
    return {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold, rootMargin }
  );

  node.classList.add('reveal-on-scroll');
  observer.observe(node);

  return {
    destroy() {
      observer.unobserve(node);
    }
  };
}
