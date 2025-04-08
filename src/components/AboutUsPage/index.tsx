"use client"
import { ReactLenis } from '@studio-freight/react-lenis'
import NavigationBar from '../Common/NavigationBar';
import { AboutUs } from './AboutUs';
import Footer from '../Common/Footer';
export const AboutUsPage = () => {
    return (
        <ReactLenis root>
            <main className="min-h-screen bg-background">
                <NavigationBar />
                <AboutUs />
                <Footer />
            </main>
        </ReactLenis>
    );
};

export default AboutUsPage; 