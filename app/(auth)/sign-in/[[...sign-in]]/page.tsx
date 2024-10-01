import { SignIn } from "@clerk/nextjs";
import React from "react";
export async function generateStaticParams() {
  // Nếu bạn có tham số động, hãy tạo chúng ở đây
  return [];
}
export default function Page() {
  return (
    <div className="flex justify-center items-center">
      <SignIn />
    </div>
  );
}
