import React from "react";

const Content = () => {
  return (
    <div>
      <p className="text-4xl font-semibold text-center mb-10 mt-10">
        Sứ mệnh của chúng tôi
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-5">
        <div className="collapse collapse-plus bg-base-200">
          <input type="checkbox" id="accordion1" />
          <label
            htmlFor="accordion1"
            className="collapse-title text-xl font-medium  text-center"
          >
            Chất lượng
          </label>
          <div className="collapse-content">
            <p>
              Sản phẩm của chúng tôi đảm bảo độ bền cao và an toàn cho người
              mặc.
            </p>
          </div>
        </div>
        <div className="collapse collapse-plus bg-base-200">
          <input type="checkbox" id="accordion2" />
          <label
            htmlFor="accordion2"
            className="collapse-title text-xl font-medium text-center"
          >
            Phong cách
          </label>
          <div className="collapse-content">
            <p>
              Thiết kế trẻ trung, năng động, phù hợp với xu hướng thời trang
              hiện đại.
            </p>
          </div>
        </div>
        <div className="collapse collapse-plus bg-base-200">
          <input type="checkbox" id="accordion3" />
          <label
            htmlFor="accordion3"
            className="collapse-title text-xl font-medium  text-center"
          >
            Tận tâm với khách hàng{" "}
          </label>
          <div className="collapse-content">
            <p>Luôn lắng nghe và đáp ứng mọi nhu cầu của khách hàng.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
