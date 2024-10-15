import ProductList from "../../app/component/ProductList";
import sampleProducts from "../src/data/sampleProducts";

export default function Home() {
  return (
    <main>
      <h1>Our Products</h1>
      <ProductList products={sampleProducts} />
    </main>
  );
}
