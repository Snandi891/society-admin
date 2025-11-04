import "../styles/globals.css";
import Layout from "@/components/Layout";
import { Toaster } from "react-hot-toast";

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      {/* ✅ Global toast container */}
      <Toaster
        position="top-left" // change to top-left if you want
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(30,30,60,0.95)",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 20px",
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            boxShadow: "0 0 10px #a855f7, 0 0 20px #3b82f6, 0 0 30px #f472b6",
            border: "1px solid #a855f7",
          },
          success: {
            iconTheme: { primary: "#a855f7", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#f43f5e", secondary: "#fff" },
          },
        }}
      />
      <Component {...pageProps} />
    </Layout>
  );
}
