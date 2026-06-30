export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: "available" | "coming-soon";
  imageUrl?: string;
  badge?: string;
  summary: string;
  features: string[];
};

export const products: Product[] = [
  {
    id: "railvision-junior",
    name: "RailVision Junior",
    slug: "railvision-junior",
    price: 8999,
    imageUrl: "/railvision-junior.png",
    status: "available",
    badge: "STEM Kit",
    summary:
      "A hands-on railway innovation kit for children to learn engineering, AI thinking, sensors, safety, and systems design.",
    features: [
      "Buildable track and inspection modules",
      "AI and safety challenge cards",
      "Sensor-inspired learning activities",
      "Parent and educator friendly guide"
    ]
  },

  {
    id: "object-detection-train",
    name: "Object Detection Train",
    slug: "object-detection-train",
    price: 1499,
    imageUrl: "/object-detection-train.png",
    status: "available",
    badge: "Smart Safety Kit",
    summary:
      "An intelligent railway model that detects another train or obstacle ahead and automatically stops to prevent collisions.",
    features: [
      "Automatic object detection",
      "Collision prevention system",
      "Infrared sensor technology",
      "Arduino Nano powered",
      "Automatic stop & restart",
      "Perfect STEM learning project"
    ]
  },

  {
    id: "railvision-pro",
    name: "RailVision Pro",
    slug: "railvision-pro",
    price: 0,
    status: "coming-soon",
    badge: "Coming Soon",
    summary:
      "An AI-powered wireless railway health monitoring system that transforms trains into moving inspection units.",
    features: [
      "AI defect detection",
      "GPS-linked alerts",
      "Predictive maintenance workflows",
      "Wireless train-mounted deployment"
    ]
  }
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function getProduct(id: string) {
  return products.find(
    (product) => product.id === id || product.slug === id
  );
}