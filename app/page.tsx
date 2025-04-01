import Header from "./Profile/(Home)/Header";
import Carousel from "./Profile/(Home)/Carousel";
import Content from "./Profile/(Home)/Content";
import Footer from "./Profile/(Home)/Footer";
import CozeChat from "./component/CozeAI";
import SoLieu from "./Profile/(Home)/SoLieu";
import TawkMessenger from "./component/TawkMesseger";
import { div } from "@tensorflow/tfjs";
export default function Home() {
  return (
    <div>
      <Header />
      <Carousel />
      <SoLieu />
      <Content />
      <TawkMessenger />
      <Footer />
    </div>
  );
}
