import Header from "./Profile/(Home)/Header";
import Carousel from "./Profile/(Home)/Carousel";
import Content from "./Profile/(Home)/Content";
import Footer from "./Profile/(Home)/Footer";
import CozeChat from "./component/CozeAI";
export default function Home() {
  return (
    <div>
      <Header />
      <Carousel />
      <Content />
      {/* <CozeChat/> */}
      <Footer />
    </div>
  );
}
