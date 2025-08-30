/**
 * Screen Reader Optimization for Material 3 Components
 * 
 * Comprehensive screen reader support with optimized announcements,
 * semantic markup, and NVDA/JAWS/VoiceOver compatibility.
 */

/**
 * Screen reader types and their characteristics
 */
export const ScreenReaderTypes = {
  NVDA: {
    name: 'NVDA',
    announceDelay: 100,
    supportsLiveRegions: true,
    preferredMarkup: 'semantic'
  },
  JAWS: {
    name: 'JAWS',
    announceDelay: 150,
    supportsLiveRegions: true,
    preferredMarkup: 'semantic'
  },
  VOICEOVER: {
    name: 'VoiceOver',
    announceDelay: 100,
    supportsLiveRegions: true,
    preferredMarkup: 'aria'
  },
  DRAGON: {
    name: 'Dragon NaturallySpeaking',
    announceDelay: 0,
    supportsLiveRegions: false,
    preferredMarkup: 'semantic'
  }
} as const;

/**
 * Live region politeness levels
 */
export type LiveRegionPoliteness = 'off' | 'polite' | 'assertive';

/**
 * Screen reader announcement priority
 */
export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Announcement queue item
 */
interface AnnouncementItem {
  message: string;
  priority: AnnouncementPriority;
  timestamp: number;
  politeness: LiveRegionPoliteness;
  delay?: number;
}

/**
 * Screen reader announcement manager
 */
export class ScreenReaderAnnouncementManager {
  private politeRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;
  private queue: AnnouncementItem[] = [];
  private isProcessing: boolean = false;
  private lastAnnouncement: string = '';
  private lastAnnouncementTime: number = 0;

  constructor() {
    this.createLiveRegions();
  }

  /**
   * Create live regions for announcements
   */
  private createLiveRegions(): void {
    // Polite live region
    this.politeRegion = document.createElement('div');
    this.politeRegion.setAttribute('aria-live', 'polite');
    this.politeRegion.setAttribute('aria-atomic', 'true');
    this.politeRegion.setAttribute('aria-relevant', 'additions text');
    this.politeRegion.id = 'm3-sr-polite-region';
    this.setupLiveRegionStyles(this.politeRegion);

    // Assertive live region
    this.assertiveRegion = document.createElement('div');
    this.assertiveRegion.setAttribute('aria-live', 'assertive');
    this.assertiveRegion.setAttribute('aria-atomic', 'true');
    this.assertiveRegion.setAttribute('aria-relevant', 'additions text');
    this.assertiveRegion.id = 'm3-sr-assertive-region';
    this.setupLiveRegionStyles(this.assertiveRegion);

    // Add to DOM
    document.body.appendChild(this.politeRegion);
    document.body.appendChild(this.assertiveRegion);
  }

  /**
   * Setup visually hidden styles for live regions
   */
  private setupLiveRegionStyles(element: HTMLElement): void {
    element.style.position = 'absolute';
    element.style.left = '-10000px';
    element.style.top = '-10000px';
    element.style.width = '1px';
    element.style.height = '1px';
    element.style.overflow = 'hidden';
    element.style.clip = 'rect(1px, 1px, 1px, 1px)';
    element.style.clipPath = 'inset(50%)';
    element.style.whiteSpace = 'nowrap';
  }

  /**
   * Add announcement to queue
   */
  public announce(
    message: string,
    priority: AnnouncementPriority = 'medium',
    politeness: LiveRegionPoliteness = 'polite',
    delay?: number
  ): void {
    // Avoid duplicate announcements
    const now = Date.now();
    if (message === this.lastAnnouncement && now - this.lastAnnouncementTime < 1000) {
      return;
    }

    const announcement: AnnouncementItem = {
      message: message.trim(),
      priority,
      timestamp: now,
      politeness,
      delay
    };

    // Insert based on priority
    this.insertByPriority(announcement);
    this.processQueue();
  }

  /**
   * Insert announcement into queue based on priority
   */
  private insertByPriority(announcement: AnnouncementItem): void {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const announcementPriority = priorityOrder[announcement.priority];

    let insertIndex = this.queue.length;
    for (let i = 0; i < this.queue.length; i++) {
      const queueItemPriority = priorityOrder[this.queue[i]?.priority || 'medium'];
      if (announcementPriority > queueItemPriority) {
        insertIndex = i;
        break;
      }
    }

    this.queue.splice(insertIndex, 0, announcement);
  }

  /**
   * Process announcement queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const announcement = this.queue.shift();
      if (!announcement) continue;

      await this.performAnnouncement(announcement);
    }

    this.isProcessing = false;
  }

  /**
   * Perform actual announcement
   */
  private async performAnnouncement(announcement: AnnouncementItem): Promise<void> {
    const region = announcement.politeness === 'assertive' 
      ? this.assertiveRegion 
      : this.politeRegion;

    if (!region) return;

    // Apply delay if specified
    if (announcement.delay) {
      await new Promise(resolve => setTimeout(resolve, announcement.delay));
    }

    // Clear region first
    region.textContent = '';

    // Wait a frame then add content
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    region.textContent = announcement.message;
    this.lastAnnouncement = announcement.message;
    this.lastAnnouncementTime = announcement.timestamp;

    // Clear after announcement
    setTimeout(() => {
      if (region.textContent === announcement.message) {
        region.textContent = '';
      }
    }, 1000);
  }

  /**
   * Clear all announcements
   */
  public clear(): void {
    this.queue = [];
    if (this.politeRegion) this.politeRegion.textContent = '';
    if (this.assertiveRegion) this.assertiveRegion.textContent = '';
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.clear();
    if (this.politeRegion?.parentNode) {
      this.politeRegion.parentNode.removeChild(this.politeRegion);
    }
    if (this.assertiveRegion?.parentNode) {
      this.assertiveRegion.parentNode.removeChild(this.assertiveRegion);
    }
  }
}

/**
 * Global screen reader manager instance
 */
export const screenReaderManager = new ScreenReaderAnnouncementManager();

/**
 * Screen reader optimized content generators
 */
export const ScreenReaderContent = {
  /**
   * Generate loading announcement
   */
  loading: (context?: string): string => {
    return context ? `Loading ${context}...` : 'Loading...';
  },

  /**
   * Generate completion announcement
   */
  completed: (action: string, result?: string): string => {
    const base = `${action} completed`;
    return result ? `${base}. ${result}` : base;
  },

  /**
   * Generate error announcement
   */
  error: (error: string, context?: string): string => {
    const base = `Error: ${error}`;
    return context ? `${base} in ${context}` : base;
  },

  /**
   * Generate navigation announcement
   */
  navigation: (destination: string, position?: { current: number; total: number }): string => {
    let announcement = `Navigated to ${destination}`;
    if (position) {
      announcement += `. Item ${position.current} of ${position.total}`;
    }
    return announcement;
  },

  /**
   * Generate state change announcement
   */
  stateChange: (element: string, oldState: string, newState: string): string => {
    return `${element} changed from ${oldState} to ${newState}`;
  },

  /**
   * Generate form validation announcement
   */
  validation: (fieldName: string, isValid: boolean, message?: string): string => {
    if (isValid) {
      return `${fieldName} is valid`;
    } else {
      return message ? `${fieldName} error: ${message}` : `${fieldName} is invalid`;
    }
  },

  /**
   * Generate selection announcement
   */
  selection: (items: string[], action: 'selected' | 'deselected' = 'selected'): string => {
    if (items.length === 1) {
      return `${items[0]} ${action}`;
    } else if (items.length > 1) {
      return `${items.length} items ${action}`;
    }
    return `Nothing ${action}`;
  },

  /**
   * Generate progress announcement
   */
  progress: (value: number, max: number = 100, label?: string): string => {
    const percentage = Math.round((value / max) * 100);
    const base = `Progress: ${percentage}%`;
    return label ? `${label} ${base}` : base;
  }
} as const;

/**
 * Semantic markup utilities for screen readers
 */
export const SemanticMarkup = {
  /**
   * Create semantic heading structure
   */
  createHeading: (level: 1 | 2 | 3 | 4 | 5 | 6, text: string, id?: string): HTMLElement => {
    const heading = document.createElement(`h${level}`);
    heading.textContent = text;
    if (id) heading.id = id;
    return heading;
  },

  /**
   * Create landmark regions
   */
  createLandmark: (role: 'main' | 'navigation' | 'banner' | 'contentinfo' | 'complementary' | 'region', label?: string): HTMLElement => {
    const element = document.createElement('div');
    element.setAttribute('role', role);
    if (label) element.setAttribute('aria-label', label);
    return element;
  },

  /**
   * Create list with proper semantics
   */
  createList: (
    items: Array<{ text: string; element?: HTMLElement }>,
    ordered: boolean = false,
    description?: string
  ): HTMLElement => {
    const list = document.createElement(ordered ? 'ol' : 'ul');
    
    if (description) {
      list.setAttribute('aria-label', description);
    }

    items.forEach(item => {
      const li = document.createElement('li');
      if (item.element) {
        li.appendChild(item.element);
      } else {
        li.textContent = item.text;
      }
      list.appendChild(li);
    });

    return list;
  },

  /**
   * Create table with proper headers
   */
  createTable: (
    headers: string[],
    rows: string[][],
    caption?: string
  ): HTMLElement => {
    const table = document.createElement('table');
    table.setAttribute('role', 'table');

    if (caption) {
      const captionElement = document.createElement('caption');
      captionElement.textContent = caption;
      table.appendChild(captionElement);
    }

    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      th.setAttribute('scope', 'col');
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');
    rows.forEach(rowData => {
      const row = document.createElement('tr');
      rowData.forEach(cellData => {
        const td = document.createElement('td');
        td.textContent = cellData;
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    return table;
  }
} as const;

/**
 * Material 3 specific screen reader patterns
 */
export const Material3ScreenReaderPatterns = {
  /**
   * Setup FAB announcements
   */
  setupFAB: (fabElement: HTMLElement, action: string): void => {
    fabElement.addEventListener('click', () => {
      screenReaderManager.announce(
        ScreenReaderContent.completed(action),
        'medium',
        'polite'
      );
    });
  },

  /**
   * Setup navigation rail announcements
   */
  setupNavigationRail: (railElement: HTMLElement): void => {
    const navigationItems = railElement.querySelectorAll('[role="button"], button, a');
    
    navigationItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        const label = item.getAttribute('aria-label') || (item as HTMLElement).textContent || 'Navigation item';
        screenReaderManager.announce(
          ScreenReaderContent.navigation(label, { current: index + 1, total: navigationItems.length }),
          'medium',
          'polite'
        );
      });
    });
  },

  /**
   * Setup bottom navigation announcements
   */
  setupBottomNavigation: (navElement: HTMLElement): void => {
    const tabs = navElement.querySelectorAll('[role="tab"]');
    
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        const label = tab.getAttribute('aria-label') || (tab as HTMLElement).textContent || 'Tab';
        screenReaderManager.announce(
          ScreenReaderContent.navigation(label, { current: index + 1, total: tabs.length }),
          'medium',
          'polite'
        );
      });
    });
  },

  /**
   * Setup dialog announcements
   */
  setupDialog: (dialogElement: HTMLElement, title: string): void => {
    // Announce when dialog opens
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'open') {
          const isOpen = dialogElement.hasAttribute('open') || 
                        dialogElement.style.display !== 'none';
          
          if (isOpen) {
            screenReaderManager.announce(
              `Dialog opened: ${title}`,
              'high',
              'assertive',
              100
            );
          }
        }
      });
    });

    observer.observe(dialogElement, { attributes: true });

    // Setup close announcements
    const closeButtons = dialogElement.querySelectorAll('[aria-label*="close"], [data-dismiss="dialog"]');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        screenReaderManager.announce(
          'Dialog closed',
          'medium',
          'polite'
        );
      });
    });
  },

  /**
   * Setup form field announcements
   */
  setupFormField: (fieldElement: HTMLElement, fieldName: string): void => {
    // Focus announcements
    fieldElement.addEventListener('focus', () => {
      const instructions = fieldElement.getAttribute('aria-describedby');
      if (instructions) {
        const instructionElement = document.getElementById(instructions);
        if (instructionElement) {
          screenReaderManager.announce(
            instructionElement.textContent || '',
            'low',
            'polite',
            500
          );
        }
      }
    });

    // Validation announcements
    fieldElement.addEventListener('invalid', () => {
      const errorMessage = fieldElement.getAttribute('aria-describedby');
      let message = `${fieldName} is invalid`;
      
      if (errorMessage) {
        const errorElement = document.getElementById(errorMessage);
        if (errorElement) {
          message = errorElement.textContent || message;
        }
      }

      screenReaderManager.announce(
        ScreenReaderContent.validation(fieldName, false, message),
        'high',
        'assertive'
      );
    });

    // Success announcements
    fieldElement.addEventListener('change', () => {
      if ((fieldElement as HTMLInputElement).checkValidity?.()) {
        screenReaderManager.announce(
          ScreenReaderContent.validation(fieldName, true),
          'low',
          'polite'
        );
      }
    });
  },

  /**
   * Setup loading state announcements
   */
  setupLoadingStates: (container: HTMLElement): void => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-busy') {
          const isBusy = (mutation.target as HTMLElement).getAttribute('aria-busy') === 'true';
          const label = (mutation.target as HTMLElement).getAttribute('aria-label') || 'Content';
          
          if (isBusy) {
            screenReaderManager.announce(
              ScreenReaderContent.loading(label),
              'medium',
              'polite'
            );
          } else {
            screenReaderManager.announce(
              ScreenReaderContent.completed('Loading'),
              'medium',
              'polite'
            );
          }
        }
      });
    });

    observer.observe(container, { 
      attributes: true, 
      subtree: true, 
      attributeFilter: ['aria-busy'] 
    });
  }
} as const;

/**
 * Screen reader testing utilities
 */
export const ScreenReaderTesting = {
  /**
   * Simulate screen reader navigation
   */
  simulateTabNavigation: (container: HTMLElement): HTMLElement[] => {
    const focusableElements = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const navigationOrder: HTMLElement[] = [];
    
    focusableElements.forEach(element => {
      if (element instanceof HTMLElement && element.offsetParent !== null) {
        navigationOrder.push(element);
      }
    });

    return navigationOrder.sort((a, b) => {
      const aTabIndex = parseInt(a.getAttribute('tabindex') || '0');
      const bTabIndex = parseInt(b.getAttribute('tabindex') || '0');
      
      if (aTabIndex !== bTabIndex) {
        return aTabIndex - bTabIndex;
      }
      
      // DOM order for elements with same tabindex
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
  },

  /**
   * Test heading structure
   */
  testHeadingStructure: (container: HTMLElement): Array<{level: number, text: string, issues: string[]}> => {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const structure: Array<{level: number, text: string, issues: string[]}> = [];
    let previousLevel = 0;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent || '';
      const issues: string[] = [];

      // Check for heading level skipping
      if (level > previousLevel + 1) {
        issues.push(`Heading level skipped from h${previousLevel} to h${level}`);
      }

      // Check for empty headings
      if (!text.trim()) {
        issues.push('Heading is empty');
      }

      structure.push({ level, text, issues });
      previousLevel = level;
    });

    return structure;
  },

  /**
   * Test landmark structure
   */
  testLandmarks: (container: HTMLElement): Array<{element: HTMLElement, role: string, label?: string, issues: string[]}> => {
    const landmarks = container.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"], main, nav, header, footer, aside');
    const landmarkData: Array<{element: HTMLElement, role: string, label?: string, issues: string[]}> = [];

    landmarks.forEach(landmark => {
      const element = landmark as HTMLElement;
      const role = element.getAttribute('role') || element.tagName.toLowerCase();
      const label = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby');
      const issues: string[] = [];

      // Check for region without label
      if (role === 'region' && !label) {
        issues.push('Region landmark should have a label');
      }

      landmarkData.push({ element, role, label: label || undefined, issues });
    });

    return landmarkData;
  }
} as const;