import Image from "next/image";
import GrokGradient from "./components/GrokGradient";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="h-screen">
      <Header />
      <GrokGradient />
    </div>
  );
}
