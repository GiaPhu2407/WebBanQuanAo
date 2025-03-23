import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

// Tạo UploadThing
const f = createUploadthing();

// Mô phỏng hàm xác thực người dùng
const auth = (req: Request) => ({ id: "user1" }); // Fake auth function

// FileRouter cho ứng dụng của bạn, có thể chứa nhiều FileRoutes
export const ourFileRouter = {
  // Định nghĩa một FileRoute với routeSlug duy nhất
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Thiết lập quyền truy cập và loại tệp cho FileRoute này
    .middleware(async ({ req }) => {
      // Code này chạy trên server trước khi tải lên
      const user = await auth(req); // Kiểm tra người dùng đã xác thực

      // Nếu không xác thực, ném lỗi
      if (!user) throw new UploadThingError("Unauthorized");

      // Trả về metadata có thể truy cập trong onUploadComplete
      return { userId: user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      // Xử lý sau khi tệp đã được tải lên, ví dụ: lưu thông tin vào CSDL
      console.log("Upload complete:", file);
      console.log("Metadata:", metadata);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
