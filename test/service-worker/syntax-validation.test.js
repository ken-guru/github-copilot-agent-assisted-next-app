/**
 * @jest-environment node
 */

// Import required modules
const fs = require('fs');
const path = require('path');
const vm = require('vm');

describe('Service Worker Syntax Validation', () => {
  // Create our own isolated environment for the service worker
  const mockServiceWorkerEnvironment = () => {
    // Create mock service worker globals
    const self = {
      location: {
        hostname: 'localhost',
        port: '3000',
        origin: 'http://localhost:3000',
        protocol: 'http:'
      },
      listeners: {},
      addEventListener: function(event, handler) {
        this.listeners[event] = handler;
      },
      skipWaiting: jest.fn().mockResolvedValue(undefined),
      clients: {
        claim: jest.fn().mockResolvedValue(undefined),
        matchAll: jest.fn().mockResolvedValue([])
      }
    };
    
    // Mock Request object with headers
    class Request {
      constructor(url, options = {}) {
        this.url = url;
        Object.assign(this, options);
        this._headers = new Map();
        if (options.headers) {
          Object.entries(options.headers).forEach(([key, value]) => {
            this._headers.set(key.toLowerCase(), value);
          });
        }
      }
      
      get headers() {
        return {
          get: (name) => this._headers.get(name.toLowerCase()) || null
        };
      }
      
      clone() {
        return new Request(this.url, this);
      }
    }

    // Mock Response object
    class Response {
      constructor(body, options = {}) {
        this.body = body;
        this._options = options;
        this.status = options.status || 200;
        this.statusText = options.statusText || 'OK';
        this.type = 'basic';
        this._headers = new Map();
        if (options.headers) {
          Object.entries(options.headers).forEach(([key, value]) => {
            this._headers.set(key.toLowerCase(), value);
          });
        }
      }
      
      get headers() {
        return {
          get: (name) => this._headers.get(name.toLowerCase()) || null
        };
      }
      
      clone() {
        return new Response(this.body, this._options);
      }
    }
    
    // Create context for the service worker
    const context = {
      self: self,
      caches: {
        open: jest.fn().mockResolvedValue({
          put: jest.fn().mockResolvedValue(undefined),
          match: jest.fn().mockResolvedValue(null)
        }),
        keys: jest.fn().mockResolvedValue([]),
        delete: jest.fn().mockResolvedValue(true),
        match: jest.fn().mockResolvedValue(null)
      },
      fetch: jest.fn().mockImplementation(url => {
        return Promise.resolve(new Response('MockContent', { status: 200 }));
      }),
      Request: Request,
      Response: Response,
      URL: URL,
      console: {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        group: jest.fn(),
        groupEnd: jest.fn()
      },
      importScripts: jest.fn().mockImplementation(() => {
        throw new Error('Mock importScripts error');
      })
    };
    
    // Add the self reference to the global objects
    context.Request = context.Request;
    context.Response = context.Response;

    return {
      getVM: () => vm.createContext(context),
      context
    };
  };

  test('service worker script can be parsed without syntax errors', () => {
    // Read the service worker file
    const swPath = path.resolve(__dirname, '../../public/service-worker.js');
    expect(fs.existsSync(swPath)).toBe(true);
    
    const swCode = fs.readFileSync(swPath, 'utf8');
    expect(swCode).toBeTruthy();
    
    // Create the isolated environment
    const { getVM } = mockServiceWorkerEnvironment();
    
    // Function to execute the script
    const executeScript = () => {
      const script = new vm.Script(swCode);
      script.runInContext(getVM());
    };
    
    // This should not throw if the syntax is valid
    expect(executeScript).not.toThrow();
  });
});
