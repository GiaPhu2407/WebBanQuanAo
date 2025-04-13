import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";

// Session options configuration
export const sessionOptions: SessionOptions = {
  cookieName: "session",
  password: process.env.SESSION_SECRET || "default_secret_password",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true, // Prevents client-side JavaScript from accessing cookies
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

// Define session data type for better TypeScript support
export interface SessionData {
  userId: number;
  email: string;
  role: number;
  username: string;
  phone: string;
  address: string;
  isLoggedIn?: boolean;
}

// Get session function
export async function getSession() {
  const cookieStore = cookies();
  return getIronSession<SessionData>(await cookieStore, sessionOptions);
}

// Set session function
export async function setSession(sessionData: SessionData) {
  const session = await getSession();
  Object.assign(session, sessionData, { isLoggedIn: true });
  await session.save();
  return session;
}

// Clear session function (for logout)
export async function clearSession() {
  const session = await getSession();
  session.destroy();
  return session;
}
