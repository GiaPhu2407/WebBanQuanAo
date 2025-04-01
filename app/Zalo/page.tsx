import { ZaloChat } from "../component/ZaloChart";

export default function Home() {
  return (
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 className="text-4xl font-bold mb-8">Welcome to Our Website</h1>
      <p className="text-lg mb-4">Chat with us on Zalo!</p>

      <ZaloChat
        oaId="2288580799185233701"
        welcomeMessage="Xin chào! Chúng tôi có thể giúp gì cho bạn?"
      />
    </div>
  );
}
