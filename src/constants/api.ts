export const API_V1 = "/api/v1";

export const AUTH_API = {
  REGISTER: `${API_V1}/auth/register`,
  LOGIN: `${API_V1}/auth/login`,
  REFRESH: `${API_V1}/auth/refresh`,
  LOGOUT: `${API_V1}/auth/logout`,
  VERIFY_EMAIL: `${API_V1}/auth/verify-email`,
  RESEND_VERIFICATION: `${API_V1}/auth/resend-verification`,
  GOOGLE_LOGIN: `${API_V1}/auth/google`,
};

export const USER_API = {
  ME: `${API_V1}/users/me`,
  SETS_BY_USER: (userId: string) => `${API_V1}/users/${userId}/sets`,
  SETS_BY_USER_SHARED: (userId: string) => `${API_V1}/users/${userId}/shared-sets`
};

export const SET_API = {
  BASE: `${API_V1}/sets`,
  DETAIL: (id: string) => `${API_V1}/sets/${id}`,
  SEARCH: `${API_V1}/sets/search`,
  CARDS: (setId: string) => `${API_V1}/sets/${setId}/cards`,
  BULK_CARDS: (setId: string) => `${API_V1}/sets/${setId}/card/bulk`,
  QUIZ: (setId: string) => `${API_V1}/sets/${setId}/quiz`,
  STUDY_RECORDS: (setId: string) => `${API_V1}/sets/${setId}/study-records`,
};

export const CARD_API = {
  DETAIL: (cardId: string) => `${API_V1}/cards/${cardId}`,
  BULK_UPDATE: `${API_V1}/cards/bulk`,
};

export const STUDY_API = {
  UPDATE_RECORD: `${API_V1}/study-records`,
};

export const NOTIFICATION_API = {
  GET_ALL: `${API_V1}/notifications`,
  POST_FCM_TOKEN: `${API_V1}/users/fcm-token`,

  MARK_AS_READ: (id: string) => `${API_V1}/notifications/${id}/read`,

  MARK_ALL_READ: `${API_V1}/notifications/read-all`,

  DELETE: (id: string) => `${API_V1}/notifications/${id}`,

  DELETE_ALL: `${API_V1}/notifications/all`,
};
