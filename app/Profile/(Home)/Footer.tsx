import React from "react";
import { FaFacebook } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
const Footer = () => {
  return (
    <div>
      <footer className="footer bg-base-200 text-base-content p-10 mt-20 ">
        <nav>
          <h6 className="footer-title">VỀ PNJ</h6>
          <a className="link link-hover">Thông tin về PNJ</a>
          <a className="link link-hover">Quá trình phát triển</a>
          <a className="link link-hover">Hệ thống cửa hàng</a>
          <a className="link link-hover">Tuyển dụng</a>
          <a className="link link-hover">FAQs</a>
        </nav>
        <nav>
          <h6 className="footer-title">HỖ TRỢ MUA HÀNG</h6>
          <a className="link link-hover">Hướng dẫn mua hàng</a>
          <a className="link link-hover">Hướng dẫn thanh toán</a>
          <a className="link link-hover">Thanh toán lại đơn hàng</a>
          <a className="link link-hover">Phương thức vận chuyển</a>
          <a className="link link-hover">Chính sách bảo hành thu đổi</a>
          <a className="link link-hover">Hướng dẫn đo size trang sức</a>
          <a className="link link-hover whitespace-normal max-w-[200px]">
            Tích luỹ điểm khách hàng thân thiết (Gold)
          </a>
          <a className="link link-hover whitespace-normal max-w-[200px]">
            Chính sách bảo vệ thông tin cá nhân của người tiêu dùng
          </a>
        </nav>
        <nav>
          <h6 className="footer-title">CẨM NANG SỬ DỤNG</h6>
          <a className="link link-hover">Quần áo theo tháng sinh</a>
          <a className="link link-hover">Kiến thức về quần áo</a>
          <a className="link link-hover"></a>
        </nav>
        <nav>
          <h6 className="footer-title">SẢN PHẨM</h6>
          <a className="link link-hover">Quần áo công sở</a>
          <a className="link link-hover">Quần áo theo nhiều phong cách</a>
          <a className="link link-hover">Quần áo cho các bé</a>
        </nav>
        <nav>
          <h6 className="footer-title">DỊCH VỤ</h6>
          <a className="link link-hover">Xuất khẩu</a>
          <a className="link link-hover">Kinh doanh sỉ</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
      {/* Footer2 */}
      <footer className="footer bg-base-200 text-base-content p-10">
        <aside>
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="fill-current"
          >
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
          </svg>
          <p>
            GPDH SHOP Industries Ltd.
            <br />
            Providing reliable tech since 2024
          </p>
        </aside>
        <nav>
          <h6 className="footer-title">Quan tâm Zalo OA PNJ</h6>
          <a className="link link-hover">
            Nhận các thông tin khuyến mãi hấp dẫn
          </a>
          <a className="  bg-blue-500 px-10 py-2 rounded-full hover:bg-blue-900 text-white transform transition-transform duration-400 hover:scale-105">
            Design
          </a>
        </nav>
        <nav>
          <h6 className="footer-title">Phương thức thanh toán</h6>

          <div>
            <img
              src="https://trangsuc2.giaodienwebmau.com/wp-content/uploads/2021/04/thanh-toan.png"
              alt=""
            />
          </div>
        </nav>
        <nav>
          <h6 className="footer-title">kết nối với chúng tôi</h6>
          <div className="flex gap-2">
            <FaFacebook className="text-2xl text-blue-600 transform transition-transform duration-300 hover:scale-105" />
            <div className="bg-gradient-to-r from-orange-500 to-pink-700 p-1 rounded-full -mt-[1px] ransform transition-transform duration-300 hover:scale-105">
              <IoLogoInstagram className="text-xl text-white " />
            </div>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
