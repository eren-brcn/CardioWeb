const TOKEN_KEY = "cardioweb_access_token";
const USER_KEY = "cardioweb_user";

export const saveAuthSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const hasAuthSession = () => Boolean(getAuthToken());

export const getAuthUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
