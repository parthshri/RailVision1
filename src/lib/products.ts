export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: "available" | "coming-soon";
  imageUrl?: string;
  badge?: string;
  summary: string;
  description: string;
  features: string[];
  materialsIncluded: string[];
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
    description:
      "RailVision Junior is a complete STEM railway learning kit that introduces children to railway engineering, AI concepts, railway safety, inspection systems and problem-solving through interactive activities and practical learning.",
    features: [
      "Buildable track and inspection modules",
      "AI and safety challenge cards",
      "Sensor-inspired learning activities",
      "Parent and educator friendly guide"
    ],
    materialsIncluded: [
      "Railway track components",
      "Mini train model",
      "Electronic components",
      "Sensors",
      "Connecting wires",
      "Activity cards",
      "Instruction guide",
      "RailVision stickers"
    ]
  },

  {
    id: "object-detection-train",
    name: "Object Detection Train",
    slug: "object-detection-train",
    price: 3499,
    imageUrl: "/object-detection-train.png",
    status: "available",
    badge: "Smart Safety Kit",
    summary:
      "An intelligent railway model that detects another train or obstacle ahead and automatically stops to prevent collisions.",
    description:
      "This railway safety project demonstrates automatic collision prevention using infrared sensors and Arduino. Perfect for school projects and STEM learning.",
    features: [
      "Automatic object detection",
      "Collision prevention system",
      "Infrared sensor technology",
      "Arduino Nano powered",
      "Automatic stop & restart",
      "Perfect STEM learning project"
    ],
    materialsIncluded: [
      "Arduino Nano",
      "IR Sensors",
      "Mini train",
      "DC motor",
      "Battery holder",
      "Relay module",
      "Connecting wires",
      "Instruction guide"
    ]
  },

  {
    id: "railvision-inventor-kit",
    name: "RailVision Inventor Kit",
    slug: "railvision-inventor-kit",
    price: 599,
    imageUrl: "/railvision-inventor-kit.png",
    status: "available",
    badge: "Best Seller",
    summary:
      "A beginner-friendly electronics learning kit packed with essential components for building exciting circuits and STEM projects.",
    description:
      "The RailVision Inventor Kit is specially designed for beginners to learn electronics through practical experiments. It helps students understand circuits, LEDs, sensors, motors and basic electronics without any prior experience.",
    features: [
      "400-point breadboard included",
      "Jumper wires & assorted LEDs",
      "Resistors, buttons & potentiometer",
      "Buzzer, RGB LED & LDR sensor",
      "Mini DC motor included",
      "Printed beginner guide",
      "QR code with video tutorials",
      "Reusable component storage box"
    ],
    materialsIncluded: [
      "400-point Breadboard",
      "Jumper wire pack",
      "20 Assorted LEDs",
      "40 Assorted resistors",
      "5 Push buttons",
      "10K Potentiometer",
      "Active buzzer",
      "LDR sensor",
      "RGB LED",
      "Mini DC Motor",
      "Battery clip",
      "Storage box"
    ]
  },
  {
  id: "railvision-science-explorer-kit",
  name: "RailVision Science Explorer Kit",
  slug: "railvision-science-explorer-kit",
  price: 499,
  imageUrl: "/railvision-science-explorer-kit.png",
  status: "available",
  badge: "Value Pack",
  summary:
    "An all-in-one beginner science project kit with motors, LEDs, switches, a solar panel, water pump and other essential components for creative school projects.",
  description:
    "The RailVision Science Explorer Kit is designed for students who want to build exciting working science models and understand the basics of electricity, renewable energy, motors and electronic circuits. With a wide variety of ready-to-use components, students can create solar-powered models, water pump projects, LED circuits, alarms, fans and many other school science exhibition projects.",
  features: [
    "Complete beginner-friendly science project kit",
    "Solar panel for renewable energy experiments",
    "Mini water pump with connecting pipe",
    "Multiple DC motors and fan blades",
    "Assorted coloured LEDs and resistors",
    "Different switches for circuit control",
    "Buzzer and high-brightness torch LED",
    "Battery holders and power connectors included",
    "Ideal for school science exhibitions",
    "Suitable for students, beginners and young inventors",
    "Build multiple reusable working models",
    "Convenient reusable storage and packing box"
  ],
  materialsIncluded: [
    "1 Mini Solar Panel",
    "1 Mini Water Pump",
    "1 Transparent Water Pipe Roll",
    "1 Standard DC Motor",
    "1 Mini Toy DC Motor",
    "1 Pink Three-Blade Fan",
    "1 Purple Fan Blade",
    "2 AA Batteries",
    "1 Two-Cell AA Battery Holder",
    "1 9V Battery",
    "1 9V Battery Connector Clip",
    "Assorted Connecting Wires",
    "5 Red LEDs",
    "5 Green LEDs",
    "5 Yellow LEDs",
    "5 Blue LEDs",
    "Assorted Multicolour LEDs",
    "Assorted Resistors",
    "3 Rocker Switches",
    "1 Round Rocker Switch",
    "1 Push Button Switch",
    "1 Slide Switch",
    "1 High-Brightness Torch LED Module",
    "1 Electronic Buzzer",
    "2 Wire Connectors",
    "Assorted Screws, Nuts and Washers",
    "1 Roll of Double-Sided Tape",
    "1 Reusable Project Storage Box"
  ]
},
  {
    id: "railvision-traffic-signal-kit",
    name: "RailVision Traffic Signal Project Kit",
    slug: "railvision-traffic-signal-kit",
    price: 899,
    imageUrl: "/railvision-traffic-signal-kit.png",
    status: "available",
    badge: "School Project",
    summary:
      "A complete Arduino-based traffic signal project kit perfect for science exhibitions, STEM learning, and beginner programming.",
    description:
      "Build a fully functional traffic signal system using Arduino. This kit is ideal for school exhibitions, engineering beginners and anyone interested in embedded electronics.",
    features: [
      "Arduino Nano compatible board",
      "Complete traffic light circuit",
      "Breadboard & jumper wires",
      "Red, yellow & green LEDs",
      "USB programming cable",
      "Circuit diagram included",
      "Arduino source code provided",
      "Project report template"
    ],
    materialsIncluded: [
      "Arduino Nano",
      "USB Cable",
      "Breadboard",
      "Jumper wire pack",
      "3 Red LEDs",
      "3 Yellow LEDs",
      "3 Green LEDs",
      "220Ω Resistors",
      "Push Button",
      "Circuit Diagram",
      "Project Report",
      "RailVision Sticker"
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
    description:
      "RailVision Pro is our flagship enterprise-grade railway inspection platform that continuously monitors railway tracks using AI-powered onboard inspection technology.",
    features: [
      "AI defect detection",
      "GPS-linked alerts",
      "Predictive maintenance workflows",
      "Wireless train-mounted deployment"
    ],
    materialsIncluded: [
      "Enterprise hardware",
      "Wireless sensor modules",
      "AI inspection unit",
      "Cloud dashboard",
      "Installation support"
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