import React from "react";

const Intro = () => {
  return (
    <div className="-mt-20">
      <section
        className="bg-cover bg-center py-16"
        style={{
          backgroundImage: "url('https://via.placeholder.com/1920x600')",
        }}
      >
        <div className="container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-bold mb-4 fade-in">
            <span className="inline-block whitespace-nowrap  colorful-text">
              Chào mừng đến với GiPuDiHi
            </span>
          </h1>
          <p className="text-lg mb-6 fade-in">
            Thời trang đẳng cấp, phong cách hiện đại, chất lượng vượt trội.
          </p>
          <a
            href="#"
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-500 transition"
          >
            Khám phá ngay
          </a>
          <div className="mt-10 flex justify-center items-center gap-10">
            <img
              src="https://i.pinimg.com/564x/ce/f6/ab/cef6ab06e652aa7e38a72996e9d362c1.jpg"
              alt="Fashion Banner"
              className=" rounded-lg shadow-lg w-80 h-96"
            />
            <img
              src="https://i.pinimg.com/736x/e9/a7/89/e9a78931f5ff5b4eebd3286036c40179.jpg"
              alt="Fashion Banner"
              className=" rounded-lg shadow-lg w-80 h-96"
            />
            <img
              src="https://i.pinimg.com/564x/1e/c2/56/1ec256520ac54a242d48184e65aef7cf.jpg"
              alt="Fashion Banner"
              className=" rounded-lg shadow-lg w-80 h-96"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Intro;
