import React, { useEffect } from "react";
import { PiBuildingApartment } from "react-icons/pi";
import { MdOutlineLocalShipping } from "react-icons/md";
import { MdCurrencyExchange } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";
const Content2 = () => {
  useEffect(() => {
    AOS.init({ duration: 2500 });
  }, []);
  return (
    <div>
      <div className="bg-black w-full h-auto">
        <div className="relative flex flex-col md:flex-row justify-center items-center">
          <div className="flex opacity-50 flex-wrap justify-center gap-4">
            <img
              src="https://i.pinimg.com/564x/73/33/ff/7333ffa880d883f18bea55922be2eb33.jpg"
              alt=""
              className="w-full sm:w-[440px] h-auto max-h-96"
            />
            <img
              src="https://i.pinimg.com/564x/6e/ff/5e/6eff5eb5c14b464fdf851e4eb2fc5c7a.jpg"
              alt=""
              className="w-full sm:w-[440px] h-auto max-h-96"
            />
            <img
              src="https://i.pinimg.com/564x/a8/db/20/a8db208c17d908992f7d450623f8f5be.jpg"
              alt=""
              className="w-full sm:w-[440px] h-auto max-h-96"
            />
            <img
              src="https://i.pinimg.com/564x/43/c5/e8/43c5e82a7cd6f6ea1ab5f7031a0e9a6c.jpg"
              alt=""
              className="w-full sm:w-[440px] h-auto max-h-96"
            />
          </div>
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="text-white text-3xl text-center">
              Xem địa chỉ hệ thống hơn 340 Cửa Hàng Gipudihi trên toàn quốc
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center items-center">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              src="https://www.youtube.com/embed/pxt5O0Zfu9A"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* <div className="bg-blue-500 w-full mt-10 relative md:h-96 lg:h-36 sm:h-[800px]">
          <p className="text-center pt-10 text-3xl font-semibold font-serif">
            Tại sao lại chọn chúng tôi
          </p>
          <div className="absolute top-[100px] w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center items-center">
              <div className="text-center">
                <img
                  src="https://trangsuc2.giaodienwebmau.com/wp-content/uploads/2021/04/icon1-100x100.png"
                  alt=""
                  className="w-20 h-20 rounded-full mx-auto"
                />
                <p className="text-center">Trả góp lãi suất 0%</p>
                <p className="text-center text-sm">
                  Áp dụng dễ dàng qua thẻ tín dụng của hơn 20 ngân hàng
                </p>
              </div>
              <div className="text-center">
                <img
                  src="https://trangsuc2.giaodienwebmau.com/wp-content/uploads/2021/04/icon1-100x100.png"
                  alt=""
                  className="w-20 h-20 rounded-full mx-auto"
                />
                <p className="text-center">Giao hàng 4 giờ</p>
                <p className="text-center text-sm">
                  Sở hữu ngay món trang sức yêu thích chỉ trong vòng 4 giờ
                </p>
              </div>
              <div className="text-center">
                <img
                  src="https://trangsuc2.giaodienwebmau.com/wp-content/uploads/2021/04/icon1-100x100.png"
                  alt=""
                  className="w-20 h-20 rounded-full mx-auto"
                />
                <p className="text-center">Người bạn vàng</p>
                <p className="text-center text-sm">
                  Giải pháp tài chính cầm đồ Người Bạn Vàng
                </p>
              </div>
              <div className="text-center">
                <img
                  src="https://trangsuc2.giaodienwebmau.com/wp-content/uploads/2021/04/icon1-100x100.png"
                  alt=""
                  className="w-20 h-20 rounded-full mx-auto"
                />
                <p className="text-center">Ưu đãi đến 1.5tr</p>
                <p className="text-center text-sm">
                  Đặt online – nhận ưu đãi tại showroom
                </p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <div className="flex flex-col ml-1 md:flex-row justify-center items-center gap-8 sm:gap-10  mt-10">
        <div className="flex border px-2 py-2 rounded-xl shadow">
          <PiBuildingApartment className="w-24 h-16" />
          <div className="ml-1">
            <p className="text-red-500 font-semibold mb-2">
              {" "}
              Thương hiệu lâu đời
            </p>
            <p>
              {" "}
              Gipudihi đã kinh doanh áo quần và tất cả các thể loại quần áo khác
              từ 2020
            </p>
          </div>
        </div>
        <div className="flex border px-2 py-2 rounded-xl shadow">
          <MdOutlineLocalShipping className="w-24 h-16" />
          <div className="ml-1">
            <p className="text-red-500 font-semibold mb-2">
              Ship hàng siêu tốc
            </p>
            <p>
              Chúng tôi hỗ trợ ship hàng siêu tốc khu vực TPHCM , Đà Nẵng và Hà
              Nội
            </p>
          </div>
        </div>
        <div className="flex border px-2 py-2 rounded-xl shadow">
          <MdCurrencyExchange className="w-24 h-16 mt-1" />

          <div className="ml-1">
            <p className="text-red-500 font-semibold mb-2">Đổi trả miễn phí</p>
            <p>
              Chúng tôi hỗ trợ miễn phí khi hàng bị lỗi hay không đúng kích cỡ
              v.v
            </p>
          </div>
        </div>
      </div>
      <div className="border mt-10 shadow">
        <div className="flex items-center justify-center my-8">
          <div className="border-t border-gray-300 flex-grow mx-4"></div>
          <p className="text-lg font-semibold">ĐỐI TÁC</p>
          <div className="border-t border-gray-300 flex-grow mx-4"></div>
        </div>
        <div className="flex  justify-center items-center gap-20">
          <img
            src="https://i.pinimg.com/564x/92/de/46/92de46f55a67ad97a1f1facdafa3c967.jpg"
            alt=""
            className=" w-24 h-20"
          />
          <img
            src="https://i.pinimg.com/564x/e3/39/85/e33985c4790fb765b50a6ffcb660b26d.jpg"
            alt=""
            className=" w-24 h-32"
          />
          <img
            src="https://i.pinimg.com/564x/78/1b/bb/781bbb32f978308bda9e56b82e2b87cf.jpg"
            alt=""
            className=" w-24 h-20"
          />
          <img
            src="https://i.pinimg.com/564x/2c/1b/41/2c1b41a1e41db494a8d6062778b85098.jpg"
            alt=""
            className=" w-24 h-20"
          />
          <img
            src="https://i.pinimg.com/564x/96/ef/8b/96ef8b2a0d8164ab1937c5942fe4065d.jpg"
            alt=""
            className=" w-24 h-20"
          />
        </div>
      </div>
    </div>
  );
};

export default Content2;
