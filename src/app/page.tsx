import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Services />
        <Gallery />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
