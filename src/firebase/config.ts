import { initializeApp } from 'firebase/app';
import { getAuth, Auth, User, AuthError, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import toast from 'react-hot-toast';

// Mock auth for development
class MockAuth implements Partial<Auth> {
  currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];
  
  async signInWithEmailAndPassword(email: string, password: string) {
    // Simulate basic validation
    if (!email || !password) {
      const error: AuthError = {
        code: 'auth/invalid-credential',
        message: 'Invalid email or password',
        name: 'AuthError',
      };
      throw error;
    }

    // Demo credentials for development
    if (email === 'demo@example.com' && password === 'password') {
      this.currentUser = {
        uid: 'demo-user-123',
        email,
        displayName: 'Demo User',
        emailVerified: true,
        photoURL: null,
        phoneNumber: null,
        isAnonymous: false,
        tenantId: null,
        providerData: [],
        metadata: {
          creationTime: Date.now().toString(),
          lastSignInTime: Date.now().toString(),
        },
        delete: async () => {},
        getIdToken: async () => 'mock-token',
        getIdTokenResult: async () => ({
          token: 'mock-token',
          signInProvider: 'password',
          claims: {},
          authTime: new Date().toISOString(),
          issuedAtTime: new Date().toISOString(),
          expirationTime: new Date(Date.now() + 3600000).toISOString(),
        }),
        reload: async () => {},
        toJSON: () => ({}),
      } as User;

      this.notifyListeners();
      return { user: this.currentUser };
    }

    // Simulate invalid credentials
    const error: AuthError = {
      code: 'auth/invalid-credential',
      message: 'Invalid email or password',
      name: 'AuthError',
    };
    throw error;
  }

  async signInWithPopup() {
    // Simulate Google sign in
    this.currentUser = {
      uid: 'google-user-123',
      email: 'demo.google@example.com',
      displayName: 'Google Demo User',
      emailVerified: true,
      photoURL: 'https://lh3.googleusercontent.com/demo-photo',
      phoneNumber: null,
      isAnonymous: false,
      tenantId: null,
      providerData: [{
        providerId: 'google.com',
        uid: 'google-user-123',
        displayName: 'Google Demo User',
        email: 'demo.google@example.com',
        phoneNumber: null,
        photoURL: 'https://lh3.googleusercontent.com/demo-photo',
      }],
      metadata: {
        creationTime: Date.now().toString(),
        lastSignInTime: Date.now().toString(),
      },
      delete: async () => {},
      getIdToken: async () => 'mock-token',
      getIdTokenResult: async () => ({
        token: 'mock-token',
        signInProvider: 'google.com',
        claims: {},
        authTime: new Date().toISOString(),
        issuedAtTime: new Date().toISOString(),
        expirationTime: new Date(Date.now() + 3600000).toISOString(),
      }),
      reload: async () => {},
      toJSON: () => ({}),
    } as User;

    this.notifyListeners();
    return { user: this.currentUser };
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    // Simulate basic validation
    if (!email || !password) {
      const error: AuthError = {
        code: 'auth/invalid-credential',
        message: 'Invalid email or password',
        name: 'AuthError',
      };
      throw error;
    }

    if (password.length < 6) {
      const error: AuthError = {
        code: 'auth/weak-password',
        message: 'Password should be at least 6 characters',
        name: 'AuthError',
      };
      throw error;
    }

    this.currentUser = {
      uid: `new-user-${Date.now()}`,
      email,
      displayName: null,
      emailVerified: false,
      photoURL: null,
      phoneNumber: null,
      isAnonymous: false,
      tenantId: null,
      providerData: [],
      metadata: {
        creationTime: Date.now().toString(),
        lastSignInTime: Date.now().toString(),
      },
      delete: async () => {},
      getIdToken: async () => 'mock-token',
      getIdTokenResult: async () => ({
        token: 'mock-token',
        signInProvider: 'password',
        claims: {},
        authTime: new Date().toISOString(),
        issuedAtTime: new Date().toISOString(),
        expirationTime: new Date(Date.now() + 3600000).toISOString(),
      }),
      reload: async () => {},
      toJSON: () => ({}),
    } as User;

    this.notifyListeners();
    return { user: this.currentUser };
  }

  async signOut() {
    this.currentUser = null;
    this.notifyListeners();
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }
}

// Production configuration
const prodConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app;
let auth;
let firestore;
let db;

if (import.meta.env.DEV) {
  // Use mock services in development
  auth = new MockAuth();
  firestore = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: () => false }),
        set: async () => {},
      }),
    }),
  };
  db = {};
  console.log('Using mock Firebase services in development mode');
  console.log('Use demo@example.com / password to log in');
} else {
  // Use real Firebase services in production
  try {
    app = initializeApp(prodConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    db = getDatabase(app);

    // Enable offline persistence
    enableMultiTabIndexedDbPersistence(firestore)
      .then(() => {
        console.log('Offline persistence enabled');
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, offline persistence enabled in another tab');
        } else if (err.code === 'unimplemented') {
          console.warn('Current browser doesn\'t support offline persistence');
        }
      });

    // Monitor online/offline status
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        toast.success('Back online!');
      });

      window.addEventListener('offline', () => {
        toast.error('You are offline. Some features may be limited.');
      });
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

export { auth, firestore, db };
export default app;