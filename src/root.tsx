import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import Navbar from "./components/Navbar";
import "./styles/globals.css";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>SportsDataDrop - Monetize Your Sports Videos</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="description" content="Monetize your sports videos - AI startups pay for your data" />
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <Body>
        <div class="min-h-screen bg-background">
          <Navbar />
          <Suspense>
            <ErrorBoundary>
              <Routes>
                <FileRoutes />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </div>
        <Scripts />
      </Body>
    </Html>
  );
}
