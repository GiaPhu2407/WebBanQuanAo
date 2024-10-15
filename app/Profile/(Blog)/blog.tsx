import Head from "next/head";
import Footer from "../(Home)/Footer";
import Header from "../(Home)/Header";

export default function Blog() {
  return (
    <>
      <Header />
      <section
        className="bg-cover bg-center py-40"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/564x/8d/43/70/8d4370338da2ba878a1ea8057e68186b.jpg')",
        }}
      >
        <div className="container mx-auto text-center text-white">
          <h2 className="text-5xl font-bold">
            Chào Mừng Đến Với GiPuDiHi Blog
          </h2>
          <p className="mt-4 text-xl">
            Khám phá những mẹo thời trang và xu hướng mới nhất!
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Mới Nhất Từ Blog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blog Post 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://images.pexels.com/photos/6461325/pexels-photo-6461325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Post 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">
                Cách Phối Đồ Mùa Thu Đẹp Mắt
              </h3>
              <p className="text-gray-600 mb-4">
                Mùa thu đang đến, hãy khám phá phong cách phối đồ nổi bật.
              </p>
              <a href="#" className="text-blue-500 hover:underline">
                Đọc thêm
              </a>
            </div>
          </div>

          {/* Blog Post 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://images.pexels.com/photos/4947543/pexels-photo-4947543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Post 2"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">
                Những Món Đồ Thời Trang Bạn Phải Có
              </h3>
              <p className="text-gray-600 mb-4">
                Cập nhật ngay những món đồ thời trang không thể thiếu trong tủ
                đồ.
              </p>
              <a href="#" className="text-blue-500 hover:underline">
                Đọc thêm
              </a>
            </div>
          </div>

          {/* Blog Post 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://images.pexels.com/photos/10084285/pexels-photo-10084285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Post 3"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">
                Xu Hướng Thời Trang Mới Nhất
              </h3>
              <p className="text-gray-600 mb-4">
                Khám phá xu hướng thời trang mới để dẫn đầu phong cách.
              </p>
              <a href="#" className="text-blue-500 hover:underline">
                Đọc thêm
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
