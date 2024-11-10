
import { logout } from '@/lib/auth';
import { ChildProcess } from 'child_process';
import { NextResponse } from 'next/server';

export async function POST() {
  await logout();
  return NextResponse.json({ success: true });
}
