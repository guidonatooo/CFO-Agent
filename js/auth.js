window.CFOAuth = {
  _ready: false,
  _user: null,

  async init() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.setAttribute('data-clerk-publishable-key', window.CFO_CONFIG.clerkKey);
      script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@4/dist/clerk.browser.js';
      script.crossOrigin = 'anonymous';
      script.onload = async () => {
        await window.Clerk.load();
        this._user = window.Clerk.user;
        this._ready = true;
        resolve(this._user);
      };
      document.head.appendChild(script);
    });
  },

  getUser()   { return this._user; },
  getUserId() { return this._user?.id || null; },
  getEmail()  { return this._user?.primaryEmailAddress?.emailAddress || ''; },

  requireAuth() {
    if (this._ready && !this._user) {
      window.location.href = '/login';
    }
  },

  async signOut() {
    await window.Clerk.signOut();
    window.location.href = '/login';
  },

  mountSignIn(element) {
    window.Clerk.mountSignIn(element, {
      afterSignInUrl: '/dashboard',
      appearance: {
        variables: {
          colorPrimary: '#1A4BBF',
          colorBackground: '#08163A',
          colorText: '#ffffff',
          colorInputBackground: 'rgba(255,255,255,0.08)',
          colorInputText: '#ffffff',
          borderRadius: '10px'
        }
      }
    });
  }
};
