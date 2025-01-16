"use client";

import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { PiBuildingApartment } from "react-icons/pi";

import AOS from "aos";
// import "aos/dist/aos.css";
export default function Carousel() {
  useEffect(() => {
    AOS.init({ duration: 2500 });
  }, []);
  return (
    <div
      className="w-full h-[300px] md:h-[400px] mb-10 mt-20"
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
              className="w-full max-h-[600px] object-cover" // Set a max height
              src="https://m.yodycdn.com/fit-in/filters:format(webp)/fit-in/filters:format(webp)/products/m5m4v2jay7nq3hwttmjbanner-do-dong-giu-am-ypdy.jpg"
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
              className="w-full max-h-[600px] object-cover" // Set a max height
              src="https://m.yodycdn.com/fit-in/filters:format(webp)/fit-in/filters:format(webp)/products/m5yxae8pe7574hqejuh141_1800x833.png"
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
              className="w-full max-h-[600px] object-cover" // Set a max height
              src="https://m.yodycdn.com/fit-in/filters:format(webp)/fit-in/filters:format(webp)/products/m5hlczwhfjj3ueo3lssbanner-mini-cls-tet-1800x833.jpg"
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
              className="w-full max-h-[600px] object-cover" // Set a max height
              src="https://m.yodycdn.com/fit-in/filters:format(webp)/fit-in/filters:format(webp)/products/m5m4v2jay7nq3hwttmjbanner-do-dong-giu-am-ypdy.jpg"
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
              className="w-full max-h-[600px] object-cover" // Set a max height
              src="https://m.yodycdn.com/fit-in/filters:format(webp)/fit-in/filters:format(webp)/products/m5m4v2jay7nq3hwttmjbanner-do-dong-giu-am-ypdy.jpg"
              alt="Beautiful Landscape 5"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
