import localFont from "next/font/local";

export const spaceGrotesk = localFont({
  src: "../assets/fonts/space-grotesk/SpaceGrotesk-Variable.woff2",
  variable: "--font-display-family",
  display: "swap",
  weight: "500 700",
  preload: true,
  fallback: ["Arial", "sans-serif"],
});

export const manrope = localFont({
  src: "../assets/fonts/manrope/Manrope-Variable.woff2",
  variable: "--font-body-family",
  display: "swap",
  weight: "400 700",
  preload: true,
  fallback: ["Arial", "sans-serif"],
});

export const ibmPlexSans = localFont({
  src: "../assets/fonts/ibm-plex-sans/IBMPlexSans-Variable.woff2",
  variable: "--font-finance-family",
  display: "swap",
  weight: "400 700",
  preload: false,
  fallback: ["Arial", "sans-serif"],
});

export const ibmPlexMono = localFont({
  src: [
    {
      path: "../assets/fonts/ibm-plex-mono/IBMPlexMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/ibm-plex-mono/IBMPlexMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-mono-family",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});
