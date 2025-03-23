// // app/product/[id]/page.tsx
// "use client"; // Đảm bảo component này là client component

// import ProductDetail from "./ProductDetail"; // Đường dẫn đến ProductDetail

// interface ProductPageProps {
//   params: {
//     id: string; // Đảm bảo id là kiểu string
//   };
// }

// // Sử dụng params để lấy id sản phẩm
// const ProductPage = ({ params }: ProductPageProps) => {
//   const { id } = params; // Lấy id từ params

//   return <ProductDetail id={id} />; // Truyền id vào ProductDetail
// };

// export default ProductPage;
