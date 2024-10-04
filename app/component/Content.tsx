import Link from "next/link";
import React from "react";

const Content = () => {
  return (
    <div className="mt-10 ml-10">
      <div className=" flex gap-4">
        <Link className="text-[#83cccc] font-semibold " href={""}>Trang Chủ</Link>
        {">"}
        <Link href={""}>Dọn Kho Sale To</Link>
      </div>
    </div>
  );
};

export default Content;
