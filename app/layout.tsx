import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://your-domain.com";
const ogImage = "/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ashraful Islam Ashik | DevOps Engineer",
    template: "%s | Ashraful Islam Ashik",
  },
  description:
    "Portfolio of Ashraful Islam Ashik, a DevOps Engineer focused on Docker, Kubernetes, CI/CD, cloud infrastructure, monitoring, and scalable deployment workflows.",
  keywords: [
    "Ashraful Islam Ashik",
    "DevOps Engineer",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "AWS",
    "Prometheus",
    "Grafana",
    "Next.js Portfolio",
  ],
  authors: [{ name: "Ashraful Islam Ashik" }],
  creator: "Ashraful Islam Ashik",
  openGraph: {
    title: "Ashraful Islam Ashik | DevOps Engineer",
    description:
      "Explore the portfolio of Ashraful Islam Ashik, a DevOps Engineer specializing in cloud infrastructure, automation, CI/CD, and scalable systems.",
    url: siteUrl,
    siteName: "Ashraful Islam Ashik Portfolio",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Ashraful Islam Ashik Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashraful Islam Ashik | DevOps Engineer",
    description:
      "Portfolio of Ashraful Islam Ashik — DevOps Engineer focused on cloud, containers, CI/CD, and monitoring.",
    images: [ogImage],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>

        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast:
                "backdrop-blur-xl border border-white/10 bg-black/80 text-white",
              title: "text-white",
              description: "text-white/70",
            },
          }}
        />
      </body>
    </html>
  );
}
