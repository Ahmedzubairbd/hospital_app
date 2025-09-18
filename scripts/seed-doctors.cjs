#!/usr/bin/env node
/*
 * Seeds initial doctor directory data into the database.
 * Re-runnable: entries are upserted based on doctor id/email.
 */
const { PrismaClient } = require("@prisma/client");

const doctors = [
  {
    id: "mir-mahfuzul-haque-chowdhury",
    name: {
      en: "Prof. Dr. Mir Mahfuzul Haque Chowdhury",
      bn: "অধ্যাপক ডা. মীর মাহফুজুল হক চৌধুরী",
    },
    department: { en: "Medicine", bn: "মেডিসিন বিভাগ" },
    specialization: {
      en: "Internal Medicine Specialist",
      bn: "ইন্টারনাল মেডিসিন বিশেষজ্ঞ",
    },
    qualifications: [
      { en: "MBBS (Dhaka)", bn: "এমবিবিএস (ঢাকা)" },
      { en: "MD (Internal Medicine)", bn: "এমডি (ইন্টারনাল মেডিসিন)" },
    ],
    workplaces: [
      {
        en: "Professor, Medicine, Sir Salimullah Medical College & Mitford Hospital, Dhaka",
        bn: "অধ্যাপক, মেডিসিন, স্যার সলিমুল্লাহ মেডিকেল কলেজ ও মিটফোর্ড হাসপাতাল, ঢাকা",
      },
      {
        en: "Former Principal & Head of Medicine, Kushtia Medical College Hospital",
        bn: "প্রাক্তন অধ্যক্ষ ও বিভাগীয় প্রধান (মেডিসিন), কুষ্টিয়া মেডিকেল কলেজ হাসপাতাল",
      },
    ],
    visitingHours: {
      en: "Thursday 3:00 PM – 10:00 PM; Other days 10:00 AM – 8:00 PM",
      bn: "বৃহস্পতিবার বিকাল ৩টা – রাত ১০টা; অন্যান্য দিন সকাল ১০টা – রাত ৮টা",
    },
    description: {
      en: "Renowned professor with decades of leadership in internal medicine and compassionate patient care.",
      bn: "অভিজ্ঞ মেডিসিন বিশেষজ্ঞ যিনি দীর্ঘদিন ধরে রোগীদের আস্থার সঙ্গে সেবা দিয়ে আসছেন।",
    },
    focusAreas: [
      { en: "Internal Medicine", bn: "ইন্টারনাল মেডিসিন" },
      { en: "Chronic Disease Management", bn: "দীর্ঘমেয়াদি রোগ ব্যবস্থাপনা" },
    ],
    keywords: [
      "mir",
      "mahfuzul",
      "internal",
      "medicine",
      "professor",
      "মীর",
      "মাহফুজুল",
      "মেডিসিন",
    ],
    image:
      "/assets/doctors/Mir Mahfuzul Haque Chowdhury/MirMahfuzulHaque.jpg",
    branch: "Kushtia Branch",
    weekdays: "Sat-Thu",
    availableFrom: "10:00 AM",
  },
  {
    id: "abdul-malek",
    name: { en: "Dr. Md. Abdul Malek", bn: "ডা. মো. আব্দুল মালেক" },
    department: { en: "Orthopedics", bn: "অর্থোপেডিক বিভাগ" },
    specialization: {
      en: "Orthopedic, Trauma & Spine Surgeon",
      bn: "অর্থোপেডিক, ট্রমা ও স্পাইন সার্জন",
    },
    qualifications: [
      { en: "MBBS (Rajshahi)", bn: "এমবিবিএস (রাজশাহী)" },
      { en: "MS (Orthopedic Surgery)", bn: "এমএস (অর্থোপেডিক সার্জারি)" },
    ],
    workplaces: [
      {
        en: "National Institute of Traumatology & Orthopedic Rehabilitation (NITOR), Dhaka",
        bn: "পঙ্গু হাসপাতাল (নিটোর), ঢাকা",
      },
      {
        en: "Former Professor & Head of Orthopedics, Kushtia Medical College & Hospital",
        bn: "জ্যেষ্ঠ অধ্যাপক ও বিভাগীয় প্রধান (অর্থোপেডিক), কুষ্টিয়া মেডিকেল কলেজ ও হাসপাতাল",
      },
    ],
    visitingHours: {
      en: "Sat–Thu 3:00 PM – 9:00 PM; Fri 10:00 AM – 5:00 PM",
      bn: "শনি–বৃহস্পতিবার বিকাল ৩টা – রাত ৯টা; শুক্রবার সকাল ১০টা – বিকাল ৫টা",
    },
    description: {
      en: "Specialist in trauma, accident injuries and spine care with extensive surgical expertise.",
      bn: "ট্রমা, হাড় ভাঙা ও স্পাইন চিকিৎসায় অভিজ্ঞ বিশেষজ্ঞ সার্জন।",
    },
    focusAreas: [
      { en: "Spine Surgery", bn: "স্পাইন সার্জারি" },
      { en: "Joint Replacement", bn: "জয়েন্ট রিপ্লেসমেন্ট" },
    ],
    keywords: [
      "orthopedic",
      "trauma",
      "spine",
      "abdul",
      "malek",
      "অর্থোপেডিক",
      "ট্রমা",
      "স্পাইন",
    ],
    image: "/assets/doctors/Abdul Malek/AbdulMalek.jpg",
    branch: "Kushtia Branch",
    weekdays: "Sat-Fri",
    availableFrom: "3:00 PM",
  },
  {
    id: "abdullah-al-masud",
    name: { en: "Dr. Abdullah Al Masud", bn: "ডা. আবদুল্লাহ আল মাসুদ" },
    department: { en: "Cardiology", bn: "হৃদরোগ বিভাগ" },
    specialization: {
      en: "Cardiology, Medicine & Hypertension Specialist",
      bn: "হৃদরোগ, মেডিসিন ও উচ্চরক্তচাপ বিশেষজ্ঞ",
    },
    qualifications: [
      { en: "MBBS (Dhaka Medical College)", bn: "এমবিবিএস (ঢাকা মেডিকেল কলেজ)" },
      { en: "MD (Cardiology)", bn: "এমডি (কার্ডিওলজি)" },
    ],
    workplaces: [
      {
        en: "Assistant Professor (Cardiology), Kushtia Medical College",
        bn: "সহকারী অধ্যাপক (কার্ডিওলজি), কুষ্টিয়া মেডিকেল কলেজ",
      },
    ],
    visitingHours: {
      en: "Sat–Wed 3:00 PM – 8:00 PM; Fri by appointment; Thu closed",
      bn: "শনি–বুধবার বিকাল ৩টা – রাত ৮টা; শুক্রবার যোগাযোগ সাপেক্ষে; বৃহস্পতিবার বন্ধ",
    },
    description: {
      en: "Experienced cardiologist focusing on hypertension, rheumatic fever and complex cardiac cases.",
      bn: "হৃদরোগ, উচ্চরক্তচাপ ও বাতজ্বরের সমন্বিত চিকিৎসায় অভিজ্ঞ কার্ডিয়াক বিশেষজ্ঞ।",
    },
    focusAreas: [
      { en: "Cardiac Care", bn: "হৃদরোগ সেবা" },
      { en: "Hypertension Management", bn: "উচ্চরক্তচাপ ব্যবস্থাপনা" },
    ],
    keywords: [
      "cardiology",
      "heart",
      "masud",
      "hypertension",
      "হৃদরোগ",
      "কার্ডিওলজি",
      "মাসুদ",
    ],
    image: "/assets/doctors/masud/Masud.jpg",
    branch: "Kushtia Branch",
    weekdays: "Sat-Wed",
    availableFrom: "3:00 PM",
  },
  {
    id: "fahim-uz-zaman",
    name: { en: "Dr. Md. Fahim-Uz-Zaman", bn: "ডা. মো. ফাহিম-উজ-জামান" },
    department: { en: "Endocrinology", bn: "হরমোন ও ডায়াবেটিস বিভাগ" },
    specialization: {
      en: "Diabetes, Thyroid & Hormone Specialist",
      bn: "ডায়াবেটিস, থাইরয়েড ও হরমোন বিশেষজ্ঞ",
    },
    qualifications: [
      { en: "MBBS", bn: "এমবিবিএস" },
      { en: "DEM (Endocrinology)", bn: "ডিইএম (এন্ড্রোক্রাইনোলজি)" },
      { en: "MSCP (USA)", bn: "এমএসসিপি (ইউএসএ)" },
      {
        en: "Advanced Endocrinology Training, Mayo Clinic (USA)",
        bn: "অ্যাডভান্সড এন্ড্রোক্রাইনোলজি প্রশিক্ষণ, মায়ো ক্লিনিক (ইউএসএ)",
      },
    ],
    workplaces: [
      {
        en: "Assistant Professor, Endocrinology, Brahmanbaria Medical College Hospital",
        bn: "সহকারী অধ্যাপক, এন্ড্রোক্রাইনোলজি বিভাগ, ব্রাহ্মণবাড়িয়া মেডিকেল কলেজ হাসপাতাল",
      },
    ],
    visitingHours: {
      en: "Friday 11:00 AM – 5:00 PM",
      bn: "প্রতি শুক্রবার সকাল ১১টা – বিকাল ৫টা",
    },
    description: {
      en: "Provides comprehensive endocrine, thyroid and diabetes management with international training.",
      bn: "আন্তর্জাতিক প্রশিক্ষণপ্রাপ্ত এন্ড্রোক্রাইনোলজিস্ট যিনি ডায়াবেটিস ও হরমোনের সম্পূর্ণ সেবা প্রদান করেন।",
    },
    focusAreas: [
      { en: "Diabetes", bn: "ডায়াবেটিস" },
      { en: "Thyroid Disorders", bn: "থাইরয়েড রোগ" },
      { en: "Hormone Care", bn: "হরমোন সেবা" },
    ],
    keywords: [
      "endocrinology",
      "diabetes",
      "thyroid",
      "fahim",
      "জামান",
      "এন্ড্রোক্রাইন",
    ],
    image: "/assets/doctors/Fahim Uz Zaman/Fahim Uz Zaman.jpg",
    branch: "Jhinaidah Branch",
    weekdays: "Friday",
    availableFrom: "11:00 AM",
  },
  {
    id: "sukumar-chandra-chakraborty",
    name: { en: "Dr. Sukumar Chandra Chakraborty", bn: "ডা. সুকুমার চন্দ্র চক্রবর্তী" },
    department: { en: "Dermatology", bn: "চর্ম ও যৌনরোগ বিভাগ" },
    specialization: {
      en: "Dermatology, Venereology & Allergology Specialist",
      bn: "চর্ম, যৌন ও এলার্জি বিশেষজ্ঞ",
    },
    qualifications: [
      { en: "MBBS", bn: "এমবিবিএস" },
      { en: "DDV", bn: "ডিডিভি" },
      { en: "FWSO (India)", bn: "এফডব্লিউএসও (ভারত)" },
    ],
    workplaces: [
      {
        en: "Ex-Consultant, Chittagong Medical College Hospital",
        bn: "সাবেক কনসালটেন্ট, চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল",
      },
      {
        en: "Senior Consultant, Kushtia Medical College",
        bn: "সিনিয়র কনসালটেন্ট, কুষ্টিয়া মেডিকেল কলেজ",
      },
    ],
    visitingHours: {
      en: "Sun–Wed 4:00 PM – 9:00 PM; Thu 10:00 AM – 2:00 PM",
      bn: "রবি–বুধবার বিকাল ৪টা – রাত ৯টা; বৃহস্পতিবার সকাল ১০টা – দুপুর ২টা",
    },
    description: {
      en: "Comprehensive care for skin, venereal and allergy-related conditions.",
      bn: "ত্বক, যৌন এবং এলার্জিজনিত সমস্যা সমাধানে অভিজ্ঞ চিকিৎসক।",
    },
    focusAreas: [
      { en: "Dermatology", bn: "চর্মরোগ" },
      { en: "Allergy", bn: "এলার্জি" },
    ],
    keywords: [
      "dermatology",
      "skin",
      "sukumar",
      "চর্মরোগ",
      "এলার্জি",
    ],
    image: "/assets/doctors/Sukumar/SukumarChandra.jpg",
    branch: "Kushtia Branch",
    weekdays: "Sun-Thu",
    availableFrom: "4:00 PM",
  },
  {
    id: "sanjit-kumar",
    name: { en: "Dr. Sanjit Kumar", bn: "ডা. সঞ্জিত কুমার" },
    department: { en: "Radiology & Imaging", bn: "রেডিওলজি ও ইমেজিং" },
    specialization: {
      en: "Consultant Sonologist & Radiologist",
      bn: "কনসালটেন্ট সনোলজিস্ট ও রেডিওলজিস্ট",
    },
    qualifications: [
      { en: "MBBS", bn: "এমবিবিএস" },
      { en: "DMU (Dhaka)", bn: "ডিএমইউ (ঢাকা)" },
      { en: "PGT (Radiology & Imaging)", bn: "পিজিটি (রেডিওলজি ও ইমেজিং)" },
    ],
    workplaces: [
      {
        en: "Consultant Sonologist, Specialist Diagnostic Services",
        bn: "কনসালটেন্ট সনোলজিস্ট, বিশেষায়িত ডায়াগনস্টিক সেবা",
      },
    ],
    visitingHours: {
      en: "By appointment",
      bn: "যোগাযোগ সাপেক্ষে",
    },
    description: {
      en: "Performs advanced ultrasound imaging with pediatric and radiology expertise.",
      bn: "শিশু ও ডায়াগনস্টিক আল্ট্রাসাউন্ডে বিশেষ পারদর্শী।",
    },
    focusAreas: [
      { en: "Ultrasound", bn: "আল্ট্রাসাউন্ড" },
      { en: "Imaging", bn: "ইমেজিং" },
    ],
    keywords: [
      "ultrasound",
      "radiology",
      "sanjit",
      "কর্মকার",
      "রেডিওলজি",
    ],
    image: "/assets/doctors/Sanjit Kumar/SanjitKumar.jpg",
    branch: "Imaging Centre",
    weekdays: "By Appointment",
    availableFrom: "On Call",
  },
  {
    id: "sujit-kumar-pal",
    name: { en: "Dr. Sujit Kumar Pal", bn: "ডা. সুজিত কুমার পাল" },
    department: { en: "Radiology & Imaging", bn: "রেডিওলজি ও ইমেজিং" },
    specialization: {
      en: "Consultant Radiology & Imaging",
      bn: "কনসালটেন্ট রেডিওলজি ও ইমেজিং",
    },
    qualifications: [
      { en: "MBBS", bn: "এমবিবিএস" },
      { en: "DMU (Dhaka)", bn: "ডিএমইউ (ঢাকা)" },
      { en: "PGT (Radiology & Imaging)", bn: "পিজিটি (রেডিওলজি ও ইমেজিং)" },
      { en: "PGT (Medicine)", bn: "পিজিটি (মেডিসিন)" },
      {
        en: "Trained on Vascular Doppler & Fetal Anomaly",
        bn: "ভাসকুলার ডপলার ও ফিটাল অ্যানোমালিতে প্রশিক্ষণপ্রাপ্ত",
      },
    ],
    workplaces: [
      {
        en: "Specialist in Vascular Doppler & Fetal Anomaly Imaging",
        bn: "ভাসকুলার ডপলার ও ফিটাল অ্যানোমালি ইমেজিং বিশেষজ্ঞ",
      },
    ],
    visitingHours: {
      en: "By appointment",
      bn: "যোগাযোগ সাপেক্ষে",
    },
    description: {
      en: "Offers precision imaging for vascular and fetal assessments.",
      bn: "ভাসকুলার ও গর্ভস্থ শিশুর বিশেষায়িত ইমেজিং সেবা প্রদান করেন।",
    },
    focusAreas: [
      { en: "Doppler Studies", bn: "ডপলার স্টাডি" },
      { en: "Fetal Anomaly Scan", bn: "গর্ভস্থ শিশুর অ্যানোমালি স্ক্যান" },
    ],
    keywords: [
      "radiology",
      "imaging",
      "sujit",
      "ডপলার",
      "ইমেজিং",
    ],
    image: "/assets/doctors/Sujit kumar/SujitKumar.jpg",
    branch: "Imaging Centre",
    weekdays: "By Appointment",
    availableFrom: "On Call",
  },
  {
    id: "nasima-akhter",
    name: { en: "Dr. Nasima Akhter", bn: "ডা. নাসিমা আখতার" },
    department: { en: "Radiology & Imaging", bn: "রেডিওলজি ও ইমেজিং" },
    specialization: {
      en: "Consultant Radiology & Imaging",
      bn: "কনসালটেন্ট রেডিওলজি ও ইমেজিং",
    },
    qualifications: [
      { en: "MBBS", bn: "এমবিবিএস" },
      { en: "DMU (Dhaka)", bn: "ডিএমইউ (ঢাকা)" },
      { en: "PGT (Radiology & Imaging)", bn: "পিজিটি (রেডিওলজি ও ইমেজিং)" },
      { en: "Trained in TVS", bn: "টিভিএস-এ প্রশিক্ষিত" },
    ],
    workplaces: [
      {
        en: "Dedicated female imaging services",
        bn: "শুধুমাত্র মহিলা রোগীদের জন্য বিশেষ ইমেজিং সেবা",
      },
    ],
    visitingHours: {
      en: "By appointment (Female patients only)",
      bn: "যোগাযোগ সাপেক্ষে (শুধু মহিলা রোগীদের জন্য)",
    },
    description: {
      en: "Provides comfortable diagnostic imaging exclusively for female patients.",
      bn: "মহিলা রোগীদের জন্য নিরাপদ ও স্বস্তিদায়ক ডায়াগনস্টিক ইমেজিং সেবা প্রদান করেন।",
    },
    focusAreas: [
      { en: "Women’s Imaging", bn: "মহিলা ইমেজিং" },
      { en: "TVS", bn: "টিভিএস" },
    ],
    keywords: [
      "radiology",
      "nasima",
      "women",
      "ইমেজিং",
      "নাসিমা",
    ],
    image: "/assets/doctors/Nasima Akhter/NasimaAkter.jpg",
    branch: "Imaging Centre",
    weekdays: "By Appointment",
    availableFrom: "On Call",
  },
  {
    id: "md-amzad-hossain-pramanik",
    name: {
      en: "Dr. Md. Amzad Hossain Pramanik",
      bn: "ডা. মো. আমজাদ হোসেন প্রামানিক",
    },
    department: { en: "Neuromedicine", bn: "নিউরো বিভাগ" },
    specialization: {
      en: "Neuromedicine Specialist",
      bn: "নিউরোমেডিসিন বিশেষজ্ঞ",
    },
    qualifications: [
      { en: "MBBS (Dhaka)", bn: "এমবিবিএস (ঢাকা)" },
      { en: "BCS (Health)", bn: "বিসিএস (স্বাস্থ্য)" },
      { en: "MD (Neuromedicine)", bn: "এমডি (নিউরোমেডিসিন)" },
    ],
    workplaces: [
      {
        en: "Assistant Professor (Neuromedicine), Rajshahi Medical College Hospital",
        bn: "সহকারী অধ্যাপক (নিউরোমেডিসিন), রাজশাহী মেডিকেল কলেজ হাসপাতাল",
      },
    ],
    visitingHours: {
      en: "Friday 12:00 PM – 6:00 PM",
      bn: "প্রতি শুক্রবার দুপুর ১২টা – সন্ধ্যা ৬টা",
    },
    description: {
      en: "Experienced specialist for brain, spine and complex nerve disorders.",
      bn: "মস্তিষ্ক, স্পাইন ও স্নায়ুরোগের অভিজ্ঞ বিশেষজ্ঞ।",
    },
    focusAreas: [
      { en: "Neurology", bn: "নিউরোলজি" },
      { en: "Stroke Care", bn: "স্ট্রোক সেবা" },
    ],
    keywords: [
      "neurology",
      "stroke",
      "pramanik",
      "নিউরো",
    ],
    image: "/assets/doctors/Amzad Hossain/AmzadHossain.jpg",
    branch: "Kushtia Branch",
    weekdays: "Friday",
    availableFrom: "12:00 PM",
  },
  {
    id: "imtiaz-ahmed",
    name: { en: "Dr. Imtiaz Ahmed", bn: "ডা. ইমতিয়াজ আহমেদ" },
    department: { en: "Pathology", bn: "প্যাথলজি বিভাগ" },
    specialization: {
      en: "Cyto & Histopathology Specialist",
      bn: "সাইটো ও হিস্টোপ্যাথলজি বিশেষজ্ঞ",
    },
    qualifications: [
      { en: "MBBS", bn: "এমবিবিএস" },
      { en: "MPhil (Pathology)", bn: "এমফিল (প্যাথলজি)" },
    ],
    workplaces: [
      {
        en: "Associate Professor & Head (Pathology), Kushtia Medical College",
        bn: "সহযোগী অধ্যাপক ও বিভাগীয় প্রধান (প্যাথলজি), কুষ্টিয়া মেডিকেল কলেজ",
      },
    ],
    visitingHours: {
      en: "Sat, Sun, Tue, Wed, Thu & Fri; Monday closed",
      bn: "শনিবার, রবিবার, মঙ্গলবার, বুধবার, বৃহস্পতিবার ও শুক্রবার; সোমবার বন্ধ",
    },
    description: {
      en: "Diagnostic expert highly skilled in cytopathology and histopathology.",
      bn: "সাইটো ও হিস্টোপ্যাথলজিতে বিশেষ পারদর্শী ডায়াগনস্টিক বিশেষজ্ঞ।",
    },
    focusAreas: [
      { en: "Diagnostic Pathology", bn: "ডায়াগনস্টিক প্যাথলজি" },
      { en: "Histopathology", bn: "হিস্টোপ্যাথলজি" },
    ],
    keywords: [
      "pathology",
      "cytopathology",
      "histopathology",
      "imtiaz",
      "প্যাথলজি",
    ],
    image: "/assets/doctors/Imtiaz Ahmed/ImtiazAhmed.jpg",
    branch: "Diagnostic Lab",
    weekdays: "Sat-Sun-Tue-Wed-Thu-Fri",
    availableFrom: "10:00 AM",
  },
  {
    id: "mh-chowdhury-mintu",
    name: { en: "Prof. Dr. M H Chowdhury (Mintu)", bn: "অধ্যাপক ডা. এম এইচ চৌধুরী (মিন্টু)" },
    department: { en: "Dermatology", bn: "চর্মরোগ বিভাগ" },
    specialization: {
      en: "Dermatology & Venereology Specialist",
      bn: "চর্ম ও যৌনরোগ বিশেষজ্ঞ",
    },
    qualifications: [
      { en: "MBBS", bn: "এমবিবিএস" },
      { en: "BCS (Health)", bn: "বিসিএস (স্বাস্থ্য)" },
      { en: "MD (Dermatology & Venereology)", bn: "এমডি (চর্ম ও যৌন রোগ)" },
    ],
    workplaces: [
      {
        en: "Professor & Head, Dermatology & Venereology, Khulna Medical College Hospital",
        bn: "অধ্যাপক ও বিভাগীয় প্রধান (চর্ম ও যৌন রোগ বিভাগ), খুলনা মেডিকেল কলেজ হাসপাতাল",
      },
    ],
    visitingHours: {
      en: "Thursday 2:00 PM – 8:00 PM",
      bn: "প্রতি বৃহস্পতিবার দুপুর ২টা – রাত ৮টা",
    },
    description: {
      en: "Renowned dermatologist with decades of expertise in skin and venereal diseases.",
      bn: "চর্ম ও যৌনরোগে দীর্ঘ অভিজ্ঞতার অধিকারী প্রখ্যাত বিশেষজ্ঞ।",
    },
    focusAreas: [
      { en: "Dermatology", bn: "চর্মরোগ" },
      { en: "Venereology", bn: "যৌনরোগ" },
    ],
    keywords: [
      "dermatology",
      "venereology",
      "mintu",
      "চর্ম",
    ],
    image: "/assets/doctors/M H Chowdhury/MHChowdhury.jpg",
    branch: "Kushtia Branch",
    weekdays: "Thursday",
    availableFrom: "2:00 PM",
  },
  {
    id: "sm-khasruzzaman-mukul",
    name: { en: "Dr. S.M. Khasruzzaman (Mukul)", bn: "ডা. এস.এম. খসরুজ্জামান (মুকুল)" },
    department: { en: "Gastroenterology", bn: "গ্যাস্ট্রোএন্টারোলজি বিভাগ" },
    specialization: {
      en: "Medicine, Liver & Gastroenterology Specialist",
      bn: "মেডিসিন, লিভার ও গ্যাস্ট্রোএন্টারোলজি বিশেষজ্ঞ",
    },
    qualifications: [
      { en: "MBBS (Dhaka Medical College)", bn: "এমবিবিএস (ঢাকা মেডিকেল কলেজ)" },
      { en: "MD (Gastroenterology)", bn: "এমডি (গ্যাস্ট্রোএন্টারোলজি)" },
    ],
    workplaces: [
      {
        en: "Associate Professor (Gastroenterology), Kushtia Medical College & Hospital",
        bn: "সহযোগী অধ্যাপক (গ্যাস্ট্রোএন্টারোলজি), কুষ্টিয়া মেডিকেল কলেজ ও হাসপাতাল",
      },
    ],
    visitingHours: {
      en: "Sat–Thu 7:00 PM – 10:00 PM; Friday closed",
      bn: "শনি–বৃহস্পতিবার সন্ধ্যা ৭টা – রাত ১০টা; শুক্রবার বন্ধ",
    },
    description: {
      en: "Provides advanced care for liver, digestive and jaundice conditions.",
      bn: "লিভার, পরিপাকতন্ত্র ও জন্ডিস রোগের উন্নত সেবা প্রদান করেন।",
    },
    focusAreas: [
      { en: "Liver Care", bn: "লিভার সেবা" },
      { en: "Digestive Health", bn: "পরিপাক স্বাস্থ্য" },
    ],
    keywords: [
      "gastroenterology",
      "liver",
      "mukul",
      "লিভার",
      "গ্যাস্ট্রো",
    ],
    image: "/assets/doctors/SM Khasruzzaman/SMKhasruzzaman.jpg",
    branch: "Kushtia Branch",
    weekdays: "Sat-Thu",
    availableFrom: "7:00 PM",
  },
  {
    id: "md-ayub-ali",
    name: { en: "Dr. Md. Ayub Ali", bn: "ডা. মো. আইয়ুব আলী" },
    department: { en: "Pediatrics", bn: "শিশু বিভাগ" },
    specialization: {
      en: "Neonatal & Child Health Specialist",
      bn: "নবজাতক ও শিশু রোগ বিশেষজ্ঞ",
    },
    qualifications: [
      { en: "MBBS", bn: "এমবিবিএস" },
      { en: "BCS (Health)", bn: "বিসিএস (স্বাস্থ্য)" },
      { en: "DCH", bn: "ডিসিএইচ" },
      { en: "MSC", bn: "এমএসসি" },
    ],
    workplaces: [
      {
        en: "Former Associate Professor & Head (Pediatrics), Kushtia Medical College & Hospital",
        bn: "সাবেক সহযোগী অধ্যাপক ও বিভাগীয় প্রধান (শিশু), কুষ্টিয়া মেডিকেল কলেজ ও হাসপাতাল",
      },
    ],
    visitingHours: {
      en: "Daily 9:00 AM – 1:00 PM & 4:00 PM – 8:00 PM; Friday 9:00 AM – 1:00 PM",
      bn: "প্রতিদিন সকাল ৯টা – দুপুর ১টা ও বিকাল ৪টা – রাত ৮টা; শুক্রবার সকাল ৯টা – দুপুর ১টা",
    },
    description: {
      en: "Veteran neonate and child specialist providing long-standing care.",
      bn: "দীর্ঘ অভিজ্ঞতাসম্পন্ন নবজাতক ও শিশু রোগ বিশেষজ্ঞ।",
    },
    focusAreas: [
      { en: "Neonatal Care", bn: "নবজাতক সেবা" },
      { en: "Child Nutrition", bn: "শিশু পুষ্টি" },
    ],
    keywords: [
      "pediatrics",
      "neonatal",
      "ayub",
      "শিশু",
    ],
    image: "/assets/doctors/Ayub Ali/AyubAli.jpg",
    branch: "Kushtia Branch",
    weekdays: "Daily",
    availableFrom: "9:00 AM",
  },
  {
    id: "firoz-ahmed",
    name: { en: "Dr. Firoz Ahmed", bn: "ডা. ফিরোজ আহমেদ" },
    department: { en: "Pediatrics", bn: "শিশু বিভাগ" },
    specialization: {
      en: "Pediatric Specialist",
      bn: "শিশু রোগ বিশেষজ্ঞ",
    },
    qualifications: [
      { en: "MBBS (Dhaka)", bn: "এমবিবিএস (ঢাকা)" },
      { en: "MD (Pediatrics)", bn: "এমডি (শিশু)" },
    ],
    workplaces: [
      {
        en: "Assistant Professor (Pediatrics), Kushtia Medical College",
        bn: "সহকারী অধ্যাপক (শিশু বিভাগ), কুষ্টিয়া মেডিকেল কলেজ",
      },
    ],
    visitingHours: {
      en: "Sat–Thu 4:00 PM – 8:00 PM; Friday by appointment",
      bn: "শনি–বৃহস্পতিবার বিকাল ৪টা – রাত ৮টা; শুক্রবার যোগাযোগ সাপেক্ষে",
    },
    description: {
      en: "Experienced in acute and chronic pediatric care.",
      bn: "জরুরি ও দীর্ঘমেয়াদি শিশু রোগের অভিজ্ঞ চিকিৎসক।",
    },
    focusAreas: [
      { en: "Pediatric Wellness", bn: "শিশু সুস্থতা" },
      { en: "Immunization", bn: "টিকাদান" },
    ],
    keywords: [
      "pediatrics",
      "immunization",
      "firoz",
      "শিশু",
    ],
    image: "/assets/doctors/Firoz Ahmed/FirozAhmed.jpg",
    branch: "Kushtia Branch",
    weekdays: "Sat-Thu",
    availableFrom: "4:00 PM",
  },
  {
    id: "shahin-akter-sumon",
    name: { en: "Dr. Shahin Akter Sumon", bn: "ডা. শাহিন আকতার সুমন" },
    department: { en: "Pediatrics", bn: "শিশু বিভাগ" },
    specialization: {
      en: "Pediatric Specialist",
      bn: "শিশু রোগ বিশেষজ্ঞ",
    },
    qualifications: [
      { en: "MBBS", bn: "এমবিবিএস" },
      { en: "BCS (Health)", bn: "বিসিএস (স্বাস্থ্য)" },
      { en: "CMU", bn: "সিএমইউ" },
      { en: "MD (Pediatrics)", bn: "এমডি (শিশু মেডিসিন)" },
      { en: "FCPS (Final)", bn: "এফসিপিএস (শেষ পর্ব)" },
    ],
    workplaces: [
      {
        en: "250-Bed General Hospital, Kushtia",
        bn: "২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল, কুষ্টিয়া",
      },
    ],
    visitingHours: {
      en: "Fri, Sat, Mon & Wed 3:00 PM – 8:00 PM",
      bn: "শুক্র, শনি, সোম ও বুধবার বিকাল ৩টা – রাত ৮টা",
    },
    description: {
      en: "Trusted pediatrician for child growth, development and wellness.",
      bn: "শিশুর বৃদ্ধি, বিকাশ ও সুস্থতায় বিশ্বস্ত শিশু রোগ বিশেষজ্ঞ।",
    },
    focusAreas: [
      { en: "Child Development", bn: "শিশুর বিকাশ" },
      { en: "General Pediatrics", bn: "সাধারণ শিশু রোগ" },
    ],
    keywords: [
      "pediatrics",
      "development",
      "sumon",
      "শিশু",
    ],
    image: "/assets/doctors/Shahin Akter/ShahinAkter.jpg",
    branch: "Kushtia Branch",
    weekdays: "Fri-Sat-Mon-Wed",
    availableFrom: "3:00 PM",
  },
  {
    id: "sabiha-akter",
    name: { en: "Dr. Sabiha Akter", bn: "ডা. সাবিহা আক্তার" },
    department: { en: "Pediatrics", bn: "শিশু বিভাগ" },
    specialization: {
      en: "Pediatric Specialist",
      bn: "শিশু রোগ বিশেষজ্ঞ",
    },
    qualifications: [
      { en: "MBBS", bn: "এমবিবিএস" },
      { en: "BCS (Health)", bn: "বিসিএস (স্বাস্থ্য)" },
      { en: "FCPS (Pediatrics)", bn: "এফসিপিএস (শিশু)" },
    ],
    workplaces: [
      {
        en: "Assistant Professor (Pediatrics), Kushtia Medical College",
        bn: "সহকারী অধ্যাপক (শিশু বিভাগ), কুষ্টিয়া মেডিকেল কলেজ",
      },
    ],
    visitingHours: {
      en: "Sat–Thu 4:00 PM – 7:00 PM; Friday closed",
      bn: "শনি–বৃহস্পতিবার বিকাল ৪টা – সন্ধ্যা ৭টা; শুক্রবার বন্ধ",
    },
    description: {
      en: "Dedicated to preventive pediatrics and modern child care.",
      bn: "শিশুদের প্রতিরোধমূলক সেবা ও আধুনিক চিকিৎসায় নিবেদিত।",
    },
    focusAreas: [
      { en: "Preventive Pediatrics", bn: "প্রতিরোধমূলক শিশু সেবা" },
      { en: "Adolescent Health", bn: "কিশোর স্বাস্থ্য" },
    ],
    keywords: [
      "pediatrics",
      "preventive",
      "sabiha",
      "শিশু",
    ],
    image: "/assets/doctors/Sabiha Akter/SabihaAkter.jpg",
    branch: "Kushtia Branch",
    weekdays: "Sat-Thu",
    availableFrom: "4:00 PM",
  },
  {
    id: "piyush-kumar-saha",
    name: { en: "Dr. Piyush Kumar Saha", bn: "ডা. পিযূষ কুমার সাহা" },
    department: { en: "Medicine", bn: "মেডিসিন বিভাগ" },
    specialization: {
      en: "Medicine Specialist",
      bn: "মেডিসিন বিশেষজ্ঞ",
    },
    qualifications: [
      { en: "MBBS (Dhaka)", bn: "এমবিবিএস (ঢাকা)" },
      { en: "BCS (Health)", bn: "বিসিএস (স্বাস্থ্য)" },
    ],
    workplaces: [
      {
        en: "Upazila Health & Family Planning Officer, Mirpur, Kushtia",
        bn: "উপজেলা স্বাস্থ্য ও পরিবার পরিকল্পনা কর্মকর্তা, মিরপুর, কুষ্টিয়া",
      },
    ],
    visitingHours: {
      en: "Sat–Thu 4:00 PM – 9:00 PM; Friday 10:00 AM – 3:00 PM",
      bn: "শনি–বৃহস্পতিবার বিকাল ৪টা – রাত ৯টা; শুক্রবার সকাল ১০টা – বিকাল ৩টা",
    },
    description: {
      en: "Community-focused physician for general medicine and chronic care.",
      bn: "সামাজিক স্বাস্থ্যসেবায় নিবেদিত সাধারণ মেডিসিন চিকিৎসক।",
    },
    focusAreas: [
      { en: "General Medicine", bn: "সাধারণ মেডিসিন" },
      { en: "Chronic Care", bn: "দীর্ঘমেয়াদি সেবা" },
    ],
    keywords: [
      "medicine",
      "chronic",
      "piyush",
      "মেডিসিন",
    ],
    image: "/assets/doctors/Piyush Kumar/PiyushKumar.jpg",
    branch: "Kushtia Branch",
    weekdays: "Sat-Thu",
    availableFrom: "4:00 PM",
  },
];

function normalizeLocale(locale) {
  if (!locale) return undefined;
  const en = (locale.en || "").trim();
  const bn = (locale.bn || en).trim();
  return { en, bn: bn || en };
}

function normalizeLocaleArray(values) {
  if (!Array.isArray(values)) return [];
  return values
    .map(normalizeLocale)
    .filter((value) => value && (value.en || value.bn));
}

async function seed() {
  const prisma = new PrismaClient();
  try {
    for (const doc of doctors) {
      const email = `${doc.id}@seed.amin-diagnostics.local`.replace(/\s+/g, "");
      const userId = `seed-user-${doc.id}`;

      const user = await prisma.user.upsert({
        where: { id: userId },
        update: {
          name: doc.name.en,
          email,
          role: "DOCTOR",
        },
        create: {
          id: userId,
          name: doc.name.en,
          email,
          role: "DOCTOR",
        },
      });

      const directoryProfile = {
        name: normalizeLocale(doc.name),
        department: normalizeLocale(doc.department),
        specialization: normalizeLocale(doc.specialization),
        visitingHours: normalizeLocale(doc.visitingHours),
        description: normalizeLocale(doc.description),
        qualifications: normalizeLocaleArray(doc.qualifications),
        workplaces: normalizeLocaleArray(doc.workplaces),
        focusAreas: normalizeLocaleArray(doc.focusAreas),
        image: doc.image,
      };

      await prisma.doctor.upsert({
        where: { id: doc.id },
        update: {
          userId: user.id,
          specialization: doc.specialization.en,
          department: doc.department.en,
          sliderPictureUrl: doc.image,
          schedule: doc.visitingHours.en,
          visitingHours: doc.visitingHours.en,
          keywords: doc.keywords,
          directoryProfile,
          availableFrom: doc.availableFrom,
          availableTo: doc.branch,
          weekdays: doc.weekdays,
        },
        create: {
          id: doc.id,
          userId: user.id,
          specialization: doc.specialization.en,
          department: doc.department.en,
          sliderPictureUrl: doc.image,
          schedule: doc.visitingHours.en,
          visitingHours: doc.visitingHours.en,
          keywords: doc.keywords,
          directoryProfile,
          availableFrom: doc.availableFrom,
          availableTo: doc.branch,
          weekdays: doc.weekdays,
        },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error("Failed to seed doctors", error);
  process.exit(1);
});
