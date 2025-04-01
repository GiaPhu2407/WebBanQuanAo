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
import SoLieu from "./SoLieu";
export default function Carousel() {
  useEffect(() => {
    AOS.init({ duration: 2500 });
  }, []);
  return (
    <div
      className="w-full h-[300px] md:h-[400px] mb-56 mt-24"
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
              src="https://m.yodycdn.com/fit-in/filters:format(webp)/fit-in/filters:format(webp)/products/m40pezoh9j22rf0z4lf1800x833.jpg "
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
              src="https://m.yodycdn.com/fit-in/filters:format(webp)/fit-in/filters:format(webp)/products/m4un33tko3kz0fuyxqra%20mat%20le%20hoi%201800x833.jpg"
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
              src="https://m.yodycdn.com/fit-in/filters:format(webp)/fit-in/filters:format(webp)/products/m3znur9zvuebk2kiqxk3110_1800x833%20copy.png"
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
              src="https://m.yodycdn.com/fit-in/filters:format(webp)/fit-in/filters:format(webp)/products/m3znuyyryyggerzrlgl3110_1800x833-07.png"
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
              src="https://i.pinimg.com/564x/5b/26/cd/5b26cd4f4f68a736a052694d7ae0a49d.jpg"
              alt="Beautiful Landscape 5"
            />
          </div>
        </SwiperSlide>
      </Swiper>
      
    </div>
  );
}
