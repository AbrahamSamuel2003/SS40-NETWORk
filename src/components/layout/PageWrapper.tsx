import * as React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PageTransition } from "./PageTransition";

export function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="flex-grow flex flex-col">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
            <Footer />
        </>
    );
}
