import { Product } from './productTypes'; // Đảm bảo đường dẫn đúng

const sampleProducts: Product[] = [
    {
      id: 1,
      name: "Áo thun Mickey",
      image: "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-5.jpg",
      price: 249000,
      gender: "female",
      color: "red", // Đảm bảo có trường này
      size: "M",   // Đảm bảo có trường này
    },
    {
      id: 2,
      name: "Áo hoodie xanh",
      image: "https://m.yodycdn.com/fit-in/filters:format(webp)/products/ao-khoac-nam-akm6017-nau-4.jpg",
      price: 499000,
      gender: "male",
      color: "blue", // Đảm bảo có trường này
      size: "L",   // Đảm bảo có trường này
    },
  ];
  
  export default sampleProducts;
  