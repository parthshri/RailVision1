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

export type ProductSortOption =
  | "recommended"
  | "price-low-high"
  | "price-high-low"
  | "discount"
  | "name";

export const products: Product[] = [
  // =========================================================
  // FLAGSHIP
  // =========================================================

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

  // =========================================================
  // AFFORDABLE / ENTRY PRODUCTS
  // =========================================================

  {
    id: "laser-security-alarm",
    name: "Laser Security Alarm DIY Kit",
    slug: "laser-security-alarm",

    price: 349,
    originalPrice: 499,

    imageUrl: "/laser-security-alarm.png",
    status: "available",
    badge: "Budget STEM Kit",
    codAvailable: true,

    summary:
      "A low-cost DIY electronics project that uses a laser beam and light sensor to detect interruptions and trigger an alarm.",

    description:
      "The Laser Security Alarm DIY Kit is a beginner-friendly electronics project designed to demonstrate laser-based intrusion detection. A laser beam is continuously directed toward an LDR or photodiode sensor. When the beam is interrupted, the circuit triggers a buzzer alarm. The included PCB and electronic components make it ideal for soldering practice, STEM education, school science projects and basic electronics learning.",

    features: [
      "Laser beam interruption detection",
      "Buzzer-based alarm system",
      "Pre-designed PCB board",
      "Hands-on soldering experience",
      "Beginner to intermediate difficulty",
      "Ideal for school science projects",
      "Useful for STEM and electronics learning",
      "Compact and affordable project",
      "Demonstrates a real security-system concept"
    ],

    materialsIncluded: [
      "PCB board",
      "Electronic components",
      "LDR or photodiode sensor",
      "Buzzer",
      "Required resistors and components",
      "Connection components"
    ]
  },

  {
    id: "smart-dustbin-project-kit",
    name: "Smart Dustbin Project Kit",
    slug: "smart-dustbin-project-kit",

    price: 599,
    originalPrice: 999,

    imageUrl: "/smart-dustbin-project-kit.png",
    status: "available",
    badge: "Beginner Arduino Kit",
    codAvailable: true,

    summary:
      "Build a touch-free smart dustbin using Arduino, an ultrasonic sensor and servo motor while learning practical automation.",

    description:
      "The Smart Dustbin Project Kit is a beginner-friendly Arduino automation project that automatically opens a dustbin lid when a hand or object approaches. The HC-SR04 ultrasonic sensor measures distance and sends information to the Arduino UNO, which controls an SG90 servo motor to operate the lid. It is ideal for students who want hands-on experience with sensors, Arduino and automation.",

    features: [
      "Touch-free automatic lid opening",
      "HC-SR04 ultrasonic object detection",
      "Arduino UNO based project",
      "Servo-controlled lid mechanism",
      "No soldering required",
      "Easy DIY assembly",
      "Reusable electronic components",
      "Ideal for school science exhibitions",
      "Suitable for Arduino and automation learning"
    ],

    materialsIncluded: [
      "Arduino UNO Board",
      "HC-SR04 Ultrasonic Sensor",
      "SG90 Servo Motor",
      "Male-to-Male Jumper Wires",
      "Male-to-Female Jumper Wires",
      "USB Cable",
      "2 × 3.7V Rechargeable Li-ion Cells",
      "Assembly Screws"
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
      "Perfect for electronics learners"
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
    id: "smart-dustbin-pre-programmed",
    name: "Smart Dustbin Kit - Pre-Programmed",
    slug: "smart-dustbin-pre-programmed",

    price: 799,
    originalPrice: 1199,

    imageUrl: "/smart-dustbin-pre-programmed.png",
    status: "available",
    badge: "No Coding Required",
    codAvailable: true,

    summary:
      "A ready-to-assemble smart dustbin kit with a pre-programmed Arduino that requires no coding or soldering.",

    description:
      "The Pre-Programmed Smart Dustbin Kit lets students build a working touchless automation project without writing any code. The Arduino UNO comes already programmed. Simply assemble the components, connect the ultrasonic sensor and servo motor as instructed, and the system is ready to demonstrate automatic lid opening.",

    features: [
      "Pre-programmed Arduino UNO",
      "No coding required",
      "Touch-free automatic lid opening",
      "Ultrasonic object detection",
      "Servo motor based mechanism",
      "No soldering required",
      "Beginner-friendly assembly",
      "Reusable electronic components",
      "Excellent for science exhibitions"
    ],

    materialsIncluded: [
      "Pre-Programmed Arduino UNO",
      "HC-SR04 Ultrasonic Sensor",
      "SG90 Servo Motor",
      "Male-to-Male Jumper Wires",
      "Male-to-Female Jumper Wires",
      "USB Cable",
      "2 × 3.7V Rechargeable Li-ion Cells",
      "Assembly Screws"
    ]
  },

  // =========================================================
  // MID-RANGE STEM & ROBOTICS
  // =========================================================

  {
    id: "smart-irrigation-system",
    name: "Smart Irrigation System Kit",
    slug: "smart-irrigation-system",

    price: 1599,
    originalPrice: 2000,

    imageUrl: "/smart-irrigation-system.png",
    status: "available",
    badge: "Smart Automation Kit",
    codAvailable: true,

    summary:
      "A ready-to-use automatic plant watering system that monitors soil moisture and activates a water pump when plants need water.",

    description:
      "The Smart Irrigation System Kit demonstrates how sensors and automation can be used for intelligent plant watering. The pre-programmed system continuously monitors soil moisture and automatically switches on the water pump when the soil becomes dry. Once sufficient moisture is detected, the pump switches off. An LCD display shows the system status, making the project easy to understand and demonstrate.",

    features: [
      "Fully pre-programmed and ready to use",
      "No coding required",
      "Automatic soil moisture detection",
      "Automatic water pump control",
      "LCD system status display",
      "Relay-based automation",
      "Beginner-friendly design",
      "Ideal for smart agriculture demonstrations",
      "Suitable for school and college projects"
    ],

    materialsIncluded: [
      "LCD Display Module",
      "Water Pump",
      "Soil Moisture Sensor",
      "2 × Lithium Batteries",
      "Relay Module",
      "Pre-Programmed Control Setup",
      "Required Connecting Components"
    ]
  },

  {
    id: "bluetooth-rc-smart-robot-car",
    name: "Bluetooth RC Smart Robot Car",
    slug: "bluetooth-rc-smart-robot-car",

    price: 2399,
    originalPrice: 2799,

    imageUrl: "/bluetooth-rc-smart-robot-car.png",
    status: "available",
    badge: "Ready to Use",
    codAvailable: true,

    summary:
      "A fully assembled and pre-programmed Arduino robot car that can be controlled wirelessly using an Android smartphone.",

    description:
      "The Bluetooth RC Smart Robot Car is a ready-to-use robotics project built using Arduino UNO, HC-05 Bluetooth connectivity and an L298N motor driver. It arrives fully assembled, wired and programmed. Users simply connect the battery, pair the HC-05 module with a compatible Android Bluetooth controller app and start controlling the robot.",

    features: [
      "Fully assembled and ready to use",
      "Pre-programmed Arduino UNO",
      "No coding required",
      "Android Bluetooth smartphone control",
      "HC-05 Bluetooth module",
      "L298N motor driver",
      "Dual BO DC motors",
      "7.4V rechargeable battery support",
      "Transparent acrylic chassis",
      "Can be reprogrammed and customized later",
      "Ideal for robotics and STEM demonstrations"
    ],

    materialsIncluded: [
      "Pre-Built Bluetooth Robot Car",
      "Arduino UNO",
      "HC-05 Bluetooth Module",
      "L298N Motor Driver",
      "2 × BO Motors",
      "2 × Wheels",
      "Caster Wheel",
      "Required Wiring and Connectors",
      "7.4V Rechargeable Battery if selected with product"
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
    id: "wooden-diy-drone-kit",
    name: "Wooden DIY Drone Frame Kit",
    slug: "wooden-diy-drone-kit",

    price: 3249,
    originalPrice: 4099,

    imageUrl: "/wooden-diy-drone-kit.png",
    status: "available",
    badge: "Frame Only",
    codAvailable: false,

    summary:
      "A lightweight laser-cut wooden quadcopter frame designed for drone learning, STEM education and custom DIY drone projects.",

    description:
      "The Wooden DIY Drone Frame Kit is an educational quadcopter frame designed for students and hobbyists interested in drone building and aerodynamics. Its lightweight laser-cut wooden structure is easy to assemble and compatible with commonly used drone components. Important: this product contains the wooden frame and assembly hardware only. Motors, ESCs, propellers, flight controller, battery, transmitter and other electronics are not included.",

    features: [
      "Laser-cut wooden quadcopter frame",
      "DIY self-assembly design",
      "Lightweight wooden structure",
      "Suitable for drone learning",
      "Useful for STEM education",
      "Compatible with common drone components",
      "Ideal for students and robotics learners",
      "Electronic drone components not included"
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

  // =========================================================
  // PREMIUM PRODUCTS
  // =========================================================

  {
    id: "voice-control-ai-robot",
    name: "Voice Control AI Robot - Personal Assistant",
    slug: "voice-control-ai-robot",

    price: 7599,
    originalPrice: 9999,

    imageUrl: "/voice-control-ai-robot.png",
    status: "available",
    badge: "Advanced Robotics",
    codAvailable: false,

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

// =========================================================
// PRODUCT HELPERS
// =========================================================

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

export function getDiscountPercentage(product: Product) {
  if (
    product.originalPrice <= 0 ||
    product.price <= 0 ||
    product.originalPrice <= product.price
  ) {
    return 0;
  }

  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
}

export function sortProducts(
  productList: Product[],
  sortBy: ProductSortOption
) {
  const list = [...productList];

  switch (sortBy) {
    case "price-low-high":
      return list.sort((a, b) => {
        if (a.status === "coming-soon") return 1;
        if (b.status === "coming-soon") return -1;

        return a.price - b.price;
      });

    case "price-high-low":
      return list.sort((a, b) => {
        if (a.status === "coming-soon") return 1;
        if (b.status === "coming-soon") return -1;

        return b.price - a.price;
      });

    case "discount":
      return list.sort(
        (a, b) =>
          getDiscountPercentage(b) - getDiscountPercentage(a)
      );

    case "name":
      return list.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

    case "recommended":
    default:
      return list;
  }
}