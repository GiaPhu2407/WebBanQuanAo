// // Trong file auth.ts
// import { hash } from 'bcrypt';
// import prisma from '@/prisma/client';

// // Interface cho user nếu cần
// interface UserRegistration {
//   email: string;
//   username: string;
//   password: string;
//   fullName: string;
//   phone: string;
//   address: string;
// }

// export async function signUp(email: string, username: string, password: string, fullName: string, phone: string, address: string) {
//   try {
//     const hashedPassword = await hash(password, 10);

//     const user = await prisma.users.create({
//       data: {
//         EmaiL,
//         Ten,
//         password: hashedPassword,
//         Tentaikhoan: fullName,
//         Sdt: phone,
//         Diachi: address
//       }
//     });

//     const { password: _, ...userWithoutPassword } = user;
//     return userWithoutPassword;
    
//   } catch (error) {
//     console.error('SignUp error:', error);
//     throw new Error('Registration failed');
//   }
// }