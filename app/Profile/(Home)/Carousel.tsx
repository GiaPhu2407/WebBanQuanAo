"use client";

import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { PiBuildingApartment } from "react-icons/pi";

import AOS from "aos";
import "aos/dist/aos.css";
export default function Carousel() {
  useEffect(() => {
    AOS.init({ duration: 2500 });
  }, []);
  return (
    <div
      className="w-full h-[300px] md:h-[400px] mb-10 -mt-36"
      data-aos="fade-down"
    >
      {" "}
      {/* Adjusted height */}
      <Swiper
        spaceBetween={20}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div
            className="flex justify-center items-center h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/images/slide1.jpg)" }}
          >
            <img
              className="w-full max-h-[400px] object-cover" // Set a max height
              src="https://i.pinimg.com/564x/f3/3d/48/f33d4847eb962358dd1f0408fa436be7.jpg  "
              alt="Beautiful Landscape 1"
            />
          </div>
        </SwiperSlide>
        {/* Slide 2 */}
        <SwiperSlide>
          <div
            className="flex justify-center items-center h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/images/slide2.jpg)" }}
          >
            <img
              className="w-full max-h-[400px] object-cover" // Set a max height
              src="https://i.pinimg.com/564x/bd/d0/94/bdd09439260b11313694e9301a11574b.jpg"
              alt="Beautiful Landscape 2"
            />
          </div>
        </SwiperSlide>
        {/* Slide 3 */}
        <SwiperSlide>
          <div
            className="flex justify-center items-center h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/images/slide3.jpg)" }}
          >
            <img
              className="w-full max-h-[400px] object-cover" // Set a max height
              src="https://i.pinimg.com/564x/58/60/c4/5860c4e5dcb86475e04e746806861070.jpg"
              alt="Beautiful Landscape 3"
            />
          </div>
        </SwiperSlide>
        {/* Slide 4 */}
        <SwiperSlide>
          <div
            className="flex justify-center items-center h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/images/slide4.jpg)" }}
          >
            <img
              className="w-full max-h-[400px] object-cover" // Set a max height
              src="https://i.pinimg.com/564x/64/19/7e/64197e5711ba22aed676053aaa6546e3.jpg"
              alt="Beautiful Landscape 4"
            />
          </div>
        </SwiperSlide>
        {/* Slide 5 */}
        <SwiperSlide>
          <div
            className="flex justify-center items-center h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/images/slide5.jpg)" }}
          >
            <img
              className="w-full max-h-[400px] object-cover" // Set a max height
              src="https://i.pinimg.com/564x/5b/26/cd/5b26cd4f4f68a736a052694d7ae0a49d.jpg"
              alt="Beautiful Landscape 5"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
