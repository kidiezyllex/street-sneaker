"use client"
import { ReactLenis } from '@studio-freight/react-lenis'
import { HeroBanner } from './HeroBanner';
import { BrandLogos } from './BrandLogos';
import { Categories } from './Categories';
import { Testimonials } from './Testimonials';
import { Newsletter } from './Newsletter';
import { NewsletterPopup } from './NewsletterPopup';
import { Collections } from './Collections';
import { NewArrivals } from './NewArrivals';
import { BestSeller } from './BestSeller';
import { HotDeals } from './HotDeals';
import Footer from '../Common/Footer';
import NavigationBar from '../Common/NavigationBar';

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
                <BestSeller />
                <HotDeals />
                <Testimonials />
                <Newsletter />
                <Footer />
                {/* <NewsletterPopup /> */}
            </main>
        </ReactLenis>
    );
};

export default HomePage; 