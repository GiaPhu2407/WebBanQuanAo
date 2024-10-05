"use client";
import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // Update height based on container's actual size
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.scrollHeight);
    }
  }, [containerRef]);

  // Hook to track the scroll progress within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transformations for height and opacity based on scroll position
  const heightTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, containerHeight]
  );
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
          Hành Trình Phát Triển Của GiPuDiHi (2020-2024)
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm">
          Dòng thời gian về cách chúng tôi bắt đầu và phát triển cửa hàng quần
          áo GiPuDiHi trong 5 năm qua.
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto pb-24">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Timeline scrolling line */}
        <div
          style={{
            height: containerHeight + "px",
          }}
          className="absolute left-8 top-0 overflow-hidden w-[2px] bg-neutral-200 dark:bg-neutral-700"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

// Example data for the timeline
const timelineData: TimelineEntry[] = [
  {
    title: "2020 - Khởi Đầu",
    content: (
      <p>
        Năm 2020, GiPuDiHi bắt đầu với bộ sưu tập nhỏ gồm các sản phẩm quần áo
        được chọn lọc kỹ càng. Chúng tôi tập trung vào chất lượng vải và thiết
        kế vượt thời gian. Khách hàng đầu tiên chủ yếu là gia đình và bạn bè, và
        chúng tôi bán thông qua các nền tảng mạng xã hội như Instagram.
      </p>
    ),
  },
  {
    title: "2021 - Cửa Hàng Online Đầu Tiên",
    content: (
      <p>
        Sau khi tạo dựng được danh tiếng tại địa phương, chúng tôi đã ra mắt cửa
        hàng online đầu tiên vào năm 2021. Điều này giúp GiPuDiHi tiếp cận được
        với nhiều khách hàng hơn. Chúng tôi cũng bắt đầu thử nghiệm marketing
        qua những người có ảnh hưởng (influencers) và hợp tác để quảng bá thương
        hiệu. Doanh số bán hàng tăng đều đặn, và chúng tôi bắt đầu mở rộng dòng
        sản phẩm.
      </p>
    ),
  },
  {
    title: "2022 - Vươn Ra Quốc Tế",
    content: (
      <p>
        Đến năm 2022, GiPuDiHi đã phát triển đáng kể và bắt đầu cung cấp dịch vụ
        vận chuyển quốc tế. Chúng tôi hợp tác với các nhà phân phối quốc tế và
        tăng cường sự hiện diện thương hiệu tại các quốc gia như Anh và Úc. Đây
        cũng là năm đầu tiên GiPuDiHi tham gia các buổi trình diễn thời trang.
      </p>
    ),
  },
  {
    title: "2023 - Mở Rộng Ra Cửa Hàng Vật Lý",
    content: (
      <p>
        Với sự phát triển mạnh mẽ toàn cầu, năm 2023 GiPuDiHi đã khai trương cửa
        hàng lớn đầu tiên tại New York. Đây là một cột mốc quan trọng trong hành
        trình phát triển của chúng tôi. Chúng tôi cũng mở rộng các nỗ lực tiếp
        thị kỹ thuật số, sử dụng phân tích dữ liệu để hiểu rõ hơn về khách hàng.
      </p>
    ),
  },
  {
    title: "2024 - Năm Của Sự Đổi Mới",
    content: (
      <p>
        Năm 2024, GiPuDiHi tập trung vào đổi mới và bền vững. Chúng tôi đã ra
        mắt dòng sản phẩm quần áo thân thiện với môi trường và giới thiệu công
        nghệ AR (thực tế ảo tăng cường) trong cửa hàng trực tuyến, cho phép
        khách hàng "thử" quần áo ảo trước khi mua. Điều này đã giúp cải thiện
        đáng kể sự tương tác của khách hàng.
      </p>
    ),
  },
];

// Usage example in a page
const MyTimelinePage = () => {
  return <Timeline data={timelineData} />;
};

export default MyTimelinePage;
