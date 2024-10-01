import React from "react";

const Content2 = () => {
  return (
    <div>
      <div className="bg-black w-full h-[1000px]">
        <div className="relative flex justify-center items-center">
          <div className="flex opacity-50">
            <img
              src="https://i.pinimg.com/564x/73/33/ff/7333ffa880d883f18bea55922be2eb33.jpg"
              alt=""
              className="w-[440px] h-96"
            />
            <img
              src="https://i.pinimg.com/564x/6e/ff/5e/6eff5eb5c14b464fdf851e4eb2fc5c7a.jpg"
              alt=""
              className="w-[440px] h-96"
            />
            <img
              src="https://i.pinimg.com/564x/a8/db/20/a8db208c17d908992f7d450623f8f5be.jpg"
              alt=""
              className="w-[440px] h-96"
            />
            <img
              src="https://i.pinimg.com/564x/43/c5/e8/43c5e82a7cd6f6ea1ab5f7031a0e9a6c.jpg"
              alt=""
              className="w-[440px] h-96"
            />
          </div>
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="text-white text-3xl text-center">
              Xem địa chỉ hệ thống hơn 340 Cửa Hàng Gipudihi trên toàn quốc
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center items-center">
          <iframe
            width="1000"
            height="500"
            src="https://www.youtube.com/embed/pxt5O0Zfu9A"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        <div className="bg-blue-500 w-full  mt-10 relative md:h-96 lg:h-36 sm:h-[800px] ">
          <p className="text-center pt-10 text-3xl font-semibold font-serif">
            Tại sao lại chọn chúng tôi
          </p>
          <div className="absolute top-[100px] w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center items-center">
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
        </div>
      </div>
    </div>
  );
};

export default Content2;
