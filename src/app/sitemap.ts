import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://railvisionjr.netlify.app",
      lastModified: new Date(),
    },
    {
      url: "https://railvisionjr.netlify.app/shop",
      lastModified: new Date(),
    },
    {
      url: "https://railvisionjr.netlify.app/about",
      lastModified: new Date(),
    },
    {
      url: "https://railvisionjr.netlify.app/contact",
      lastModified: new Date(),
    },
    {
      url: "https://railvisionjr.netlify.app/railvision-junior",
      lastModified: new Date(),
    },
    {
      url: "https://railvisionjr.netlify.app/railvision-pro",
      lastModified: new Date(),
    },
    {
      url: "https://railvisionjr.netlify.app/affiliate",
      lastModified: new Date(),
    },
  ];
}