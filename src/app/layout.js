import { Anybody } from "next/font/google";
import "./style/globals.css";

const anybody = Anybody({
  subsets: ["latin"],
  variable: "--font-anybody",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Hackers",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="shortcut icon" href="img/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anybody:ital,wght@0,100..900;1,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${anybody.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
