import { Developers } from "./Developers.tsx";
import { Features } from "./Features.tsx";
import { FinalCta } from "./FinalCta.tsx";
import { Hero } from "./Hero.tsx";
import { HowItWorks } from "./HowItWorks.tsx";
import { SiteFooter } from "./SiteFooter.tsx";
import { SiteHeader } from "./SiteHeader.tsx";

export function LandingPage() {
  return (
    <>
      <title>HookRelay · Reliable webhook delivery</title>
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Developers />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
