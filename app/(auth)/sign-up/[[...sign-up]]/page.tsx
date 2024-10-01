import { SignUp } from "@clerk/nextjs";
export async function generateStaticParams() {
  // Nếu bạn có tham số động, hãy tạo chúng ở đây
  return [
    { signUpParam: "param1" }, // Ví dụ tham số
    { signUpParam: "param2" }, // Ví dụ tham số
  ];
}
export default function Page() {
  return (
    <div className="flex justify-center items-center">
      <SignUp />
    </div>
  );
}
