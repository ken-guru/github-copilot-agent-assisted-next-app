/**
 * Keyboard Navigation System for Material 3 Components
 * 
 * Comprehensive keyboard navigation support with Material 3 design patterns,
 * including spatial navigation, focus management, and keyboard shortcuts.
 */

/**
 * Keyboard event codes and their meanings
 */
export const KeyCodes = {
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12'
} as const;

/**
 * Navigation direction types
 */
export type NavigationDirection = 'horizontal' | 'vertical' | 'grid' | 'both';

/**
 * Keyboard navigation configuration
 */
export interface KeyboardNavigationConfig {
  direction: NavigationDirection;
  wrap: boolean;
  skipDisabled: boolean;
  activateOnEnter: boolean;
  activateOnSpace: boolean;
  homeEndSupport: boolean;
  pageUpDownSupport: boolean;
  typeAhead: boolean;
  customKeys?: Record<string, (event: KeyboardEvent, element: HTMLElement) => void>;
}

/**
 * Default navigation configuration
 */
const defaultNavigationConfig: KeyboardNavigationConfig = {
  direction: 'vertical',
  wrap: true,
  skipDisabled: true,
  activateOnEnter: true,
  activateOnSpace: false,
  homeEndSupport: true,
  pageUpDownSupport: false,
  typeAhead: false
};

/**
 * Focusable element selector
 */
const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details',
  'summary',
  '[role="button"]:not([aria-disabled="true"])',
  '[role="tab"]:not([aria-disabled="true"])',
  '[role="menuitem"]:not([aria-disabled="true"])',
  '[role="option"]:not([aria-disabled="true"])'
].join(', ');

/**
 * Keyboard navigation utility class
 */
export class KeyboardNavigator {
  private container: HTMLElement;
  private config: KeyboardNavigationConfig;
  private focusableElements: HTMLElement[] = [];
  private currentIndex: number = -1;
  private typeAheadBuffer: string = '';
  private typeAheadTimeout: number | null = null;

  constructor(container: HTMLElement, config: Partial<KeyboardNavigationConfig> = {}) {
    this.container = container;
    this.config = { ...defaultNavigationConfig, ...config };
    
    this.updateFocusableElements();
    this.attachEventListeners();
  }

  /**
   * Update the list of focusable elements
   */
  private updateFocusableElements(): void {
    const elements = Array.from(
      this.container.querySelectorAll(FOCUSABLE_SELECTOR)
    ) as HTMLElement[];

    this.focusableElements = elements.filter(element => {
      if (this.config.skipDisabled) {
        return !element.hasAttribute('disabled') && 
               element.getAttribute('aria-disabled') !== 'true' &&
               element.offsetParent !== null; // Visible elements only
      }
      return element.offsetParent !== null;
    });
  }

  /**
   * Get the index of the currently focused element
   */
  private getCurrentIndex(): number {
    const activeElement = document.activeElement as HTMLElement;
    return this.focusableElements.indexOf(activeElement);
  }

  /**
   * Move focus to element at specific index
   */
  private focusElementAt(index: number): void {
    if (index >= 0 && index < this.focusableElements.length) {
      this.focusableElements[index]?.focus();
      this.currentIndex = index;
    }
  }

  /**
   * Get next index based on direction and wrapping
   */
  private getNextIndex(currentIndex: number, direction: 'next' | 'previous'): number {
    const length = this.focusableElements.length;
    if (length === 0) return -1;

    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (this.config.wrap) {
      if (nextIndex >= length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = length - 1;
    } else {
      if (nextIndex >= length) nextIndex = length - 1;
      if (nextIndex < 0) nextIndex = 0;
    }

    return nextIndex;
  }

  /**
   * Handle arrow key navigation
   */
  private handleArrowKey(key: string): void {
    const currentIndex = this.getCurrentIndex();
    let nextIndex = -1;

    switch (this.config.direction) {
      case 'horizontal':
        if (key === KeyCodes.ARROW_LEFT) {
          nextIndex = this.getNextIndex(currentIndex, 'previous');
        } else if (key === KeyCodes.ARROW_RIGHT) {
          nextIndex = this.getNextIndex(currentIndex, 'next');
        }
        break;

      case 'vertical':
        if (key === KeyCodes.ARROW_UP) {
          nextIndex = this.getNextIndex(currentIndex, 'previous');
        } else if (key === KeyCodes.ARROW_DOWN) {
          nextIndex = this.getNextIndex(currentIndex, 'next');
        }
        break;

      case 'both':
        if (key === KeyCodes.ARROW_UP || key === KeyCodes.ARROW_LEFT) {
          nextIndex = this.getNextIndex(currentIndex, 'previous');
        } else if (key === KeyCodes.ARROW_DOWN || key === KeyCodes.ARROW_RIGHT) {
          nextIndex = this.getNextIndex(currentIndex, 'next');
        }
        break;

      case 'grid':
        // Grid navigation requires more complex logic
        this.handleGridNavigation(key, currentIndex);
        return;
    }

    if (nextIndex !== -1) {
      this.focusElementAt(nextIndex);
    }
  }

  /**
   * Handle grid-based navigation
   */
  private handleGridNavigation(key: string, currentIndex: number): void {
    // This is a simplified grid navigation - would need column count for full implementation
    const element = this.focusableElements[currentIndex];
    if (!element) return;

    const rect = element.getBoundingClientRect();
    let targetElement: HTMLElement | null = null;

    switch (key) {
      case KeyCodes.ARROW_UP:
        targetElement = this.findElementInDirection(rect, 'up');
        break;
      case KeyCodes.ARROW_DOWN:
        targetElement = this.findElementInDirection(rect, 'down');
        break;
      case KeyCodes.ARROW_LEFT:
        targetElement = this.findElementInDirection(rect, 'left');
        break;
      case KeyCodes.ARROW_RIGHT:
        targetElement = this.findElementInDirection(rect, 'right');
        break;
    }

    if (targetElement) {
      const targetIndex = this.focusableElements.indexOf(targetElement);
      if (targetIndex !== -1) {
        this.focusElementAt(targetIndex);
      }
    }
  }

  /**
   * Find the closest element in a specific direction
   */
  private findElementInDirection(
    fromRect: DOMRect, 
    direction: 'up' | 'down' | 'left' | 'right'
  ): HTMLElement | null {
    let bestElement: HTMLElement | null = null;
    let bestDistance = Infinity;

    for (const element of this.focusableElements) {
      const rect = element.getBoundingClientRect();
      
      // Check if element is in the correct direction
      let isInDirection = false;
      let distance = 0;

      switch (direction) {
        case 'up':
          isInDirection = rect.bottom <= fromRect.top;
          distance = fromRect.top - rect.bottom;
          break;
        case 'down':
          isInDirection = rect.top >= fromRect.bottom;
          distance = rect.top - fromRect.bottom;
          break;
        case 'left':
          isInDirection = rect.right <= fromRect.left;
          distance = fromRect.left - rect.right;
          break;
        case 'right':
          isInDirection = rect.left >= fromRect.right;
          distance = rect.left - fromRect.right;
          break;
      }

      if (isInDirection && distance < bestDistance) {
        bestDistance = distance;
        bestElement = element;
      }
    }

    return bestElement;
  }

  /**
   * Handle Home/End keys
   */
  private handleHomeEnd(key: string): void {
    if (!this.config.homeEndSupport) return;

    if (key === KeyCodes.HOME) {
      this.focusElementAt(0);
    } else if (key === KeyCodes.END) {
      this.focusElementAt(this.focusableElements.length - 1);
    }
  }

  /**
   * Handle Page Up/Down keys
   */
  private handlePageUpDown(key: string): void {
    if (!this.config.pageUpDownSupport) return;

    const currentIndex = this.getCurrentIndex();
    const pageSize = Math.max(1, Math.floor(this.focusableElements.length / 10));

    if (key === KeyCodes.PAGE_UP) {
      const newIndex = Math.max(0, currentIndex - pageSize);
      this.focusElementAt(newIndex);
    } else if (key === KeyCodes.PAGE_DOWN) {
      const newIndex = Math.min(this.focusableElements.length - 1, currentIndex + pageSize);
      this.focusElementAt(newIndex);
    }
  }

  /**
   * Handle type-ahead search
   */
  private handleTypeAhead(key: string): void {
    if (!this.config.typeAhead) return;

    // Clear existing timeout
    if (this.typeAheadTimeout) {
      clearTimeout(this.typeAheadTimeout);
    }

    // Add character to buffer
    this.typeAheadBuffer += key.toLowerCase();

    // Search for matching element
    const currentIndex = this.getCurrentIndex();
    let searchIndex = (currentIndex + 1) % this.focusableElements.length;
    let found = false;

    for (let i = 0; i < this.focusableElements.length; i++) {
      const element = this.focusableElements[searchIndex];
      if (!element) continue;
      
      const text = (element.textContent || element.getAttribute('aria-label') || '').toLowerCase();

      if (text.startsWith(this.typeAheadBuffer)) {
        this.focusElementAt(searchIndex);
        found = true;
        break;
      }

      searchIndex = (searchIndex + 1) % this.focusableElements.length;
    }

    // Clear buffer after timeout
    this.typeAheadTimeout = window.setTimeout(() => {
      this.typeAheadBuffer = '';
      this.typeAheadTimeout = null;
    }, 1000);
  }

  /**
   * Handle activation keys (Enter/Space)
   */
  private handleActivation(key: string): void {
    const currentElement = document.activeElement as HTMLElement;
    if (!currentElement) return;

    const shouldActivate = 
      (key === KeyCodes.ENTER && this.config.activateOnEnter) ||
      (key === KeyCodes.SPACE && this.config.activateOnSpace);

    if (shouldActivate) {
      // Check if element has a click handler or is naturally clickable
      if (currentElement.click && typeof currentElement.click === 'function') {
        currentElement.click();
      } else {
        // Dispatch a click event
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        });
        currentElement.dispatchEvent(clickEvent);
      }
    }
  }

  /**
   * Main keyboard event handler
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    const { key, altKey, ctrlKey, metaKey, shiftKey } = event;

    // Skip if modifier keys are pressed (except Shift for Shift+Tab)
    if ((altKey || ctrlKey || metaKey) && !(key === KeyCodes.TAB && shiftKey)) {
      return;
    }

    // Update focusable elements list
    this.updateFocusableElements();

    // Handle custom keys first
    if (this.config.customKeys && this.config.customKeys[key]) {
      event.preventDefault();
      this.config.customKeys[key](event, event.target as HTMLElement);
      return;
    }

    // Handle different key types
    switch (key) {
      case KeyCodes.ARROW_UP:
      case KeyCodes.ARROW_DOWN:
      case KeyCodes.ARROW_LEFT:
      case KeyCodes.ARROW_RIGHT:
        event.preventDefault();
        this.handleArrowKey(key);
        break;

      case KeyCodes.HOME:
      case KeyCodes.END:
        event.preventDefault();
        this.handleHomeEnd(key);
        break;

      case KeyCodes.PAGE_UP:
      case KeyCodes.PAGE_DOWN:
        event.preventDefault();
        this.handlePageUpDown(key);
        break;

      case KeyCodes.ENTER:
      case KeyCodes.SPACE:
        if (event.target !== this.container) {
          this.handleActivation(key);
          if (key === KeyCodes.SPACE && this.config.activateOnSpace) {
            event.preventDefault();
          }
        }
        break;

      default:
        // Handle type-ahead for printable characters
        if (key.length === 1 && !ctrlKey && !altKey && !metaKey) {
          this.handleTypeAhead(key);
        }
        break;
    }
  };

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    this.container.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Remove event listeners and cleanup
   */
  public destroy(): void {
    this.container.removeEventListener('keydown', this.handleKeyDown);
    
    if (this.typeAheadTimeout) {
      clearTimeout(this.typeAheadTimeout);
    }
  }

  /**
   * Programmatically focus the first element
   */
  public focusFirst(): void {
    this.updateFocusableElements();
    this.focusElementAt(0);
  }

  /**
   * Programmatically focus the last element
   */
  public focusLast(): void {
    this.updateFocusableElements();
    this.focusElementAt(this.focusableElements.length - 1);
  }

  /**
   * Get the currently focused element
   */
  public getCurrentElement(): HTMLElement | null {
    const index = this.getCurrentIndex();
    return index >= 0 && index < this.focusableElements.length ? this.focusableElements[index] || null : null;
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<KeyboardNavigationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

/**
 * Roving tabindex implementation for complex widgets
 */
export class RovingTabindex {
  private container: HTMLElement;
  private items: HTMLElement[] = [];
  private currentIndex: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.updateItems();
    this.initializeTabindex();
  }

  /**
   * Update the list of items
   */
  private updateItems(): void {
    this.items = Array.from(
      this.container.querySelectorAll('[role="tab"], [role="menuitem"], [role="option"], [role="treeitem"]')
    ) as HTMLElement[];
  }

  /**
   * Initialize tabindex values
   */
  private initializeTabindex(): void {
    this.items.forEach((item, index) => {
      item.setAttribute('tabindex', index === this.currentIndex ? '0' : '-1');
    });
  }

  /**
   * Move focus to specific item
   */
  public focusItem(index: number): void {
    if (index >= 0 && index < this.items.length) {
      // Update tabindex
      this.items[this.currentIndex]?.setAttribute('tabindex', '-1');
      this.items[index]?.setAttribute('tabindex', '0');
      
      // Focus the item
      this.items[index]?.focus();
      this.currentIndex = index;
    }
  }

  /**
   * Move focus to next item
   */
  public focusNext(): void {
    const nextIndex = (this.currentIndex + 1) % this.items.length;
    this.focusItem(nextIndex);
  }

  /**
   * Move focus to previous item
   */
  public focusPrevious(): void {
    const prevIndex = this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
    this.focusItem(prevIndex);
  }

  /**
   * Update items and reinitialize
   */
  public refresh(): void {
    this.updateItems();
    this.initializeTabindex();
  }
}

/**
 * Material 3 specific keyboard navigation patterns
 */
export const Material3KeyboardPatterns = {
  /**
   * Setup navigation for Bottom Navigation
   */
  setupBottomNavigation: (container: HTMLElement): KeyboardNavigator => {
    return new KeyboardNavigator(container, {
      direction: 'horizontal',
      wrap: true,
      activateOnEnter: true,
      activateOnSpace: true,
      homeEndSupport: true
    });
  },

  /**
   * Setup navigation for Navigation Rail
   */
  setupNavigationRail: (container: HTMLElement): KeyboardNavigator => {
    return new KeyboardNavigator(container, {
      direction: 'vertical',
      wrap: true,
      activateOnEnter: true,
      activateOnSpace: true,
      homeEndSupport: true
    });
  },

  /**
   * Setup navigation for Tab Bar
   */
  setupTabBar: (container: HTMLElement): RovingTabindex => {
    return new RovingTabindex(container);
  },

  /**
   * Setup navigation for Menu
   */
  setupMenu: (container: HTMLElement): KeyboardNavigator => {
    return new KeyboardNavigator(container, {
      direction: 'vertical',
      wrap: false,
      activateOnEnter: true,
      activateOnSpace: false,
      homeEndSupport: true,
      typeAhead: true,
      customKeys: {
        [KeyCodes.ESCAPE]: () => {
          // Close menu
          const closeEvent = new CustomEvent('menu:close');
          container.dispatchEvent(closeEvent);
        }
      }
    });
  },

  /**
   * Setup navigation for Data Table
   */
  setupDataTable: (container: HTMLElement): KeyboardNavigator => {
    return new KeyboardNavigator(container, {
      direction: 'grid',
      wrap: false,
      activateOnEnter: true,
      activateOnSpace: true,
      homeEndSupport: true,
      pageUpDownSupport: true
    });
  },

  /**
   * Setup navigation for Card Grid
   */
  setupCardGrid: (container: HTMLElement): KeyboardNavigator => {
    return new KeyboardNavigator(container, {
      direction: 'grid',
      wrap: true,
      activateOnEnter: true,
      activateOnSpace: false,
      homeEndSupport: true
    });
  }
} as const;

/**
 * Keyboard shortcut manager
 */
export class KeyboardShortcutManager {
  private shortcuts: Map<string, (event: KeyboardEvent) => void> = new Map();

  /**
   * Register a keyboard shortcut
   */
  public register(
    keys: string, 
    handler: (event: KeyboardEvent) => void,
    description?: string
  ): void {
    const normalizedKeys = this.normalizeKeys(keys);
    this.shortcuts.set(normalizedKeys, handler);
  }

  /**
   * Unregister a keyboard shortcut
   */
  public unregister(keys: string): void {
    const normalizedKeys = this.normalizeKeys(keys);
    this.shortcuts.delete(normalizedKeys);
  }

  /**
   * Normalize key combination string
   */
  private normalizeKeys(keys: string): string {
    return keys.toLowerCase()
      .split('+')
      .map(key => key.trim())
      .sort()
      .join('+');
  }

  /**
   * Get key combination from event
   */
  private getEventKeys(event: KeyboardEvent): string {
    const keys: string[] = [];
    
    if (event.ctrlKey) keys.push('ctrl');
    if (event.altKey) keys.push('alt');
    if (event.metaKey) keys.push('meta');
    if (event.shiftKey) keys.push('shift');
    
    keys.push(event.key.toLowerCase());
    
    return keys.sort().join('+');
  }

  /**
   * Handle keyboard events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    const eventKeys = this.getEventKeys(event);
    const handler = this.shortcuts.get(eventKeys);
    
    if (handler) {
      event.preventDefault();
      handler(event);
    }
  };

  /**
   * Start listening for keyboard shortcuts
   */
  public enable(): void {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Stop listening for keyboard shortcuts
   */
  public disable(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Get all registered shortcuts
   */
  public getShortcuts(): Array<{keys: string, description?: string}> {
    return Array.from(this.shortcuts.keys()).map(keys => ({ keys }));
  }
}