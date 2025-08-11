import About from "./_components/about";
import AppDemo from "./_components/app-demo";
import CallToAction from "./_components/call-to-action";
import FAQ from "./_components/faq";
import Features from "./_components/features";
import Footer from "./_components/footer";
import HeaderSection from "./_components/header-section";

export default function LandingPage() {
  return (
    <div className="mt-16">
      <div className="absolute inset-0 z-0 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div>
        <HeaderSection />
        <AppDemo />
        <Features />
        <About />
        <FAQ />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}
