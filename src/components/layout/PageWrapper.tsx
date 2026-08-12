import * as React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PageTransition } from "./PageTransition";
import { getSiteConfig } from "@/lib/site-config";

export async function PageWrapper({ children }: { children: React.ReactNode }) {
    const config = await getSiteConfig();
    return (
        <>
            <Navbar config={config} />
            <main className="flex-grow flex flex-col">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
            <Footer />
        </>
    );
}
