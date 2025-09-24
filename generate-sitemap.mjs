import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// This helps resolve the directory path correctly in an ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define your site's base URL
const hostname = "https://sharkyai.xyz";

// ✅ This list is created based on your App.tsx file.
// It includes all public-facing pages you want Google to index.
const routes = [
  "/",
  "/contact",
  "/about",
  "/privacy", // Updated path
  "/refund", // Updated path
  "/terms", // Updated path
  "/dashboard",
  "/dashboard/tools",
  "/dashboard/models",
  "/dashboard/billing",
  "/dashboard/generate/image",
  "/dashboard/generate/video",
  "/dashboard/generate/voice",
  "/dashboard/edit/image",
  "/dashboard/upscale/image",
  "/dashboard/bgremove/image",
  "/dashboard/generate/avatar",
  "/download",
  // NOTE: We do NOT include private routes (/dashboard/profile) or auth routes (/login).
];

// Create a stream to write to
const stream = new SitemapStream({ hostname });

// Create an array of link objects for the sitemap
const links = routes.map((url) => {
  return {
    url: url,
    changefreq: "weekly", // How often you expect the page to change
    priority: url === "/" ? 1.0 : 0.8, // Set homepage priority to max
  };
});

// Generate the sitemap XML from your links
streamToPromise(Readable.from(links).pipe(stream))
  .then((data) => {
    // Define the output path in your `public` folder
    const sitemapPath = path.resolve(__dirname, "public", "sitemap.xml");

    // Write the sitemap file
    fs.writeFileSync(sitemapPath, data.toString());
    console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
  })
  .catch((error) => {
    console.error("❌ Error generating sitemap:", error);
    process.exit(1); // Exit with error code if sitemap generation fails
  });
