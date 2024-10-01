import { SignUp } from "@clerk/nextjs";

export async function generateStaticParams() {
  return []; // Trả về mảng rỗng nếu không có tham số động
}
export default function Page() {
  return (
    <div className="flex justify-center items-center">
      <SignUp />
    </div>
  );
}
