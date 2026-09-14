// GoodLife Secure Authentication Service
// Implements SHA-256 password hashing, role-based access control, and session management.

const AUTH_STORAGE_KEY = 'goodlife_auth_vault';
const SESSION_TOKEN_KEY = 'goodlife_session_token';
const SESSION_ROLE_KEY = 'goodlife_auth_role';

// Helper: SHA-256 string hashing
export async function hashPassword(plainText) {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback simple hash if crypto.subtle is unavailable
  let hash = 0;
  for (let i = 0; i < plainText.length; i++) {
    hash = ((hash << 5) - hash) + plainText.charCodeAt(i);
    hash |= 0;
  }
  return 'fb_' + Math.abs(hash).toString(16);
}

// Default initial password hashes:
// admin -> 'admin123'
// dukon -> '123'
const DEFAULT_ACCOUNTS = {
  admin: {
    username: 'admin',
    // SHA-256 of 'admin123'
    passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    role: 'admin',
    displayName: 'Bosh Administrator'
  },
  dukon: {
    username: 'dukon',
    // SHA-256 of '123'
    passwordHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    role: 'dukon',
    displayName: 'Do\'kon Kassiri'
  }
};

export const AuthService = {
  // Get stored account credentials
  getVault() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_ACCOUNTS, ...JSON.parse(stored) };
      }
    } catch (_) {}
    return { ...DEFAULT_ACCOUNTS };
  },

  // Save vault
  saveVault(vault) {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(vault));
    } catch (_) {}
  },

  // Login handler
  async login(username, password, selectedRole) {
    const userClean = (username || '').toLowerCase().trim();
    const passClean = (password || '').trim();

    if (!userClean || !passClean) {
      return { success: false, error: 'Login va parolni kiriting!' };
    }

    const vault = this.getVault();
    const inputHash = await hashPassword(passClean);

    // Determine target role account
    let targetAccount = null;

    if (selectedRole === 'admin' || userClean === 'admin' || userClean === 'goodlife') {
      targetAccount = vault.admin;
    } else if (selectedRole === 'dukon' || userClean === 'dukon' || userClean === 'dokon' || userClean === 'shop') {
      targetAccount = vault.dukon;
    }

    if (!targetAccount) {
      return { success: false, error: 'Foydalanuvchi hisobi topilmadi!' };
    }

    // Verify hash
    if (inputHash === targetAccount.passwordHash) {
      // Generate secure session token
      const token = 'gl_sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem('goodlife_admin_auth', 'true');
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
      sessionStorage.setItem(SESSION_ROLE_KEY, targetAccount.role);

      return {
        success: true,
        role: targetAccount.role,
        displayName: targetAccount.displayName,
        token
      };
    }

    return { success: false, error: 'Login yoki parol noto\'g\'ri!' };
  },

  // Check authentication status
  isAuthenticated(requiredRole = null) {
    const hasAuth = sessionStorage.getItem('goodlife_admin_auth') === 'true';
    const role = sessionStorage.getItem(SESSION_ROLE_KEY);
    if (!hasAuth || !role) return false;
    if (requiredRole && role !== requiredRole) return false;
    return true;
  },

  getRole() {
    return sessionStorage.getItem(SESSION_ROLE_KEY) || null;
  },

  // Logout
  logout() {
    sessionStorage.removeItem('goodlife_admin_auth');
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_ROLE_KEY);
  },

  // Change password
  async changePassword(role, oldPassword, newPassword) {
    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: 'Yangi parol kamida 4 ta belgidan iborat bo\'lishi kerak!' };
    }

    const vault = this.getVault();
    const account = vault[role];
    if (!account) return { success: false, error: 'Hisob topilmadi!' };

    const oldHash = await hashPassword(oldPassword.trim());
    if (oldHash !== account.passwordHash) {
      return { success: false, error: 'Eski parol noto\'g\'ri!' };
    }

    const newHash = await hashPassword(newPassword.trim());
    vault[role] = { ...account, passwordHash: newHash };
    this.saveVault(vault);

    return { success: true, message: 'Parol muvaffaqiyatli yangilandi!' };
  }
};
