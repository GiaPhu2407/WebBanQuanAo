"use client";
import Link from 'next/link';

export default function HomeButton() {
  return (
    <Link href="/">
      <button className="home-button">
        <span>🏠</span>
        <span>Trang chủ</span>
      </button>
    </Link>
  );
}