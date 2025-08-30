/**
 * ARIA Labels and Attributes System for Material 3 Components
 * 
 * Comprehensive ARIA support for screen readers and assistive technology,
 * with Material 3 design patterns and accessibility best practices.
 */

/**
 * Common ARIA role definitions for Material 3 components
 */
export const Material3AriaRoles = {
  // Navigation
  navigation: 'navigation',
  menubar: 'menubar',
  menu: 'menu',
  menuitem: 'menuitem',
  menuitemcheckbox: 'menuitemcheckbox',
  menuitemradio: 'menuitemradio',
  
  // Interactive elements
  button: 'button',
  link: 'link',
  tab: 'tab',
  tablist: 'tablist',
  tabpanel: 'tabpanel',
  
  // Form elements
  textbox: 'textbox',
  combobox: 'combobox',
  listbox: 'listbox',
  option: 'option',
  checkbox: 'checkbox',
  radio: 'radio',
  switch: 'switch',
  
  // Layout and structure
  main: 'main',
  region: 'region',
  banner: 'banner',
  contentinfo: 'contentinfo',
  complementary: 'complementary',
  
  // Dialogs and overlays
  dialog: 'dialog',
  alertdialog: 'alertdialog',
  tooltip: 'tooltip',
  
  // Status and feedback
  alert: 'alert',
  status: 'status',
  progressbar: 'progressbar',
  
  // Lists and grids
  list: 'list',
  listitem: 'listitem',
  grid: 'grid',
  gridcell: 'gridcell',
  row: 'row',
  
  // Disclosure
  tree: 'tree',
  treeitem: 'treeitem',
  group: 'group'
} as const;

/**
 * ARIA state management
 */
export const AriaStates = {
  /**
   * Set expanded state for collapsible elements
   */
  setExpanded: (element: HTMLElement, expanded: boolean): void => {
    element.setAttribute('aria-expanded', expanded.toString());
  },

  /**
   * Set selected state for selectable elements
   */
  setSelected: (element: HTMLElement, selected: boolean): void => {
    element.setAttribute('aria-selected', selected.toString());
  },

  /**
   * Set checked state for checkable elements
   */
  setChecked: (element: HTMLElement, checked: boolean | 'mixed'): void => {
    element.setAttribute('aria-checked', checked.toString());
  },

  /**
   * Set disabled state
   */
  setDisabled: (element: HTMLElement, disabled: boolean): void => {
    if (disabled) {
      element.setAttribute('aria-disabled', 'true');
      element.setAttribute('disabled', '');
    } else {
      element.removeAttribute('aria-disabled');
      element.removeAttribute('disabled');
    }
  },

  /**
   * Set hidden state
   */
  setHidden: (element: HTMLElement, hidden: boolean): void => {
    if (hidden) {
      element.setAttribute('aria-hidden', 'true');
      element.style.display = 'none';
    } else {
      element.removeAttribute('aria-hidden');
      element.style.display = '';
    }
  },

  /**
   * Set pressed state for toggle buttons
   */
  setPressed: (element: HTMLElement, pressed: boolean): void => {
    element.setAttribute('aria-pressed', pressed.toString());
  },

  /**
   * Set current state for navigation items
   */
  setCurrent: (element: HTMLElement, current: boolean | string): void => {
    if (current === false) {
      element.removeAttribute('aria-current');
    } else {
      element.setAttribute('aria-current', current === true ? 'page' : current);
    }
  }
} as const;

/**
 * Live region utilities for dynamic content announcements
 */
export const LiveRegions = {
  /**
   * Create a live region for announcements
   */
  createLiveRegion: (
    politeness: 'polite' | 'assertive' = 'polite',
    atomic: boolean = true
  ): HTMLElement => {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', atomic.toString());
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    
    document.body.appendChild(liveRegion);
    return liveRegion;
  },

  /**
   * Announce message to screen readers
   */
  announce: (
    message: string,
    politeness: 'polite' | 'assertive' = 'polite',
    delay: number = 100
  ): void => {
    const liveRegion = LiveRegions.createLiveRegion(politeness);
    
    setTimeout(() => {
      liveRegion.textContent = message;
    }, delay);
    
    // Clean up after announcement
    setTimeout(() => {
      if (liveRegion.parentNode) {
        liveRegion.parentNode.removeChild(liveRegion);
      }
    }, delay + 2000);
  },

  /**
   * Status announcements for form validation
   */
  announceStatus: (message: string, isError: boolean = false): void => {
    LiveRegions.announce(
      message,
      isError ? 'assertive' : 'polite'
    );
  }
} as const;

/**
 * ARIA label generators for Material 3 components
 */
export const AriaLabelGenerators = {
  /**
   * Generate label for buttons with context
   */
  button: (action: string, context?: string): string => {
    return context ? `${action} ${context}` : action;
  },

  /**
   * Generate label for navigation items
   */
  navigation: (page: string, current: boolean = false): string => {
    return current ? `${page}, current page` : `Navigate to ${page}`;
  },

  /**
   * Generate label for form fields with validation state
   */
  formField: (
    fieldName: string,
    required: boolean = false,
    hasError: boolean = false,
    errorMessage?: string
  ): { label: string; describedBy?: string } => {
    let label = fieldName;
    if (required) {
      label += ', required';
    }
    
    if (hasError && errorMessage) {
      return {
        label,
        describedBy: `${fieldName.toLowerCase().replace(/\s+/g, '-')}-error`
      };
    }
    
    return { label };
  },

  /**
   * Generate label for progress indicators
   */
  progress: (
    value: number,
    max: number = 100,
    label?: string
  ): string => {
    const percentage = Math.round((value / max) * 100);
    const baseLabel = label || 'Progress';
    return `${baseLabel}: ${percentage}% complete`;
  },

  /**
   * Generate label for tabs
   */
  tab: (tabName: string, index: number, total: number): string => {
    return `${tabName}, tab ${index + 1} of ${total}`;
  },

  /**
   * Generate label for cards with actions
   */
  card: (title: string, subtitle?: string, hasActions: boolean = false): string => {
    let label = title;
    if (subtitle) {
      label += `, ${subtitle}`;
    }
    if (hasActions) {
      label += '. Press Enter to interact.';
    }
    return label;
  },

  /**
   * Generate label for modal dialogs
   */
  modal: (title: string, type: 'dialog' | 'alert' = 'dialog'): string => {
    return type === 'alert' ? `Alert: ${title}` : `Dialog: ${title}`;
  }
} as const;

/**
 * Keyboard shortcuts announcements
 */
export const KeyboardShortcuts: {
  shortcuts: Record<string, string>;
  generateHelpText: (availableShortcuts: string[]) => string;
} = {
  /**
   * Common keyboard shortcuts for Material 3 components
   */
  shortcuts: {
    escape: 'Press Escape to close',
    enter: 'Press Enter to activate',
    space: 'Press Space to select',
    arrows: 'Use arrow keys to navigate',
    tab: 'Press Tab to move to next item',
    shiftTab: 'Press Shift+Tab to move to previous item',
    home: 'Press Home to go to first item',
    end: 'Press End to go to last item'
  },

  /**
   * Generate keyboard shortcut help text
   */
  generateHelpText: (availableShortcuts: string[]): string => {
    return availableShortcuts
      .map(key => KeyboardShortcuts.shortcuts[key])
      .filter(Boolean)
      .join('. ');
  }
} as const;

/**
 * Screen reader specific utilities
 */
export const ScreenReaderUtils = {
  /**
   * Create screen reader only text
   */
  createSROnlyText: (text: string): HTMLElement => {
    const span = document.createElement('span');
    span.textContent = text;
    span.style.position = 'absolute';
    span.style.width = '1px';
    span.style.height = '1px';
    span.style.padding = '0';
    span.style.margin = '-1px';
    span.style.overflow = 'hidden';
    span.style.clip = 'rect(0, 0, 0, 0)';
    span.style.whiteSpace = 'nowrap';
    span.style.border = '0';
    return span;
  },

  /**
   * Add descriptive text for complex UI elements
   */
  addDescription: (element: HTMLElement, description: string): void => {
    const descriptionId = `desc-${Math.random().toString(36).substr(2, 9)}`;
    const descriptionElement = ScreenReaderUtils.createSROnlyText(description);
    descriptionElement.id = descriptionId;
    
    element.appendChild(descriptionElement);
    element.setAttribute('aria-describedby', descriptionId);
  },

  /**
   * Add instructions for complex interactions
   */
  addInstructions: (element: HTMLElement, instructions: string): void => {
    const instructionsId = `instructions-${Math.random().toString(36).substr(2, 9)}`;
    const instructionsElement = ScreenReaderUtils.createSROnlyText(instructions);
    instructionsElement.id = instructionsId;
    
    element.appendChild(instructionsElement);
    const existingDescribedBy = element.getAttribute('aria-describedby');
    const describedBy = existingDescribedBy 
      ? `${existingDescribedBy} ${instructionsId}`
      : instructionsId;
    element.setAttribute('aria-describedby', describedBy);
  }
} as const;

/**
 * Material 3 specific ARIA patterns
 */
export const Material3AriaPatterns = {
  /**
   * Setup FAB (Floating Action Button) accessibility
   */
  setupFAB: (element: HTMLElement, action: string, extended: boolean = false): void => {
    element.setAttribute('role', Material3AriaRoles.button);
    element.setAttribute('aria-label', AriaLabelGenerators.button(action));
    
    if (!extended) {
      // Add description for icon-only FABs
      ScreenReaderUtils.addDescription(element, 'Floating action button');
    }
    
    // Add keyboard instructions
    ScreenReaderUtils.addInstructions(element, KeyboardShortcuts.shortcuts.enter || 'Press Enter to activate');
  },

  /**
   * Setup Navigation Rail accessibility
   */
  setupNavigationRail: (railElement: HTMLElement, items: Array<{element: HTMLElement, label: string, current?: boolean}>): void => {
    railElement.setAttribute('role', Material3AriaRoles.navigation);
    railElement.setAttribute('aria-label', 'Main navigation');
    
    items.forEach((item, index) => {
      item.element.setAttribute('role', Material3AriaRoles.button);
      item.element.setAttribute('aria-label', AriaLabelGenerators.navigation(item.label, item.current));
      
      if (item.current) {
        AriaStates.setCurrent(item.element, 'page');
      }
      
      // Add position information
      item.element.setAttribute('aria-posinset', (index + 1).toString());
      item.element.setAttribute('aria-setsize', items.length.toString());
    });
  },

  /**
   * Setup Bottom Navigation accessibility
   */
  setupBottomNavigation: (navElement: HTMLElement, items: Array<{element: HTMLElement, label: string, current?: boolean}>): void => {
    navElement.setAttribute('role', Material3AriaRoles.tablist);
    navElement.setAttribute('aria-label', 'Main navigation');
    
    items.forEach((item, index) => {
      item.element.setAttribute('role', Material3AriaRoles.tab);
      item.element.setAttribute('aria-label', AriaLabelGenerators.tab(item.label, index, items.length));
      
      if (item.current) {
        AriaStates.setSelected(item.element, true);
        item.element.setAttribute('aria-current', 'page');
      } else {
        AriaStates.setSelected(item.element, false);
      }
    });
  },

  /**
   * Setup Card accessibility
   */
  setupCard: (cardElement: HTMLElement, title: string, subtitle?: string, interactive: boolean = false): void => {
    if (interactive) {
      cardElement.setAttribute('role', Material3AriaRoles.button);
      cardElement.setAttribute('tabindex', '0');
      ScreenReaderUtils.addInstructions(cardElement, KeyboardShortcuts.shortcuts.enter || 'Press Enter to activate');
    }
    
    cardElement.setAttribute('aria-label', AriaLabelGenerators.card(title, subtitle, interactive));
  },

  /**
   * Setup Modal Dialog accessibility
   */
  setupDialog: (dialogElement: HTMLElement, title: string, type: 'dialog' | 'alert' = 'dialog'): void => {
    dialogElement.setAttribute('role', type === 'alert' ? Material3AriaRoles.alertdialog : Material3AriaRoles.dialog);
    dialogElement.setAttribute('aria-modal', 'true');
    dialogElement.setAttribute('aria-label', AriaLabelGenerators.modal(title, type));
    
    // Add escape instruction
    ScreenReaderUtils.addInstructions(dialogElement, KeyboardShortcuts.shortcuts.escape || 'Press Escape to close');
  },

  /**
   * Setup Form Field accessibility
   */
  setupFormField: (
    fieldElement: HTMLElement,
    labelText: string,
    required: boolean = false,
    errorMessage?: string
  ): void => {
    const labelInfo = AriaLabelGenerators.formField(labelText, required, !!errorMessage, errorMessage);
    
    fieldElement.setAttribute('aria-label', labelInfo.label);
    
    if (required) {
      fieldElement.setAttribute('aria-required', 'true');
    }
    
    if (errorMessage && labelInfo.describedBy) {
      fieldElement.setAttribute('aria-describedby', labelInfo.describedBy);
      fieldElement.setAttribute('aria-invalid', 'true');
    }
  }
} as const;

/**
 * ARIA testing utilities
 */
export const AriaTestingUtils = {
  /**
   * Validate ARIA implementation
   */
  validateElement: (element: HTMLElement): {valid: boolean, issues: string[]} => {
    const issues: string[] = [];
    
    // Check for missing labels on interactive elements
    const interactiveRoles = ['button', 'link', 'textbox', 'combobox', 'tab'];
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    
    if (interactiveRoles.includes(role)) {
      const hasLabel = element.getAttribute('aria-label') || 
                     element.getAttribute('aria-labelledby') ||
                     element.textContent?.trim();
      
      if (!hasLabel) {
        issues.push(`Interactive element missing accessible label: ${role}`);
      }
    }
    
    // Check for proper ARIA states
    const expanded = element.getAttribute('aria-expanded');
    if (expanded && expanded !== 'true' && expanded !== 'false') {
      issues.push('aria-expanded must be "true" or "false"');
    }
    
    // Check for keyboard accessibility
    const isInteractive = element.getAttribute('onclick') || 
                          element.getAttribute('role') === 'button' ||
                          ['button', 'a', 'input', 'select', 'textarea'].includes(element.tagName.toLowerCase());
    
    if (isInteractive && !element.hasAttribute('tabindex') && element.tagName.toLowerCase() === 'div') {
      issues.push('Interactive div elements should have tabindex="0"');
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  },

  /**
   * Generate accessibility report
   */
  generateReport: (container: HTMLElement): {totalElements: number, validElements: number, issues: Array<{element: HTMLElement, issues: string[]}>} => {
    const allElements = container.querySelectorAll('*');
    const elementsWithIssues: Array<{element: HTMLElement, issues: string[]}> = [];
    let validElements = 0;
    
    allElements.forEach(el => {
      const validation = AriaTestingUtils.validateElement(el as HTMLElement);
      if (validation.valid) {
        validElements++;
      } else {
        elementsWithIssues.push({
          element: el as HTMLElement,
          issues: validation.issues
        });
      }
    });
    
    return {
      totalElements: allElements.length,
      validElements,
      issues: elementsWithIssues
    };
  }
} as const;