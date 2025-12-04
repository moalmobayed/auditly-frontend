import AppHeader from "@/components/landing/AppHeader";
import HeroSection from "@/components/landing/HeroSection";
import Features from "@/components/landing/Features";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import Blog from "@/components/landing/Blog";
import CallToAction from "@/components/landing/CallToAction";
import AppFooter from "@/components/landing/AppFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <AppHeader />
      <HeroSection />
      <div className="py-16">
        <Features />
      </div>
      <div className="py-16">
        <Stats />
      </div>
      <div className="py-16">
        <Testimonials />
      </div>
      <div className="py-16">
        <Blog />
      </div>
      <CallToAction />
      <AppFooter />
    </main>
  );
}
