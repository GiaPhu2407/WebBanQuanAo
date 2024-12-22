"use client";
import React, { useEffect } from "react";

const Intro = () => {
  useEffect(() => {
    const options = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-appear");
        } else {
          entry.target.classList.remove("animate-appear");
        }
      });
    }, options);

    const images = document.querySelectorAll(".scroll-image");
    images.forEach((image) => {
      observer.observe(image);
    });

    return () => {
      images.forEach((image) => observer.unobserve(image));
    };
  }, []);

  return (
    <div className="-mt-10 -mb-10 md:-mt-20 overflow-hidden">
      <section
        className="bg-cover bg-center py-8 md:py-16 min-h-screen md:min-h-0"
        style={{
          backgroundImage: "url('https://via.placeholder.com/1920x600')",
        }}
      >
        <div className="container mt-32 mx-auto px-4 md:px-6 text-center text-white ">
          {/* Header Text */}
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 fade-in">
            <span className="inline-block whitespace-normal md:whitespace-nowrap colorful-text">
              Chào mừng đến với GiPuDiHi
            </span>
          </h1>
          
          {/* Subheader */}
          <p className="text-base md:text-lg mb-4 md:mb-6">
            Thời trang đẳng cấp, phong cách hiện đại, chất lượng vượt trội.
          </p>
          
          {/* CTA Button */}
          <a
            href="#"
            className="inline-block bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg hover:bg-blue-500 transition text-sm md:text-base"
          >
            Khám phá ngay
          </a>

          {/* Image Gallery */}
          <div className="mt-6 md:mt-10 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
            {/* Image 1 */}
            <div className="w-full md:w-auto">
              <img
                src="https://i.pinimg.com/564x/ce/f6/ab/cef6ab06e652aa7e38a72996e9d362c1.jpg"
                alt="Fashion Banner"
                className="scroll-image rounded-lg shadow-lg w-full md:w-80 h-64 md:h-96 object-cover transition-all duration-500"
              />
            </div>

            {/* Image 2 */}
            <div className="w-full md:w-auto">
              <img
                src="https://i.pinimg.com/736x/e9/a7/89/e9a78931f5ff5b4eebd3286036c40179.jpg"
                alt="Fashion Banner"
                className="scroll-image rounded-lg shadow-lg w-full md:w-80 h-64 md:h-96 object-cover transition-all duration-500"
              />
            </div>

            {/* Image 3 */}
            <div className="w-full md:w-auto">
              <img
                src="https://i.pinimg.com/564x/1e/c2/56/1ec256520ac54a242d48184e65aef7cf.jpg"
                alt="Fashion Banner"
                className="scroll-image rounded-lg shadow-lg w-full md:w-80 h-64 md:h-96 object-cover transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Intro;