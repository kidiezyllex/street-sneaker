"use client"
import { ReactLenis } from '@studio-freight/react-lenis'
import { NavigationBar } from './NavigationBar';
import { HeroBanner } from './HeroBanner';
import { BrandLogos } from './BrandLogos';
import { Categories } from './Categories';
import { FeaturedProducts } from './FeaturedProducts';
import { Testimonials } from './Testimonials';
import { Newsletter } from './Newsletter';
import { Footer } from './Footer';
import { NewsletterPopup } from './NewsletterPopup';
import { Collections } from './Collections';
import { NewArrivals } from './NewArrivals';
import { BestSeller } from './BestSeller';
import { HotDeals } from './HotDeals';

export const HomePage = () => {
    return (
        <ReactLenis root>
            <main className="min-h-screen bg-background">
                <NavigationBar />
                <HeroBanner />
                <BrandLogos />
                <Categories />
                <Collections />
                <NewArrivals />
                {/* <FeaturedProducts /> */}
                <BestSeller />
                <HotDeals />
                <Testimonials />
                <Newsletter />
                <Footer />
                <NewsletterPopup />
            </main>
        </ReactLenis>
    );
};

export default HomePage; 