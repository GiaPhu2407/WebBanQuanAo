// import 'server-only'
// import { SignJWT, jwtVerify } from 'jose'
// import { SessionPayload } from '@/lib/definitions'
// import { cookies } from 'next/headers'

// const secretKey = process.env.SESSION_SECRET
// const encodedKey = new TextEncoder().encode(secretKey)

// export async function encrypt(payload: SessionPayload) {
//   return new SignJWT(payload)
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('7d')
//     .sign(encodedKey)
// }

// export async function decrypt(session: string | undefined = '') {
//   try {
//     const { payload } = await jwtVerify(session, encodedKey, {
//       algorithms: ['HS256'],
//     })
//     return payload
//   } catch (error) {
//     console.log('Failed to verify session')
//   }
// }
// export async function createSession(userId: string) {
//     const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//     const session = await encrypt({ userId, expiresAt })(await cookies()).set(
//       'session',
//       session,
//       {
//         httpOnly: true,
//         secure: true,
//         expires: expiresAt,
//         sameSite: 'lax',
//         path: '/',
//       }
//     )
//   }
//   export async function updateSession() {
//     const session = (await cookies()).get('session')?.value
//     const payload = await decrypt(session)

//     if (!session || !payload) {
//       return null
//     }

//     const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

//     const cookieStore = await cookies()
//     cookieStore.set('session', session, {
//       httpOnly: true,
//       secure: true,
//       expires: expires,
//       sameSite: 'lax',
//       path: '/',
//     })
//   }
//   export async function deleteSession() {
//     const cookieStore = await cookies()
//     cookieStore.delete('session')
//   }
//   export async function createSession(id: number) {
//     const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

//     // 1. Create a session in the database
//     const data = await db
//       .insert(sessions)
//       .values({
//         userId: id,
//         expiresAt,
//       })
//       // Return the session ID
//       .returning({ id: sessions.id })

//     const sessionId = data[0].id

//     // 2. Encrypt the session ID
//     const session = await encrypt({ sessionId, expiresAt })

//     // 3. Store the session in cookies for optimistic auth checks
//     const cookieStore = await cookies()
//     cookieStore.set('session', session, {
//       httpOnly: true,
//       secure: true,
//       expires: expiresAt,
//       sameSite: 'lax',
//       path: '/',
//     })
//   }
import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers"; // Sử dụng `cookies()` để lấy CookieStore

export const sessionOptions: SessionOptions = {
  cookieName: "session",
  password: process.env.SESSION_SECRET || "default_secret_password",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// Hàm lấy session
export async function getSession() {
  return getIronSession(cookies(), sessionOptions);
}

// Hàm set session
export async function setSession(sessionData: {
  userId: number;
  email: string;
  role: number;
  username: string;
  phone: string;
  address: string;
}) {
  const session = await getSession();
  Object.assign(session, sessionData);
  await session.save();
}
