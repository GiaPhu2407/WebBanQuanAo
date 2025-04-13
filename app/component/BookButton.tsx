"use client";
import Link from "next/link";
import { useState } from "react";

export default function BookButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href="/book">
      <button
        className="book-button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="book-icon">📖</span>
        <span>Khám phá cuốn sách GipuDihi</span>
      </button>
    </Link>
  );
}
