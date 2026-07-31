export type Product = {
  id: string;
  name: string;
  slug: string;

  // Current selling price
  price: number;

  // Struck-through price
  originalPrice: number;

  status: "available" | "coming-soon";
  imageUrl?: string;
  badge?: string;
  summary: string;
  description: string;
  features: string[];
  materialsIncluded: string[];
  codAvailable: boolean;
};

export const products: Product[] = [
  {
    id: "railvision-junior",
    name: "RailVision Junior",
    slug: "railvision-junior",

    price: 6499,
    originalPrice: 7999,

    imageUrl: "/railvision-junior.png",
    status: "available",
    badge: "Railway STEM Kit",
    codAvailable: false,

    summary:
      "A hands-on railway innovation kit that helps students learn railway safety, electronics, sensors, automation and engineering through practical experimentation.",

    description:
      "RailVision Junior is an advanced railway STEM learning kit designed for students, science exhibitions and innovation competitions. It introduces railway engineering, sensor-based safety systems, automation and practical problem-solving through a complete working railway model.",

    features: [
      "Complete working railway STEM model",
      "Sensor-based railway safety concepts",
      "Hands-on electronics and automation learning",
      "Suitable for science exhibitions",
      "Designed for STEM and engineering education",
      "Beginner-friendly project explanation",
      "Ideal for school innovation competitions",
      "Practical railway safety demonstration"
    ],

    materialsIncluded: [
      "Railway track components",
      "Mini train model",
      "Electronic control components",
      "Sensors",
      "Connecting wires",
      "Power supply components",
      "Project explanation guide",
      "RailVision support access"
    ]
  },

  {
    id: "automatic-railway-gate-control-system",
    name: "Automatic Railway Gate Control System",
    slug: "automatic-railway-gate-control-system",

    price: 3249,
    originalPrice: 3999,

    imageUrl: "/automatic-railway-gate-control-system.png",
    status: "available",
    badge: "Science Exhibition Project",
    codAvailable: false,

    summary:
      "A fully working automatic railway gate project that uses sensors and a motor to open and close the gate when a train is detected.",

    description:
      "The Automatic Railway Gate Control System is an educational railway safety project that demonstrates how automation can improve safety at railway crossings. When a train is detected, the project automatically operates the gate using a sensor-based motor control system. It is ideal for school exhibitions, Inspire Award projects, STEM learning and innovation competitions.",

    features: [
      "Automatic railway gate opening and closing",
      "Sensor-based train detection",
      "Motor-controlled gate mechanism",
      "Working railway crossing demonstration",
      "Battery or DC-powered operation",
      "Suitable for middle and high school students",
      "Ideal for Inspire Award projects",
      "Ready-made working science project",
      "Easy to demonstrate and explain"
    ],

    materialsIncluded: [
      "Railway gate structure",
      "Railway track model",
      "Mini train model",
      "Sensor module",
      "Motor mechanism",
      "Control circuit",
      "Connecting wires",
      "Power supply components",
      "Project explanation support"
    ]
  },
  {
  id: "train-accident-prevention-system",
  name: "Train Accident Prevention System",
  slug: "train-accident-prevention-system",

  price: 2999,
  originalPrice: 3999,

  imageUrl: "/train-accident-prevention-system.png",
  status: "available",
  badge: "Science Exhibition Project",
  codAvailable: false,

  summary:
    "An Arduino-based railway safety project that detects obstacles on railway tracks using an ultrasonic sensor to help prevent train collisions.",

  description:
    "The Train Accident Prevention System using Ultrasonic Sensor is an Arduino-based science project that demonstrates smart railway safety through real-time obstacle detection. When an obstacle is detected on the track, the system activates alerts and can be programmed to stop the train, showcasing practical applications of automation, sensors, and embedded systems. It is ideal for science exhibitions, engineering projects, STEM education, and innovation competitions.",

  features: [
    "Arduino UNO based controller",
    "HC-SR04 ultrasonic obstacle detection",
    "Real-time railway safety demonstration",
    "Automatic collision prevention concept",
    "LED and buzzer alert system",
    "Ideal for school science exhibitions",
    "Perfect for engineering and STEM learning",
    "Easy to understand and explain",
    "Working railway automation project"
  ],

  materialsIncluded: [
    "Arduino UNO",
    "HC-SR04 Ultrasonic Sensor",
    "Mini Train Model",
    "Railway Track",
    "LED Indicators",
    "Buzzer",
    "Connecting Wires",
    "Power Supply Components",
    "Project Guide & Support"
  ]
},
  {
    id: "combined-train-platform-accident-prevention",
    name: "Combined Train & Platform Accident Prevention",
    slug: "combined-train-platform-accident-prevention",

    price: 8999,
    originalPrice: 9999,

    imageUrl: "/combined-train-platform-accident-prevention.png",
    status: "available",
    badge: "Advanced Railway Safety Project",
    codAvailable: false,

    summary:
      "An advanced railway safety project combining train accident prevention and platform safety systems in one working model.",

    description:
      "The Combined Train and Platform Accident Prevention Project demonstrates how sensor-based systems can improve passenger and railway safety. It combines multiple safety concepts in one model, making it suitable for major science exhibitions, innovation competitions, Inspire Award projects and advanced STEM demonstrations.",

    features: [
      "Combined railway and platform safety system",
      "Train accident prevention demonstration",
      "Platform safety monitoring concept",
      "Sensor-based automatic operation",
      "Advanced working railway model",
      "Suitable for major science exhibitions",
      "Ideal for innovation competitions",
      "Practical railway safety explanation",
      "Designed for STEM and engineering learning"
    ],

    materialsIncluded: [
      "Railway track model",
      "Mini train model",
      "Platform model",
      "Safety sensor modules",
      "Electronic control components",
      "Motor and movement components",
      "Connecting wires",
      "Power supply components",
      "Project explanation support"
    ]
  },

  {
    id: "wooden-diy-drone-kit",
    name: "Wooden DIY Drone Kit",
    slug: "wooden-diy-drone-kit",

    price: 3249,
    originalPrice: 4099,

    imageUrl: "/wooden-diy-drone-kit.png",
    status: "available",
    badge: "Prepaid Orders Only",
    codAvailable: false,

    summary:
      "A lightweight laser-cut wooden quadcopter frame kit designed for drone learning, STEM education and hands-on DIY projects.",

    description:
      "The Wooden DIY Drone Kit is an educational quadcopter frame designed for students and hobbyists to learn drone building and aerodynamics. Its lightweight laser-cut wooden structure is easy to assemble and compatible with commonly used drone components such as BLDC motors, ESCs and flight controllers. This product includes the wooden frame kit only; electronic drone components are not included.",

    features: [
      "Laser-cut wooden quadcopter frame",
      "DIY self-assembly design",
      "Lightweight wooden structure",
      "Suitable for drone learning",
      "Useful for STEM education",
      "Compatible with common drone components",
      "Ideal for students and robotics learners",
      "Suitable for DIY electronics projects",
      "Prepaid orders only"
    ],

    materialsIncluded: [
      "Laser-cut wooden drone frame parts",
      "Wooden quadcopter arms",
      "Central frame plates",
      "Motor mounting sections",
      "Assembly hardware",
      "Assembly guide"
    ]
  },

  {
    id: "obstacle-avoiding-robot",
    name: "Obstacle Avoiding Robot",
    slug: "obstacle-avoiding-robot",

    price: 4499,
    originalPrice: 6999,

    imageUrl: "/obstacle-avoiding-robot.png",
    status: "available",
    badge: "Arduino Robotics Kit",
    codAvailable: false,

    summary:
      "An Arduino-based smart robot that detects obstacles using an ultrasonic sensor and automatically changes direction to avoid collisions.",

    description:
      "The Obstacle Avoiding Robot is an Arduino-based smart robotics project that detects obstacles in its path and automatically changes direction. It uses an HC-SR04 ultrasonic sensor to measure distance and an L293D motor driver to control the N20 DC gear motors. The project demonstrates robotics, sensors, automation and basic intelligent decision-making, making it suitable for school exhibitions, STEM education and engineering students.",

    features: [
      "Automatic obstacle detection",
      "Automatic collision avoidance",
      "Arduino UNO controlled",
      "HC-SR04 ultrasonic sensor",
      "L293D motor driver module",
      "N20 DC gear motors",
      "Battery-powered operation",
      "Demonstrates robotics and automation",
      "Suitable for school exhibitions",
      "Ideal for STEM and engineering learning"
    ],

    materialsIncluded: [
      "Arduino UNO",
      "HC-SR04 ultrasonic sensor",
      "L293D motor driver module",
      "N20 DC gear motors",
      "Robot wheels",
      "Robot chassis",
      "Battery holder",
      "Connecting wires",
      "Mounting hardware",
      "Project explanation support"
    ]
  },
  {
  id: "wireless-power-transfer-system",
  name: "Wireless Power Transfer DIY Project Kit",
  slug: "wireless-power-transfer-system",

  price: 649,
  originalPrice: 999,

  imageUrl: "/wireless-power-transfer-system.png",
  status: "available",
  badge: "COD Available",
  codAvailable: true,

  summary:
    "An educational DIY kit that demonstrates wireless electricity transmission using electromagnetic induction for STEM learning and science projects.",

  description:
    "The Wireless Power Transfer DIY Project Kit demonstrates how electrical energy can be transferred without a direct wired connection using electromagnetic induction. The system consists of a transmitter and receiver coil that wirelessly powers an LED or other small compatible load when correctly aligned. Designed for students, hobbyists and STEM learners, this project provides hands-on experience with wireless energy transfer, inductive coupling and basic electronics.",

  features: [
    "Demonstrates wireless electricity transmission",
    "Based on electromagnetic induction",
    "Wireless LED power demonstration",
    "DIY learning project",
    "Ideal for STEM education",
    "Suitable for science exhibitions",
    "Easy to understand working principle",
    "Perfect for electronics learners",
    "Prepaid orders only"
  ],

  materialsIncluded: [
    "Wireless transmitter coil",
    "Wireless receiver coil",
    "Power transfer circuit board",
    "LED indicator",
    "Connecting wires",
    "Assembly guide"
  ]
},
{
  id: "voice-control-ai-robot",
  name: "Voice Control AI Robot - Personal Assistant",
  slug: "voice-control-ai-robot",

  price: 7599,
  originalPrice: 9999,

  imageUrl: "/voice-control-ai-robot.png",
  status: "available",
  badge: "New Arrival",
  codAvailable: true,

  summary:
    "A smart Arduino and IoT based robotics kit that responds to voice commands and demonstrates AI, automation and robotics concepts.",

  description:
    "The Voice Control AI Robot Personal Assistant is a complete robotics learning kit that combines Arduino, voice recognition, IoT connectivity and robotic movement into a single educational project. The robot responds to configured voice commands, performs movement, interacts with users and demonstrates smart automation concepts. Designed for advanced STEM learning, robotics enthusiasts and engineering students, this project introduces AI, IoT and embedded systems through practical hands-on learning.",

  features: [
    "Voice-controlled robot",
    "Arduino based controller",
    "Bluetooth and Wi-Fi connectivity",
    "AI and IoT learning project",
    "Supports robotic movement",
    "Wi-Fi camera integration",
    "Ideal for robotics competitions",
    "Perfect for engineering projects",
    "Full working project kit"
  ],

  materialsIncluded: [
    "Arduino controller",
    "Robot chassis",
    "N20 DC motors",
    "Motor driver",
    "Voice control module",
    "Wi-Fi camera",
    "Speaker",
    "Battery holder",
    "Connecting wires",
    "Required electronics components"
  ]
},
{
  id: "smart-walking-shoes-blind",
  name: "Smart Walking Shoes for Blind",
  slug: "smart-walking-shoes-blind",

  price: 2799,
  originalPrice: 4500,

  imageUrl: "/smart-walking-shoes-blind.png",
  status: "available",
  badge: "Best Seller",
  codAvailable: true,

  summary:
    "An Arduino-based assistive technology project that detects nearby obstacles using ultrasonic sensors and alerts the user through buzzer or vibration.",

  description:
    "The Smart Walking Shoes for Blind project is an educational assistive technology kit designed to demonstrate obstacle detection using ultrasonic sensors and Arduino. The system continuously measures the distance to nearby objects and provides alerts through a buzzer or vibration when obstacles are detected. This project introduces students to wearable electronics, sensors, Arduino programming and real-world engineering applications while promoting innovation in assistive technology.",

  features: [
    "Ultrasonic obstacle detection",
    "Arduino Nano based project",
    "Buzzer or vibration alert",
    "Wearable electronics demonstration",
    "Assistive technology project",
    "Ideal for STEM learning",
    "Suitable for science exhibitions",
    "Easy to assemble and program",
    "Full working project kit"
  ],

  materialsIncluded: [
    "Arduino Nano",
    "Ultrasonic sensor",
    "Buzzer or vibration module",
    "Battery",
    "Connecting wires",
    "Shoe platform",
    "Required electronic components",
    "Project documentation"
  ]
},
{
  id: "train-platform-accident-prevention-system",
  name: "Train Platform Accident Prevention System",
  slug: "train-platform-accident-prevention-system",

  price: 2999,
  originalPrice: 4999,

  imageUrl: "/train-platform-accident-prevention-system.png",
  status: "available",
  badge: "RailVision Original",
  codAvailable: true,

  summary:
    "A railway safety science project that demonstrates automatic platform accident prevention using sensors and smart detection technology.",

  description:
    "The Train Platform Accident Prevention System is an educational railway safety project developed to demonstrate how sensors and automated control systems can help reduce accidents near railway platforms. The project detects potentially unsafe situations and activates warning or preventive mechanisms to improve passenger safety. It is designed for STEM learning, railway technology demonstrations, science exhibitions and engineering projects while introducing students to automation, sensors and embedded systems.",

  features: [
    "Railway safety demonstration",
    "Automatic accident prevention concept",
    "Sensor-based detection system",
    "Real-world engineering application",
    "STEM learning project",
    "Suitable for science exhibitions",
    "Ideal for railway technology learning",
    "Hands-on electronics project",
    "Full working demonstration model"
  ],

  materialsIncluded: [
    "Controller board",
    "Safety sensors",
    "Warning indicator modules",
    "Power supply components",
    "Connecting wires",
    "Project structure",
    "Required electronic components",
    "Assembly guide"
  ]
},

  {
    id: "railvision-pro",
    name: "RailVision Pro",
    slug: "railvision-pro",

    price: 0,
    originalPrice: 0,

    status: "coming-soon",
    badge: "Coming Soon",
    codAvailable: false,
    imageUrl: "/railvision-pro.png",
    summary:
      "An AI-powered wireless railway health monitoring system that transforms trains into moving inspection units.",

    description:
      "RailVision Pro is an enterprise railway inspection platform designed to continuously monitor railway tracks using AI-powered train-mounted inspection technology.",

    features: [
      "AI-powered defect detection",
      "GPS-linked railway alerts",
      "Predictive maintenance workflows",
      "Wireless train-mounted deployment",
      "Continuous railway track monitoring"
    ],

    materialsIncluded: [
      "Enterprise inspection hardware",
      "Wireless sensor modules",
      "AI processing unit",
      "Monitoring dashboard",
      "Installation and technical support"
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
    (product) =>
      product.id === id ||
      product.slug === id
  );
}