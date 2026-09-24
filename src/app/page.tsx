import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Booking from "@/components/Booking";
import BookAcuity from "@/components/BookAcuity";
import Footer from "@/components/Footer";
import { BOOKING_MODE } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Services />
        <Gallery />
        {BOOKING_MODE === "inhouse" ? <Booking /> : <BookAcuity />}
      </main>
      <Footer />
    </>
  );
}
