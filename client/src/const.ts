import { Capacitor } from "@capacitor/core";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// The login URL now points to our local login page instead of Manus OAuth
export const getLoginUrl = () => {
  return "/login";
};
