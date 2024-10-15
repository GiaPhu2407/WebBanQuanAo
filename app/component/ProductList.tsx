import Link from "next/link";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  gender: string;
  color: string;
  size: string;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="w-3/4 p-4 ">
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg ">
            <Link href={""}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover mb-2"
            /></Link>
           
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">
              Price: {product.price.toLocaleString()}đ
            </p>
            <p className="text-sm text-gray-500">Size: {product.size}</p>
            <p className="text-sm text-gray-500">Color: {product.color}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
