import { useEffect, useMemo, useRef, useState } from "react";

import club6amImage from "./assets/6am.jpg";
import lumpiniRunningImage from "./assets/Lumpini Running.png";
import bangkokRunnersImage from "./assets/Runner Bangkok.jpg";
import antiRunClubImage from "./assets/Anti Run.png";
import sabaiRunClubImage from "./assets/Sabai.jpg";
import roadRunImage from "./assets/Loadlann.jpg";
import mitrMilesImage from "./assets/mitrmile.jpg";
import sdrcImage from "./assets/sdrc.jpg";
import runriseLogo from "./assets/runrise-logo.png";
import pocariRunriseBanner from "./assets/pocari-runrise.jpg";
import sabaiRunriseBanner from "./assets/sabai-runrise.jpg";
import adidasRunriseBanner from "./assets/adidas-runrise.jpg";

type Role = "runner" | "founder";

type AppLanguage = "en" | "th";

type UserAccount = {
  name: string;
  email: string;
  password: string;
};

type Page =
  | "welcome"
  | "login"
  | "register"
  | "role"
  | "runner-onboarding"
  | "founder-onboarding"
  | "runner-home"
  | "runner-events"
  | "all-clubs"
  | "club"
  | "compare-select"
  | "compare"
  | "event"
  | "myruns"
  | "friends"
  | "friends-chat"
  | "friend-qr"
  | "runner-profile"
  | "notifications"
  | "founder-dashboard"
  | "founder-club"
  | "founder-events"
  | "founder-members"
  | "founder-profile";

type RunnerProfile = {
  name: string;

  // Phase 1 onboarding fields
  runningExperience: string;
  preferredDistance: string;
  province: string;

  // Existing fields are preserved for backward compatibility
  // and for the current matching / Founder prototype logic.
  level: string;
  pace: string;
  distance: string;
  location: string[];
  parks: string[];
  time: string;
  goal: string[];
  vibe: string[];
};


type FounderSetupProfile = {
  roleInClub: string;
  clubName: string;
  clubDescription: string;
  clubImageMock: string;

  baseType: string;
  activities: string[];

  levels: string[];
  paceRanges: string[];
  distances: string[];

  province: string;
  locations: string[];
  parks: string[];

  days: string[];
  times: string[];

  vibe: string[];
};

type RunEvent = {
  id: number;
  clubId: number;
  name: string;
  date: string;
  time: string;
  location: string;
  distance: string;
  pace: string;
  capacity: number;
  participants: number;
  meetingPoint: string;
  route: string;
  whatToBring: string;
};

type Club = {
  id: number;
  name: string;
  location: string;
  pace: string;
  distance: string;
  schedule: string;
  level: string;
  vibe: string[];
  description: string;
  members: number;
  founder: string;
  promoted?: boolean;
};


type ClubReview = {
  id: number;
  clubId: number;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: "seed" | "user";
};

type Member = {
  id: number;
  name: string;
  joined: string;
  events: number;
  status: "New" | "Active";
};

type NotificationItem = {
  id: number;
  title: string;
  detail: string;
  read: boolean;
};

type FriendThread = {
  id: number;
  name: string;
  type: "group" | "direct";
  preview: string;
  time: string;
  initials: string;
  accent: string;
};

type FriendChatMessage = {
  id: number;
  from: "me" | "them";
  text: string;
};

function getInitialFriendMessages(
  thread: FriendThread
): FriendChatMessage[] {
  return [
    {
      id: 1,
      from: "them",
      text: thread.preview,
    },
  ];
}

function getFriendThreadPreview(
  thread: FriendThread
): FriendThread {
  const storageKey =
    `runrise-friend-chat-${thread.id}`;

  const messages =
    readStorage<FriendChatMessage[]>(
      storageKey,
      getInitialFriendMessages(thread)
    );

  const latestMessage =
    messages[messages.length - 1];

  const latestTime =
    latestMessage &&
    latestMessage.id > 1_000_000_000_000
      ? new Date(latestMessage.id).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : thread.time;

  return {
    ...thread,
    preview:
      latestMessage?.text ||
      thread.preview,
    time: latestTime,
  };
}

const defaultProfile: RunnerProfile = {
  name: "",
  runningExperience: "",
  preferredDistance: "",
  province: "",
  level: "",
  pace: "06:30",
  distance: "",
  location: [],
  parks: [],
  time: "",
  goal: [],
  vibe: [],
};

const initialClubs: Club[] = [
  {
    id: 1,
    name: "6am Run Club BKK",
    location: "Pathum Wan",
    pace: "6:00–8:00",
    distance: "3K",
    schedule: "Sat / Sun · Morning",
    level: "All Levels",
    vibe: ["Social", "Beginner Friendly"],
    description:
      "An early-morning social running community for runners who enjoy starting the day together.",
    members: 248,
    founder: "6am Run Club BKK",
    promoted: true,
  },
  {
    id: 2,
    name: "Lumpini Running Club Bangkok",
    location: "Pathum Wan",
    pace: "Flexible",
    distance: "5–7K",
    schedule: "Tue / Thu · Evening",
    level: "All Levels",
    vibe: ["Social", "Beginner Friendly"],
    description:
      "An evening running community welcoming runners of different levels.",
    members: 3992,
    founder: "Lumpini Running Club Bangkok",
  },
  {
    id: 3,
    name: "Bangkok Runners",
    location: "Khlong Toei",
    pace: "6:30–8:00",
    distance: "5–7K",
    schedule: "Tue · Morning",
    level: "All Levels",
    vibe: ["Social", "Relaxed"],
    description:
      "A Bangkok running community welcoming runners from beginners to experienced athletes.",
    members: 3000,
    founder: "Bangkok Runners",
  },
  {
    id: 4,
    name: "Anti Run Club Bangkok",
    location: "Khlong Toei",
    pace: "Easy / No Pressure",
    distance: "5K",
    schedule: "Sun · Evening",
    level: "Beginner",
    vibe: ["Relaxed", "Social"],
    description:
      "An easy-going run club focused on community, good vibes and zero pace pressure.",
    members: 0,
    founder: "Anti Run Club Bangkok",
  },
  {
    id: 5,
    name: "Sabai Run Club Bangkok",
    location: "Khlong Toei",
    pace: "Social Pace",
    distance: "3–5K",
    schedule: "Fri / Sun",
    level: "All Levels",
    vibe: ["Social", "Community"],
    description:
      "A social running community focused on fun, connection and running together.",
    members: 0,
    founder: "Sabai Run Club Bangkok",
  },
  {
    id: 6,
    name: "Founders Run Club Bangkok",
    location: "Watthana",
    pace: "Any Pace",
    distance: "3K",
    schedule: "Weekly · Morning",
    level: "All Levels",
    vibe: ["Social", "Networking"],
    description:
      "A weekly running community for founders, investors and friends, usually followed by coffee.",
    members: 0,
    founder: "Founders Run Club Bangkok",
  },
  {
    id: 7,
    name: "Roadlaan Runclub",
    location: "Bangkok",
    pace: "Flexible",
    distance: "5K",
    schedule: "Weekly",
    level: "All Levels",
    vibe: ["Social", "Community"],
    description:
      "A social running community bringing runners together through shared runs and community experiences.",
    members: 0,
    founder: "Roadlaan Runclub",
  },
  {
    id: 8,
    name: "Mitrmiles Runclub",
    location: "Bangkok",
    pace: "Flexible",
    distance: "5K",
    schedule: "Weekly",
    level: "All Levels",
    vibe: ["Social", "Beginner Friendly"],
    description:
      "A friendly running community focused on enjoying the run, meeting people and sharing miles together.",
    members: 0,
    founder: "Mitrmiles Runclub",
  },
  {
    id: 9,
    name: "Sardine Runclub",
    location: "Bangkok",
    pace: "Flexible",
    distance: "5K",
    schedule: "Weekly",
    level: "All Levels",
    vibe: ["Social", "Community"],
    description:
      "A community-focused Run Club for runners who enjoy running together and connecting through social runs.",
    members: 0,
    founder: "Sardine Runclub",
  },
];


const CLUB_INSTAGRAM: Record<number, string> = {
  7: "https://www.instagram.com/roadlaan.runclub?rpxt=aDl4bzB1czMycXJx",
};

const CLUB_IMAGES: Record<number, string> = {
  1: club6amImage,
  2: lumpiniRunningImage,
  3: bangkokRunnersImage,
  4: antiRunClubImage,
  5: sabaiRunClubImage,
  7: roadRunImage,
  8: mitrMilesImage,
  9: sdrcImage,
};

function getClubImage(clubId: number) {
  return CLUB_IMAGES[clubId];
}

const initialEvents: RunEvent[] = [
  {
    id: 101,
    clubId: 1,
    name: "Weekend Morning Run",
    date: "17 Oct",
    time: "06:00",
    location: "Pathum Wan",
    distance: "3K",
    pace: "6:00–8:00",
    capacity: 50,
    participants: 32,
    meetingPoint: "Lumpini Park",
    route: "Easy park loop",
    whatToBring: "Running shoes and water.",
  },
  {
    id: 201,
    clubId: 2,
    name: "Evening Community Run",
    date: "21 Oct",
    time: "18:00",
    location: "Pathum Wan",
    distance: "5K",
    pace: "Flexible",
    capacity: 60,
    participants: 41,
    meetingPoint: "Lumpini Park",
    route: "Community park run",
    whatToBring: "Running shoes and water.",
  },
  {
    id: 301,
    clubId: 3,
    name: "Bangkok Morning Run",
    date: "25 Oct",
    time: "06:30",
    location: "Khlong Toei",
    distance: "5K",
    pace: "6:30–8:00",
    capacity: 50,
    participants: 28,
    meetingPoint: "Benjakitti Park",
    route: "Park loop",
    whatToBring: "Running shoes and water.",
  },
  {
    id: 401,
    clubId: 4,
    name: "Sunday Easy 5K",
    date: "25 Oct",
    time: "17:30",
    location: "Khlong Toei",
    distance: "5K",
    pace: "Easy / No Pressure",
    capacity: 40,
    participants: 24,
    meetingPoint: "Benjakitti Park",
    route: "Easy 5K loop",
    whatToBring: "Comfortable running shoes.",
  },
  {
    id: 501,
    clubId: 5,
    name: "Sabai Social Run",
    date: "30 Oct",
    time: "20:00",
    location: "Khlong Toei",
    distance: "5K",
    pace: "Social Pace",
    capacity: 60,
    participants: 35,
    meetingPoint: "Benjakitti Park",
    route: "Social park loop",
    whatToBring: "Running shoes and water.",
  },
  {
    id: 601,
    clubId: 6,
    name: "Founders Morning 3K",
    date: "1 Nov",
    time: "08:00",
    location: "Watthana",
    distance: "3K",
    pace: "Any Pace",
    capacity: 40,
    participants: 18,
    meetingPoint: "Benchasiri Park",
    route: "3K community route",
    whatToBring: "Running shoes and coffee energy.",
  },
];


const initialClubReviews: ClubReview[] = [
  {
    id: 9001,
    clubId: 1,
    author: "Mint",
    rating: 5,
    comment: "ทีมงานเป็นกันเองมาก เหมาะกับมือใหม่ วิ่งตามได้ไม่กดดันเลย",
    createdAt: "2 วันที่แล้ว",
    source: "seed",
  },
  {
    id: 9002,
    clubId: 1,
    author: "Beam",
    rating: 4,
    comment: "บรรยากาศดี คนเยอะกำลังสนุก ถ้ามี pace group ชัดขึ้นอีกนิดจะดีมาก",
    createdAt: "5 วันที่แล้ว",
    source: "seed",
  },
  {
    id: 9003,
    clubId: 2,
    author: "Ploy",
    rating: 5,
    comment: "ชอบเส้นทางในสวนมาก ทุกคนใจดีและชวนคุยตลอดทาง",
    createdAt: "1 สัปดาห์ที่แล้ว",
    source: "seed",
  },
  {
    id: 9004,
    clubId: 2,
    author: "James",
    rating: 4,
    comment: "Very welcoming group and easy to follow even on my first run.",
    createdAt: "1 สัปดาห์ที่แล้ว",
    source: "seed",
  },
  {
    id: 9005,
    clubId: 3,
    author: "Nina",
    rating: 4,
    comment: "เพซค่อนข้างสม่ำเสมอ เหมาะกับคนที่อยากซ้อมจริงจังขึ้น",
    createdAt: "3 วันที่แล้ว",
    source: "seed",
  },
  {
    id: 9006,
    clubId: 4,
    author: "Ton",
    rating: 5,
    comment: "ชิลมาก ไม่กดดัน และได้รู้จักเพื่อนใหม่หลายคน",
    createdAt: "4 วันที่แล้ว",
    source: "seed",
  },
  {
    id: 9007,
    clubId: 5,
    author: "May",
    rating: 5,
    comment: "สมชื่อ Sabai เลย วิ่งสนุก บรรยากาศดี เหมาะกับวันสบาย ๆ",
    createdAt: "6 วันที่แล้ว",
    source: "seed",
  },
];

const initialMembers: Member[] = [
  {
    id: 1,
    name: "Beam",
    joined: "Today",
    events: 0,
    status: "New",
  },
  {
    id: 2,
    name: "Mint",
    joined: "2 days ago",
    events: 3,
    status: "Active",
  },
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const RUNRISE_STORAGE_KEYS = [
  "runrise-user",
  "runrise-profile",
  "runrise-founder-setup",
  "runrise-clubs",
  "runrise-events",
  "runrise-saved",
  "runrise-joined",
];


const RUNNING_EXPERIENCE_OPTIONS = [
  "Never trained seriously",
  "Less than 3 months",
  "3–6 months",
  "6–12 months",
  "1–2 years",
  "More than 2 years",
];

const PREFERRED_DISTANCE_OPTIONS = [
  "3K",
  "5K",
  "10K",
  "Half Marathon 21K",
  "Marathon 42K",
];

const PROVINCES = [
  "Bangkok",
  "Nonthaburi",
  "Pathum Thani",
  "Samut Prakan",
  "Nakhon Pathom",
  "Samut Sakhon",
];

const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  Bangkok: [
    "Phra Nakhon",
    "Dusit",
    "Nong Chok",
    "Bang Rak",
    "Bang Khen",
    "Bang Kapi",
    "Pathum Wan",
    "Pom Prap Sattru Phai",
    "Phra Khanong",
    "Min Buri",
    "Lat Krabang",
    "Yan Nawa",
    "Samphanthawong",
    "Phaya Thai",
    "Thon Buri",
    "Bangkok Yai",
    "Huai Khwang",
    "Khlong San",
    "Taling Chan",
    "Bangkok Noi",
    "Bang Khun Thian",
    "Phasi Charoen",
    "Nong Khaem",
    "Rat Burana",
    "Bang Phlat",
    "Din Daeng",
    "Bueng Kum",
    "Sathon",
    "Bang Sue",
    "Chatuchak",
    "Bang Kho Laem",
    "Prawet",
    "Khlong Toei",
    "Suan Luang",
    "Chom Thong",
    "Don Mueang",
    "Ratchathewi",
    "Lat Phrao",
    "Watthana",
    "Bang Khae",
    "Lak Si",
    "Sai Mai",
    "Khan Na Yao",
    "Saphan Sung",
    "Wang Thonglang",
    "Khlong Sam Wa",
    "Bang Na",
    "Thawi Watthana",
    "Thung Khru",
    "Bang Bon",
  ],
  Nonthaburi: [
    "Mueang Nonthaburi",
    "Bang Kruai",
    "Bang Yai",
    "Bang Bua Thong",
    "Sai Noi",
    "Pak Kret",
  ],
  "Pathum Thani": [
    "Mueang Pathum Thani",
    "Khlong Luang",
    "Thanyaburi",
    "Nong Suea",
    "Lat Lum Kaeo",
    "Lam Luk Ka",
    "Sam Khok",
  ],
  "Samut Prakan": [
    "Mueang Samut Prakan",
    "Bang Bo",
    "Bang Phli",
    "Phra Pradaeng",
    "Phra Samut Chedi",
    "Bang Sao Thong",
  ],
  "Nakhon Pathom": [
    "Mueang Nakhon Pathom",
    "Kamphaeng Saen",
    "Nakhon Chai Si",
    "Don Tum",
    "Bang Len",
    "Sam Phran",
    "Phutthamonthon",
  ],
  "Samut Sakhon": [
    "Mueang Samut Sakhon",
    "Krathum Baen",
    "Ban Phaeo",
  ],
};



const PARKS_BY_AREA: Record<string, string[]> = {
  "Khlong Toei": [
    "Benjakitti Park",
    "Benchasiri Park",
  ],
  Watthana: [
    "Benchasiri Park (Phrom Phong)",
    "Benjakitti Park",
  ],
  "Pathum Wan": [
    "Lumphini Park",
  ],
  "Bang Rak": [
    "Lumphini Park (Silom side)",
    "Lumphini Park",
  ],
  Chatuchak: [
    "Chatuchak Park",
    "Wachirabenchathat Park (Rod Fai Park)",
    "Queen Sirikit Park",
  ],
  "Phra Nakhon": [
    "Saranrom Park",
    "Santichaiprakarn Park",
    "Sanam Luang",
  ],
  "Thon Buri": [
    "Thonburirom Park (nearby)",
  ],
  Sathon: [
    "80th Birthday Anniversary Park (Sathon)",
    "Lumphini Park (nearby)",
  ],
  Prawet: [
    "Suan Luang Rama IX",
  ],
  "Phra Khanong": [
    "Wachiratham Sathit Park",
  ],
  "Bang Kapi": [
    "Seri Thai Park",
  ],
  "Bang Khen": [
    "Bang Bua Canal Park",
  ],
  "Lak Si": [
    "Thung Si Kan Park",
  ],
  "Mueang Nonthaburi": [
    "Chaloem Kanchanaphisek Park",
  ],
  "Pak Kret": [
    "Suan Somdet Phra Srinagarindra Nonthaburi",
  ],
  "Khlong Luang": [
    "Thammasat University Rangsit Sports Area",
  ],
  "Mueang Samut Prakan": [
    "Bang Pu Recreation Center",
  ],
  "Phra Pradaeng": [
    "Sri Nakhon Khuean Khan Park",
  ],
  "Mueang Nakhon Pathom": [
    "Sanam Chan Palace Park",
  ],
  "Phutthamonthon": [
    "Phutthamonthon Park",
  ],
  "Mueang Samut Sakhon": [
    "Saphan Daeng Recreation Area",
  ],
};

function getAvailableParksForLocations(locations: string[]) {
  return Array.from(
    new Set(
      locations.flatMap((location) => PARKS_BY_AREA[location] || [])
    )
  );
}

const RUNNING_GOALS = [
  "Health & Fitness",
  "Social / Meet People",
  "Improve Pace",
  "Race Training",
  "Build Endurance",
  "Just Getting Started",
];

const COMMUNITY_STYLES = [
  "Social",
  "Beginner Friendly",
  "Training Focused",
  "Relaxed",
  "Networking",
];

const RUNNING_TIMES = [
  "Morning",
  "Evening",
  "Flexible",
];

const FOUNDER_ROLE_OPTIONS = [
  "Club Founder",
  "Club Admin",
  "Event Organizer",
];

const FOUNDER_BASE_OPTIONS = [
  "Bangkok",
  "Other Provinces",
  "Multiple Locations",
];

const FOUNDER_ACTIVITY_OPTIONS = [
  "Social & Community Running",
  "Beginner-Friendly Running",
  "Performance & Training",
  "Race Preparation & Endurance",
  "Trail & Adventure Running",
  "Other",
];

const FOUNDER_LEVEL_OPTIONS = [
  "Beginner",
  "Getting Started",
  "Intermediate",
  "Serious Training",
  "Competitive",
  "All Levels",
];

const FOUNDER_PACE_OPTIONS = [
  "Under 5:00 min/km",
  "5:00–5:59 min/km",
  "6:00–6:59 min/km",
  "7:00–7:59 min/km",
  "8:00+ min/km",
  "Flexible Pace",
];

const FOUNDER_DISTANCE_OPTIONS = [
  "3K",
  "5K",
  "10K",
  "Half Marathon 21K",
  "Marathon 42K",
  "Flexible Distance",
];

const FOUNDER_DAY_OPTIONS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const FOUNDER_TIME_OPTIONS = [
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
  "Flexible",
];

const FOUNDER_COMMUNITY_OPTIONS = [
  "Social",
  "Beginner Friendly",
  "Relaxed",
  "Training Focused",
  "Competitive",
  "Fun & Energetic",
];

const defaultFounderSetup: FounderSetupProfile = {
  roleInClub: "",
  clubName: "",
  clubDescription: "",
  clubImageMock: "runrise-template",

  baseType: "",
  activities: [],

  levels: [],
  paceRanges: [],
  distances: [],

  province: "",
  locations: [],
  parks: [],

  days: [],
  times: [],

  vibe: [],
};

const FOUNDER_LABEL_TH: Record<string, string> = {
  "Club Founder": "ผู้ก่อตั้งคลับ",
  "Club Admin": "แอดมินคลับ",
  "Event Organizer": "ผู้จัดกิจกรรม",


  Bangkok: "กรุงเทพมหานคร",
  "Other Provinces": "จังหวัดอื่น",
  "Multiple Locations": "หลายพื้นที่",

  "Social & Community Running": "วิ่งเพื่อสังคมและคอมมูนิตี้",
  "Beginner-Friendly Running": "วิ่งสำหรับมือใหม่",
  "Performance & Training": "พัฒนาศักยภาพและการฝึกซ้อม",
  "Race Preparation & Endurance": "เตรียมแข่งและพัฒนาความอึด",
  "Trail & Adventure Running": "วิ่งเทรลและการผจญภัย",
  Other: "กิจกรรมวิ่งรูปแบบอื่น",

  Beginner: "มือใหม่",
  "Getting Started": "เริ่มวิ่งมาสักพัก",
  Intermediate: "ระดับกลาง",
  "Serious Training": "ระดับจริงจัง",
  Competitive: "เน้นการแข่งขัน",
  "All Levels": "ทุกระดับ",

  "Under 5:00 min/km": "ต่ำกว่า 5:00 นาที/กม.",
  "5:00–5:59 min/km": "5:00–5:59 นาที/กม.",
  "6:00–6:59 min/km": "6:00–6:59 นาที/กม.",
  "7:00–7:59 min/km": "7:00–7:59 นาที/กม.",
  "8:00+ min/km": "8:00 นาที/กม. ขึ้นไป",
  "Flexible Pace": "ยืดหยุ่น / ทุก Pace",

  "Flexible Distance": "ระยะทางยืดหยุ่น",

  Mon: "จ.",
  Tue: "อ.",
  Wed: "พ.",
  Thu: "พฤ.",
  Fri: "ศ.",
  Sat: "ส.",
  Sun: "อา.",

  Morning: "ช่วงเช้า",
  Afternoon: "ช่วงกลางวัน",
  Evening: "ช่วงเย็น",
  Night: "ช่วงค่ำ",
  Flexible: "ไม่แน่นอน",

  Social: "เน้นสังคม",
  "Beginner Friendly": "เหมาะสำหรับมือใหม่",
  Relaxed: "สบาย ๆ",
  "Training Focused": "จริงจังกับการฝึกซ้อม",
  "Fun & Energetic": "สนุกและมีพลัง",
};

function founderLabel(value: string, language: AppLanguage) {
  if (language === "th") {
    return FOUNDER_LABEL_TH[value] || profileValueForLanguage(value, "th");
  }

  return value;
}

function isFounderSetupComplete(profile: FounderSetupProfile) {
  return (
    Boolean(profile.roleInClub) &&
    Boolean((profile.clubName || "").trim()) &&
    Boolean((profile.clubDescription || "").trim()) &&
    Boolean(profile.clubImageMock) &&
    Boolean(profile.baseType) &&
    Array.isArray(profile.activities) &&
    profile.activities.length > 0 &&
    Array.isArray(profile.levels) &&
    profile.levels.length > 0 &&
    Array.isArray(profile.paceRanges) &&
    profile.paceRanges.length > 0 &&
    Array.isArray(profile.distances) &&
    profile.distances.length > 0 &&
    Boolean(profile.province) &&
    Array.isArray(profile.locations) &&
    profile.locations.length > 0 &&
    Array.isArray(profile.days) &&
    profile.days.length > 0 &&
    Array.isArray(profile.times) &&
    profile.times.length > 0 &&
    Array.isArray(profile.vibe) &&
    profile.vibe.length > 0
  );
}

const PROFILE_VALUE_TH: Record<string, string> = {
  // Running experience
  "Never trained seriously": "ยังไม่เคยวิ่งจริงจัง",
  "Less than 3 months": "น้อยกว่า 3 เดือน",
  "3–6 months": "3–6 เดือน",
  "6–12 months": "6–12 เดือน",
  "1–2 years": "1–2 ปี",
  "More than 2 years": "มากกว่า 2 ปี",

  // Preferred distance
  "3K": "3 กม.",
  "5K": "5 กม.",
  "10K": "10 กม.",
  "Half Marathon 21K": "Half Marathon 21 กม.",
  "Marathon 42K": "Marathon 42 กม.",

  // Province
  "Bangkok": "กรุงเทพมหานคร",
  "Nonthaburi": "นนทบุรี",
  "Pathum Thani": "ปทุมธานี",
  "Samut Prakan": "สมุทรปราการ",
  "Nakhon Pathom": "นครปฐม",
  "Samut Sakhon": "สมุทรสาคร",

  // Bangkok districts
  "Phra Nakhon": "พระนคร",
  "Dusit": "ดุสิต",
  "Nong Chok": "หนองจอก",
  "Bang Rak": "บางรัก",
  "Bang Khen": "บางเขน",
  "Bang Kapi": "บางกะปิ",
  "Pathum Wan": "ปทุมวัน",
  "Pom Prap Sattru Phai": "ป้อมปราบศัตรูพ่าย",
  "Phra Khanong": "พระโขนง",
  "Min Buri": "มีนบุรี",
  "Lat Krabang": "ลาดกระบัง",
  "Yan Nawa": "ยานนาวา",
  "Samphanthawong": "สัมพันธวงศ์",
  "Phaya Thai": "พญาไท",
  "Thon Buri": "ธนบุรี",
  "Bangkok Yai": "บางกอกใหญ่",
  "Huai Khwang": "ห้วยขวาง",
  "Khlong San": "คลองสาน",
  "Taling Chan": "ตลิ่งชัน",
  "Bangkok Noi": "บางกอกน้อย",
  "Bang Khun Thian": "บางขุนเทียน",
  "Phasi Charoen": "ภาษีเจริญ",
  "Nong Khaem": "หนองแขม",
  "Rat Burana": "ราษฎร์บูรณะ",
  "Bang Phlat": "บางพลัด",
  "Din Daeng": "ดินแดง",
  "Bueng Kum": "บึงกุ่ม",
  "Sathon": "สาทร",
  "Bang Sue": "บางซื่อ",
  "Chatuchak": "จตุจักร",
  "Bang Kho Laem": "บางคอแหลม",
  "Prawet": "ประเวศ",
  "Khlong Toei": "คลองเตย",
  "Suan Luang": "สวนหลวง",
  "Chom Thong": "จอมทอง",
  "Don Mueang": "ดอนเมือง",
  "Ratchathewi": "ราชเทวี",
  "Lat Phrao": "ลาดพร้าว",
  "Watthana": "วัฒนา",
  "Bang Khae": "บางแค",
  "Lak Si": "หลักสี่",
  "Sai Mai": "สายไหม",
  "Khan Na Yao": "คันนายาว",
  "Saphan Sung": "สะพานสูง",
  "Wang Thonglang": "วังทองหลาง",
  "Khlong Sam Wa": "คลองสามวา",
  "Bang Na": "บางนา",
  "Thawi Watthana": "ทวีวัฒนา",
  "Thung Khru": "ทุ่งครุ",
  "Bang Bon": "บางบอน",

  // Nonthaburi
  "Mueang Nonthaburi": "เมืองนนทบุรี",
  "Bang Kruai": "บางกรวย",
  "Bang Yai": "บางใหญ่",
  "Bang Bua Thong": "บางบัวทอง",
  "Sai Noi": "ไทรน้อย",
  "Pak Kret": "ปากเกร็ด",

  // Pathum Thani
  "Mueang Pathum Thani": "เมืองปทุมธานี",
  "Khlong Luang": "คลองหลวง",
  "Thanyaburi": "ธัญบุรี",
  "Nong Suea": "หนองเสือ",
  "Lat Lum Kaeo": "ลาดหลุมแก้ว",
  "Lam Luk Ka": "ลำลูกกา",
  "Sam Khok": "สามโคก",

  // Samut Prakan
  "Mueang Samut Prakan": "เมืองสมุทรปราการ",
  "Bang Bo": "บางบ่อ",
  "Bang Phli": "บางพลี",
  "Phra Pradaeng": "พระประแดง",
  "Phra Samut Chedi": "พระสมุทรเจดีย์",
  "Bang Sao Thong": "บางเสาธง",

  // Nakhon Pathom
  "Mueang Nakhon Pathom": "เมืองนครปฐม",
  "Kamphaeng Saen": "กำแพงแสน",
  "Nakhon Chai Si": "นครชัยศรี",
  "Don Tum": "ดอนตูม",
  "Bang Len": "บางเลน",
  "Sam Phran": "สามพราน",
  "Phutthamonthon": "พุทธมณฑล",

  // Samut Sakhon
  "Mueang Samut Sakhon": "เมืองสมุทรสาคร",
  "Krathum Baen": "กระทุ่มแบน",
  "Ban Phaeo": "บ้านแพ้ว",

  // Parks
  "Benjakitti Park": "สวนเบญจกิติ",
  "Benchasiri Park": "สวนเบญจสิริ",
  "Benchasiri Park (Phrom Phong)": "สวนเบญจสิริ (พร้อมพงษ์)",
  "Lumphini Park": "สวนลุมพินี",
  "Lumphini Park (Silom side)": "สวนลุมพินี (ฝั่งสีลม)",
  "Lumphini Park (nearby)": "สวนลุมพินี (บริเวณใกล้เคียง)",
  "Chatuchak Park": "สวนจตุจักร",
  "Wachirabenchathat Park (Rod Fai Park)": "สวนวชิรเบญจทัศ (สวนรถไฟ)",
  "Queen Sirikit Park": "สวนสมเด็จพระนางเจ้าสิริกิติ์ฯ",
  "Saranrom Park": "สวนสราญรมย์",
  "Santichaiprakarn Park": "สวนสันติชัยปราการ",
  "Sanam Luang": "สนามหลวง",
  "Thonburirom Park (nearby)": "สวนธนบุรีรมย์ (บริเวณใกล้เคียง)",
  "80th Birthday Anniversary Park (Sathon)": "สวนเฉลิมพระเกียรติ 80 พรรษา (สาทร)",
  "Suan Luang Rama IX": "สวนหลวง ร.9",
  "Wachiratham Sathit Park": "สวนวชิรธรรมสาธิต",
  "Seri Thai Park": "สวนเสรีไทย",
  "Bang Bua Canal Park": "สวนคลองบางบัว",
  "Thung Si Kan Park": "สวนทุ่งสีกัน",
  "Chaloem Kanchanaphisek Park": "อุทยานเฉลิมกาญจนาภิเษก",
  "Suan Somdet Phra Srinagarindra Nonthaburi": "สวนสมเด็จพระศรีนครินทร์ นนทบุรี",
  "Thammasat University Rangsit Sports Area": "พื้นที่กีฬามหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต",
  "Bang Pu Recreation Center": "สถานตากอากาศบางปู",
  "Sri Nakhon Khuean Khan Park": "สวนศรีนครเขื่อนขันธ์",
  "Sanam Chan Palace Park": "สวนพระราชวังสนามจันทร์",
  "Phutthamonthon Park": "สวนพุทธมณฑล",
  "Saphan Daeng Recreation Area": "พื้นที่นันทนาการสะพานแดง",

  // Running time
  "Morning": "ช่วงเช้า",
  "Evening": "ช่วงเย็น",
  "Flexible": "ยืดหยุ่น",

  // Goals
  "Health & Fitness": "สุขภาพและความฟิต",
  "Social / Meet People": "พบปะและทำความรู้จักผู้คน",
  "Improve Pace": "พัฒนาเพซ",
  "Race Training": "ฝึกซ้อมเพื่อการแข่งขัน",
  "Build Endurance": "เพิ่มความอึด",
  "Just Getting Started": "เพิ่งเริ่มต้น",

  // Community style
  "Social": "เน้นสังคม",
  "Beginner Friendly": "เหมาะสำหรับมือใหม่",
  "Training Focused": "เน้นการฝึกซ้อม",
  "Relaxed": "สบาย ๆ",
  "Networking": "สร้างคอนเนกชัน",
};

const PROFILE_VALUE_EN: Record<string, string> = Object.fromEntries(
  Object.entries(PROFILE_VALUE_TH).map(([english, thai]) => [
    thai,
    english,
  ])
);

function profileValueForLanguage(
  value: string,
  language: AppLanguage
) {
  if (!value) return "—";

  // Normalize values saved by older Thai-mode prototypes back to canonical English.
  const canonicalEnglish =
    PROFILE_VALUE_EN[value] || value;

  if (language === "th") {
    return (
      PROFILE_VALUE_TH[canonicalEnglish] ||
      translateDynamicSystemText(canonicalEnglish)
    );
  }

  return canonicalEnglish;
}


function profileDistanceForLanguage(
  value: string,
  language: AppLanguage
) {
  return profileValueForLanguage(value, language);
}

function profilePaceForLanguage(
  pace: string,
  language: AppLanguage
) {
  if (!pace) return "—";

  return language === "th"
    ? `${pace} / กม.`
    : `${pace} / km`;
}


function experienceToLegacyLevel(experience: string) {
  if (
    experience === "Never trained seriously" ||
    experience === "Less than 3 months"
  ) {
    return "Beginner";
  }

  if (
    experience === "3–6 months" ||
    experience === "6–12 months"
  ) {
    return "Casual";
  }

  if (experience === "1–2 years") {
    return "Intermediate";
  }

  if (experience === "More than 2 years") {
    return "Advanced";
  }

  return "";
}

function preferredDistanceToLegacyRange(distance: string) {
  if (distance === "3K") return "1-9km";
  if (distance === "5K") return "1-9km";
  if (distance === "10K") return "10-20km";
  if (distance === "Half Marathon 21K") return "21-41km";
  if (distance === "Marathon 42K") return "42km+";
  return "";
}

function legacyDistanceToPreferredDistance(distance: string) {
  if (distance === "1-9km") return "5K";
  if (distance === "10-20km") return "10K";
  if (distance === "21-41km") return "Half Marathon 21K";
  if (distance === "42km+") return "Marathon 42K";
  return "";
}

function inferProvinceFromDistricts(districts: string[]) {
  for (const [province, options] of Object.entries(DISTRICTS_BY_PROVINCE)) {
    if (districts.some((district) => options.includes(district))) {
      return province;
    }
  }
  return "";
}

function legacyLevelToExperience(level: string) {
  if (level === "Beginner") return "Less than 3 months";
  if (level === "Casual") return "3–6 months";
  if (level === "Intermediate") return "1–2 years";
  if (level === "Advanced") return "More than 2 years";
  return "";
}

function normalizeGoal(goal: unknown): string[] {
  const source = Array.isArray(goal)
    ? goal.filter((item): item is string => typeof item === "string")
    : typeof goal === "string" && goal.trim()
      ? [goal]
      : [];

  const rename: Record<string, string> = {
    "Health": "Health & Fitness",
    "Community / Social": "Social / Meet People",
    "Competition": "Race Training",
  };

  return Array.from(
    new Set(source.map((item) => rename[item] || item))
  );
}

function normalizeVibe(vibe: unknown): string[] {
  if (Array.isArray(vibe)) {
    return Array.from(
      new Set(
        vibe.filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0
        )
      )
    );
  }

  if (typeof vibe === "string" && vibe.trim()) {
    return [vibe.trim()];
  }

  return [];
}

function normalizeDistancePreference(value: unknown) {
  if (typeof value !== "string") return "";

  const normalized = value.trim().toLowerCase();

  if (["1-9km", "10-20km", "21-41km", "42km+"].includes(normalized)) {
    return normalized;
  }

  const first = Number(value.match(/\d+/)?.[0]);

  if (!Number.isFinite(first)) return "";

  if (first >= 42) return "42km+";
  if (first >= 21) return "21-41km";
  if (first >= 10) return "10-20km";
  return "1-9km";
}

function normalizeDistrict(value: unknown) {
  if (typeof value !== "string") return "";

  const mapping: Record<string, string> = {
    Lumpini: "Pathum Wan",
    Benjakitti: "Khlong Toei",
    Sukhumvit: "Watthana",
    Ari: "Chatuchak",
    Sathorn: "Sathon",
  };

  return mapping[value] || value;
}

function normalizeAreas(value: unknown): string[] {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .filter(
            (item): item is string =>
              typeof item === "string" && item.trim().length > 0
          )
          .map(normalizeDistrict)
      )
    );
  }

  if (typeof value === "string" && value.trim()) {
    return [normalizeDistrict(value)];
  }

  return [];
}

function normalizeParks(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0
      )
    )
  );
}

function normalizePace(value: unknown) {
  if (typeof value !== "string") return "06:30";

  const match = value.match(/(\d{1,2}):(\d{2})/);

  if (!match) return "06:30";

  const minutes = Math.min(20, Math.max(1, Number(match[1])));
  const seconds = Math.min(59, Math.max(0, Number(match[2])));

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function normalizeProfile(value: unknown): RunnerProfile {
  const raw =
    value && typeof value === "object"
      ? (value as Partial<RunnerProfile> & { goal?: unknown })
      : {};

  const normalizedDistance = normalizeDistancePreference(raw.distance);
  const normalizedLocation = normalizeAreas(raw.location);

  const preferredDistance =
    typeof raw.preferredDistance === "string" && raw.preferredDistance
      ? raw.preferredDistance
      : legacyDistanceToPreferredDistance(normalizedDistance);

  const runningExperience =
    typeof raw.runningExperience === "string" && raw.runningExperience
      ? raw.runningExperience
      : legacyLevelToExperience(
          typeof raw.level === "string" ? raw.level : ""
        );

  const province =
    typeof raw.province === "string" && raw.province
      ? raw.province
      : inferProvinceFromDistricts(normalizedLocation);

  return {
    ...defaultProfile,
    ...raw,
    runningExperience,
    preferredDistance,
    province,
    level:
      typeof raw.level === "string" && raw.level
        ? raw.level
        : experienceToLegacyLevel(runningExperience),
    pace: normalizePace(raw.pace),
    distance:
      normalizedDistance ||
      preferredDistanceToLegacyRange(preferredDistance),
    location: normalizedLocation,
    parks: normalizeParks((raw as { parks?: unknown }).parks),
    goal: normalizeGoal(raw.goal),
    vibe: normalizeVibe(raw.vibe),
  };
}

function isRunnerProfileComplete(profile: RunnerProfile) {
  return Boolean(
    profile.runningExperience.trim() &&
      profile.pace.trim() &&
      profile.preferredDistance.trim() &&
      profile.province.trim() &&
      profile.location.length > 0 &&
      profile.time.trim() &&
      profile.goal.length > 0 &&
      profile.vibe.length > 0
  );
}

function paceToSeconds(value: string) {
  const match = value.match(/(\d{1,2}):(\d{2})/);

  if (!match) return null;

  return Number(match[1]) * 60 + Number(match[2]);
}

function paceMatches(runnerPace: string, clubPace: string) {
  const normalizedClub = clubPace.toLowerCase();

  if (
    normalizedClub.includes("flexible") ||
    normalizedClub.includes("any pace") ||
    normalizedClub.includes("social pace") ||
    normalizedClub.includes("easy") ||
    normalizedClub.includes("no pressure")
  ) {
    return true;
  }

  const runnerSeconds = paceToSeconds(runnerPace);
  const clubTimes = [
    ...clubPace.matchAll(/(\d{1,2}):(\d{2})/g),
  ].map(
    (match) =>
      Number(match[1]) * 60 + Number(match[2])
  );

  if (runnerSeconds === null || clubTimes.length === 0) {
    return runnerPace.trim().toLowerCase() === normalizedClub.trim();
  }

  if (clubTimes.length === 1) {
    return Math.abs(runnerSeconds - clubTimes[0]) <= 30;
  }

  const min = Math.min(...clubTimes);
  const max = Math.max(...clubTimes);

  return runnerSeconds >= min && runnerSeconds <= max;
}

function preferredDistanceBounds(value: string): [number, number] | null {
  switch (normalizeDistancePreference(value)) {
    case "1-9km":
      return [1, 9];
    case "10-20km":
      return [10, 20];
    case "21-41km":
      return [21, 41];
    case "42km+":
      return [42, Infinity];
    default:
      return null;
  }
}

function clubDistanceBounds(value: string): [number, number] | null {
  const numbers = value.match(/\d+/g)?.map(Number);

  if (!numbers?.length) return null;

  if (numbers.length === 1) {
    return [numbers[0], numbers[0]];
  }

  return [Math.min(...numbers), Math.max(...numbers)];
}

function distanceMatches(
  runnerDistance: string,
  clubDistance: string
) {
  const preferred = preferredDistanceBounds(runnerDistance);
  const club = clubDistanceBounds(clubDistance);

  if (!preferred || !club) return false;

  return club[1] >= preferred[0] && club[0] <= preferred[1];
}

function PaceWheelColumn({
  values,
  value,
  onChange,
  ariaLabel,
}: {
  values: string[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const itemHeight = 46;

  useEffect(() => {
    const index = Math.max(0, values.indexOf(value));
    const node = ref.current;

    if (!node) return;

    node.scrollTo({
      top: index * itemHeight,
      behavior: "smooth",
    });
  }, [value, values]);

  const handleScroll = () => {
    const node = ref.current;

    if (!node) return;

    const index = Math.max(
      0,
      Math.min(
        values.length - 1,
        Math.round(node.scrollTop / itemHeight)
      )
    );

    const next = values[index];

    if (next !== value) {
      onChange(next);
    }
  };

  return (
    <div
      ref={ref}
      className="ut-wheel-column"
      onScroll={handleScroll}
      aria-label={ariaLabel}
      role="listbox"
      tabIndex={0}
    >
      <div className="ut-wheel-spacer" />

      {values.map((item) => (
        <button
          type="button"
          key={item}
          role="option"
          aria-selected={item === value}
          className={
            item === value
              ? "ut-wheel-item selected"
              : "ut-wheel-item"
          }
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}

      <div className="ut-wheel-spacer" />
    </div>
  );
}

function PaceWheelPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const safeValue = normalizePace(value);
  const [minute, second] = safeValue.split(":");

  const minutes = Array.from(
    { length: 20 },
    (_, index) => String(index + 1).padStart(2, "0")
  );

  const seconds = Array.from(
    { length: 60 },
    (_, index) => String(index).padStart(2, "0")
  );

  return (
    <div className="ut-pace-picker">
      <div className="ut-picker-selection" />

      <PaceWheelColumn
        values={minutes}
        value={minute}
        ariaLabel="Pace minutes"
        onChange={(nextMinute) =>
          onChange(`${nextMinute}:${second}`)
        }
      />

      <span className="ut-picker-colon">:</span>

      <PaceWheelColumn
        values={seconds}
        value={second}
        ariaLabel="Pace seconds"
        onChange={(nextSecond) =>
          onChange(`${minute}:${nextSecond}`)
        }
      />

      <span className="ut-picker-unit">/ km</span>
    </div>
  );
}


function ChipChoices({
  options,
  value,
  onChange,
  multi = false,
}: {
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multi?: boolean;
}) {
  const selectedValues = Array.isArray(value) ? value : [value];

  return (
    <div className="ut-chip-wrap">
      {options.map((option) => {
        const selected = selectedValues.includes(option);

        return (
          <button
            type="button"
            key={option}
            className={
              selected
                ? "ut-chip selected"
                : "ut-chip"
            }
            onClick={() => {
              if (!multi) {
                onChange(option);
                return;
              }

              onChange(
                selected
                  ? selectedValues.filter((item) => item !== option)
                  : [...selectedValues, option]
              );
            }}
          >
            {option}
            {selected && <span className="ut-chip-check">✓</span>}
          </button>
        );
      })}
    </div>
  );
}




function LocationParkSelector({
  province,
  districtOptions,
  selectedDistricts,
  selectedParks,
  onChangeProvince,
  onChange,
}: {
  province: string;
  districtOptions: string[];
  selectedDistricts: string[];
  selectedParks: string[];
  onChangeProvince: () => void;
  onChange: (districts: string[], parks: string[]) => void;
}) {
  const availableParks = getAvailableParksForLocations(selectedDistricts);

  const toggleDistrict = (district: string) => {
    const nextDistricts = selectedDistricts.includes(district)
      ? selectedDistricts.filter((item) => item !== district)
      : [...selectedDistricts, district];

    const nextAvailableParks = new Set(
      getAvailableParksForLocations(nextDistricts)
    );

    const nextParks = selectedParks.filter((park) =>
      nextAvailableParks.has(park)
    );

    onChange(nextDistricts, nextParks);
  };

  const togglePark = (park: string) => {
    const nextParks = selectedParks.includes(park)
      ? selectedParks.filter((item) => item !== park)
      : [...selectedParks, park];

    onChange(selectedDistricts, nextParks);
  };

  const clubsInSelectedArea =
    selectedDistricts.length === 0 ||
    initialClubs.some((club) =>
      selectedDistricts.includes(club.location)
    );

  return (
    <div className="ut-area-park-selector">
      <div className="ut-location-context">
        <span>Province</span>
        <strong>{province}</strong>
        <button type="button" onClick={onChangeProvince}>
          Change
        </button>
      </div>

      <section className="ut-area-park-group">
        <div className="ut-subcategory-heading">
          <div>
            <span>AREA</span>
            <strong>Choose your running areas</strong>
          </div>

          <small>
            {selectedDistricts.length > 0
              ? `${selectedDistricts.length} selected`
              : "Select one or more"}
          </small>
        </div>

        <div className="ut-choice-grid district-grid">
          {districtOptions.map((district) => {
            const selected = selectedDistricts.includes(district);

            return (
              <button
                type="button"
                key={district}
                className={
                  selected
                    ? "ut-choice-card selected"
                    : "ut-choice-card"
                }
                onClick={() => toggleDistrict(district)}
              >
                <strong>{district}</strong>
                {selected && <span>✓</span>}
              </button>
            );
          })}
        </div>
      </section>

      {!clubsInSelectedArea && selectedDistricts.length > 0 && (
        <div className="ut-area-availability-note">
          No Run Clubs are available in this area yet, but you can still explore nearby areas.
        </div>
      )}

      <section className="ut-area-park-group park-group">
        <div className="ut-subcategory-heading">
          <div>
            <span>PARK</span>
            <strong>Choose your preferred parks</strong>
          </div>

          <small>
            {selectedParks.length > 0
              ? `${selectedParks.length} selected`
              : "Select one or more"}
          </small>
        </div>

        {selectedDistricts.length === 0 ? (
          <div className="ut-park-empty">
            Select at least one Area first to see park choices.
          </div>
        ) : availableParks.length === 0 ? (
          <div className="ut-park-empty">
            No park suggestions are available for the selected area yet, but you can still continue.
          </div>
        ) : (
          <div className="ut-choice-grid area-park park-choices">
            {availableParks.map((park) => {
              const selected = selectedParks.includes(park);

              return (
                <button
                  type="button"
                  key={park}
                  className={
                    selected
                      ? "ut-choice-card area-park-choice park-choice selected"
                      : "ut-choice-card area-park-choice park-choice"
                  }
                  onClick={() => togglePark(park)}
                >
                  <strong>{park}</strong>
                  {selected && <span>✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}


const RUNRISE_LANGUAGE_KEY = "runrise-language";

/*
  Translation strategy
  --------------------
  - Club names, member names and text entered by users are NOT translated.
  - System UI, Bangkok areas, park names, preset tags, preset pace values,
    day / time labels and seeded system descriptions can be translated.
  - Dynamic text such as "55% Match", "6 communities found",
    "248 members" and "32 of 50 joined" is translated too.
*/

const THAI_TEXT: Record<string, string> = {
  // General / navigation
  "RUNRISE": "RUNRISE",
  "Back": "ย้อนกลับ",
  "← Back": "← ย้อนกลับ",
  "Save": "บันทึก",
  "Saved": "บันทึกแล้ว",
  "Continue": "ดำเนินการต่อ",
  "Cancel": "ยกเลิก",
  "Close": "ปิด",
  "See all": "ดูทั้งหมด",
  "Manage": "จัดการ",
  "Edit": "แก้ไข",
  "Search": "ค้นหา",
  "All": "ทั้งหมด",
  "Active": "ใช้งานอยู่",
  "New": "ใหม่",
  "Home": "หน้าหลัก",
  "Event": "อีเวนต์",
  "Friends": "เพื่อนวิ่ง",
  "Discover": "ค้นหา",
  "DISCOVER": "ค้นหา",
  "My Runs": "การวิ่งของฉัน",
  "Profile": "โปรไฟล์",
  "Dashboard": "แดชบอร์ด",
  "Club": "คลับ",
  "Events": "กิจกรรม",
  "Members": "สมาชิก",
  "Featured": "แนะนำ",
  "Match": "ตรงกับคุณ",
  "View Club": "ดูคลับ",
  "Compare Club": "เปรียบเทียบคลับ",
  "+ Compare Club": "+ เปรียบเทียบคลับ",
  "✓ Selected for comparison": "✓ เลือกเพื่อเปรียบเทียบแล้ว",
  "Changes Saved": "บันทึกการเปลี่ยนแปลงแล้ว",

  // Welcome / auth / role
  "WELCOME": "ยินดีต้อนรับ",
  "WELCOME BACK": "ยินดีต้อนรับกลับ",
  "JOIN RUNRISE": "เข้าร่วม RUNRISE",
  "Find your run.": "ค้นหาการวิ่งที่ใช่",
  "Find your community.": "ค้นหาคอมมูนิตี้ที่ใช่",
  "Discover running communities that fit your pace, place and lifestyle.": "ค้นหาคอมมูนิตี้การวิ่งที่เข้ากับเพซ พื้นที่ และไลฟ์สไตล์ของคุณ",
  "Get Started": "เริ่มใช้งาน",
  "New to Runrise?": "ยังไม่มีบัญชี Runrise?",
  "Log in": "เข้าสู่ระบบ",
  "Log In": "เข้าสู่ระบบ",
  "Login": "เข้าสู่ระบบ",
  "Log in to Runrise": "เข้าสู่ระบบ Runrise",
  "Create account": "สร้างบัญชี",
  "Create Account": "สร้างบัญชี",
  "Create your account": "สร้างบัญชีของคุณ",
  "Create one": "สร้างบัญชี",
  "Register": "สมัครสมาชิก",
  "Email": "อีเมล",
  "Password": "รหัสผ่าน",
  "Confirm Password": "ยืนยันรหัสผ่าน",
  "Full Name": "ชื่อ-นามสกุล",
  "Name": "ชื่อ",
  "Remember me": "จดจำฉันไว้",
  "Forgot password?": "ลืมรหัสผ่าน?",
  "Continue with Apple": "ดำเนินการต่อด้วย Apple",
  "Continue with Google": "ดำเนินการต่อด้วย Google",
  "Continue with Facebook": "ดำเนินการต่อด้วย Facebook",
  "Pick up where you left off and keep moving with your community.": "กลับมาใช้งานต่อและก้าวไปพร้อมกับคอมมูนิตี้ของคุณ",
  "Don't have an account?": "ยังไม่มีบัญชี?",
  "Already have an account?": "มีบัญชีอยู่แล้ว?",
  "Start with the basics. Your running preferences come next.": "เริ่มจากข้อมูลพื้นฐาน แล้วค่อยตั้งค่าความต้องการในการวิ่ง",
  "I agree to the Terms & Privacy Policy": "ฉันยอมรับข้อกำหนดและนโยบายความเป็นส่วนตัว",
  "How will you use Runrise?": "คุณต้องการใช้ Runrise แบบไหน?",
  "You can switch roles later.": "คุณสามารถสลับบทบาทได้ภายหลัง",
  "Runner": "นักวิ่ง",
  "Founder": "ผู้จัดคลับ",
  "Founder / Organizer": "ผู้ก่อตั้ง / ผู้จัดกิจกรรม",
  "Discover, compare and join running communities.": "ค้นหา เปรียบเทียบ และเข้าร่วมคอมมูนิตี้นักวิ่ง",
  "Create, manage and grow your running community.": "สร้าง จัดการ และพัฒนาคอมมูนิตี้การวิ่งของคุณ",

  // Onboarding
  "Profile setup": "ตั้งค่าโปรไฟล์",
  "A quick setup for better recommendations": "ตั้งค่าสั้น ๆ เพื่อให้คำแนะนำตรงกับคุณมากขึ้น",
  "Answer a few short questions so Runrise can recommend Run Clubs and events that fit your pace, preferred distance, area and goals.": "ตอบคำถามสั้น ๆ เพื่อให้ Runrise แนะนำ Run Club และกิจกรรมที่เหมาะกับ Pace ระยะวิ่ง พื้นที่ และเป้าหมายของคุณ",
  "This takes about 1–2 minutes. You can edit these preferences later.": "ใช้เวลาประมาณ 1–2 นาที และคุณสามารถกลับมาแก้ไขความต้องการได้ภายหลัง",
  "Start profile setup": "เริ่มตั้งค่าโปรไฟล์",
  "We use these answers to personalize your recommendations.": "เราจะใช้คำตอบเหล่านี้เพื่อปรับคำแนะนำให้เหมาะกับคุณ",
  "Running experience": "ประสบการณ์การวิ่ง",
  "How long have you been running?": "คุณวิ่งมานานแค่ไหนแล้ว?",
  "This helps us recommend Run Clubs that feel comfortable for your current experience.": "คำตอบนี้ช่วยให้เราแนะนำ Run Club ที่เหมาะกับประสบการณ์การวิ่งของคุณ",
  "Pace (min/km)": "Pace (นาที/กม.)",
  "What is your usual Easy Run pace?": "Pace ที่คุณใช้วิ่ง Easy Run โดยทั่วไปอยู่ที่ประมาณเท่าไหร่?",
  "Choose the pace you use for most comfortable training runs, not your race pace.": "เลือกความเร็วที่คุณใช้วิ่งสบาย ๆ ในการซ้อมส่วนใหญ่ ไม่ใช่ความเร็วตอนแข่ง",
  "Favorite distance": "ระยะที่สนใจ",
  "Which distance are you most interested in running?": "ระยะที่คุณชอบวิ่งมากที่สุดคือระยะไหน?",
  "Choose the distance you are most interested in joining. It does not have to be your everyday training distance.": "เลือกระยะที่คุณรู้สึกว่าสนใจหรืออยากเข้าร่วมมากที่สุด ไม่จำเป็นต้องเป็นระยะที่คุณซ้อมทุกวัน",
  "Province": "จังหวัด",
  "Which province would you like to run in?": "คุณอยากวิ่งในจังหวัดไหน?",
  "Choose your main area first. You can change this later.": "เลือกจังหวัดที่คุณต้องการวิ่งเป็นหลักก่อน และสามารถเปลี่ยนได้ภายหลัง",
  "District / Amphoe": "เขต / อำเภอ",
  "Which district or amphoe would you prefer?": "คุณอยากวิ่งในเขตหรืออำเภอไหน?",
  "Choose one or more areas. Recommendations will prioritize these locations.": "เลือกได้มากกว่า 1 พื้นที่ โดยคำแนะนำจะให้ความสำคัญกับพื้นที่เหล่านี้ก่อน",
  "When do you usually prefer to run?": "ปกติคุณสะดวกวิ่งช่วงเวลาไหน?",
  "This helps us prioritize events that fit your usual schedule.": "คำตอบนี้ช่วยให้เราแนะนำกิจกรรมที่เข้ากับช่วงเวลาที่คุณสะดวก",
  "Main goal": "เป้าหมายหลัก",
  "What is your main goal for joining a Run Club?": "เป้าหมายหลักในการเข้าร่วม Run Club ของคุณคืออะไร?",
  "Choose the reason that matters most to you. You can select more than one.": "เลือกเป้าหมายที่สำคัญกับคุณ โดยสามารถเลือกได้มากกว่า 1 ข้อ",
  "Choose the goals that matter to you. You can select more than one.": "เลือกเป้าหมายที่สำคัญกับคุณ โดยสามารถเลือกได้มากกว่า 1 ข้อ",
  "Choose all community styles that feel comfortable for you. You can select more than one.": "เลือกสไตล์คอมมูนิตี้ที่เหมาะกับคุณได้มากกว่า 1 ข้อ",
  "Community preference": "สไตล์คอมมูนิตี้",
  "What kind of Run Club atmosphere do you enjoy?": "คุณชอบบรรยากาศ Run Club แบบไหน?",
  "Choose all styles that feel comfortable for you.": "เลือกบรรยากาศที่คุณรู้สึกว่าเหมาะกับตัวเองได้มากกว่า 1 แบบ",
  "Never trained seriously": "ยังไม่เคยวิ่งจริงจัง",
  "Less than 3 months": "น้อยกว่า 3 เดือน",
  "3–6 months": "3–6 เดือน",
  "6–12 months": "6–12 เดือน",
  "1–2 years": "1–2 ปี",
  "More than 2 years": "มากกว่า 2 ปี",
  "3K": "3 กม.",
  "5K": "5 กม.",
  "10K": "10 กม.",
  "Half Marathon 21K": "Half Marathon 21 กม.",
  "Marathon 42K": "Marathon 42 กม.",
  "Health": "สุขภาพ",
  "Competition": "แข่งขัน",
  "You can select more than one goal.": "เลือกได้มากกว่า 1 เป้าหมาย",
  "You can select more than one community style.": "เลือกได้มากกว่า 1 ข้อ",
  "Bangkok": "กรุงเทพมหานคร",
  "Nonthaburi": "นนทบุรี",
  "Pathum Thani": "ปทุมธานี",
  "Samut Prakan": "สมุทรปราการ",
  "Nakhon Pathom": "นครปฐม",
  "Samut Sakhon": "สมุทรสาคร",
  "Dusit": "ดุสิต",
  "Nong Chok": "หนองจอก",
  "Bang Khen": "บางเขน",
  "Bang Kapi": "บางกะปิ",
  "Pom Prap Sattru Phai": "ป้อมปราบศัตรูพ่าย",
  "Phra Khanong": "พระโขนง",
  "Min Buri": "มีนบุรี",
  "Lat Krabang": "ลาดกระบัง",
  "Yan Nawa": "ยานนาวา",
  "Samphanthawong": "สัมพันธวงศ์",
  "Phaya Thai": "พญาไท",
  "Bangkok Yai": "บางกอกใหญ่",
  "Huai Khwang": "ห้วยขวาง",
  "Khlong San": "คลองสาน",
  "Taling Chan": "ตลิ่งชัน",
  "Bangkok Noi": "บางกอกน้อย",
  "Bang Khun Thian": "บางขุนเทียน",
  "Phasi Charoen": "ภาษีเจริญ",
  "Nong Khaem": "หนองแขม",
  "Rat Burana": "ราษฎร์บูรณะ",
  "Bang Phlat": "บางพลัด",
  "Din Daeng": "ดินแดง",
  "Bueng Kum": "บึงกุ่ม",
  "Bang Sue": "บางซื่อ",
  "Bang Kho Laem": "บางคอแหลม",
  "Prawet": "ประเวศ",
  "Suan Luang": "สวนหลวง",
  "Chom Thong": "จอมทอง",
  "Don Mueang": "ดอนเมือง",
  "Ratchathewi": "ราชเทวี",
  "Lat Phrao": "ลาดพร้าว",
  "Bang Khae": "บางแค",
  "Lak Si": "หลักสี่",
  "Sai Mai": "สายไหม",
  "Khan Na Yao": "คันนายาว",
  "Saphan Sung": "สะพานสูง",
  "Wang Thonglang": "วังทองหลาง",
  "Khlong Sam Wa": "คลองสามวา",
  "Bang Na": "บางนา",
  "Thawi Watthana": "ทวีวัฒนา",
  "Thung Khru": "ทุ่งครุ",
  "Bang Bon": "บางบอน",
  "Mueang Nonthaburi": "เมืองนนทบุรี",
  "Bang Kruai": "บางกรวย",
  "Bang Yai": "บางใหญ่",
  "Bang Bua Thong": "บางบัวทอง",
  "Sai Noi": "ไทรน้อย",
  "Pak Kret": "ปากเกร็ด",
  "Mueang Pathum Thani": "เมืองปทุมธานี",
  "Khlong Luang": "คลองหลวง",
  "Thanyaburi": "ธัญบุรี",
  "Nong Suea": "หนองเสือ",
  "Lat Lum Kaeo": "ลาดหลุมแก้ว",
  "Lam Luk Ka": "ลำลูกกา",
  "Sam Khok": "สามโคก",
  "Mueang Samut Prakan": "เมืองสมุทรปราการ",
  "Bang Bo": "บางบ่อ",
  "Bang Phli": "บางพลี",
  "Phra Pradaeng": "พระประแดง",
  "Phra Samut Chedi": "พระสมุทรเจดีย์",
  "Bang Sao Thong": "บางเสาธง",
  "Mueang Nakhon Pathom": "เมืองนครปฐม",
  "Kamphaeng Saen": "กำแพงแสน",
  "Nakhon Chai Si": "นครชัยศรี",
  "Don Tum": "ดอนตูม",
  "Bang Len": "บางเลน",
  "Sam Phran": "สามพราน",
  "Phutthamonthon": "พุทธมณฑล",
  "Mueang Samut Sakhon": "เมืองสมุทรสาคร",
  "Krathum Baen": "กระทุ่มแบน",
  "Ban Phaeo": "บ้านแพ้ว",
  "No Run Clubs are available in this area yet, but you can still explore nearby areas.": "ยังไม่มี Run Club ในพื้นที่นี้ แต่คุณยังสามารถดูพื้นที่ใกล้เคียงได้",
  "No park suggestions are available for the selected area yet, but you can still continue.": "ยังไม่มีสวนที่แนะนำในพื้นที่ที่เลือก แต่คุณยังสามารถดำเนินการต่อได้",
  "Why we ask": "ทำไมเราถึงถาม",
  "Selected Easy Run pace:": "Pace สำหรับ Easy Run ที่เลือก:",
  "Final step": "ขั้นตอนสุดท้าย",
  "steps left": "ขั้นตอนที่เหลือ",
  "Change": "เปลี่ยน",
  "Based on your pace, preferred distance, area and goals.": "แนะนำจาก Pace ระยะที่สนใจ พื้นที่ และเป้าหมายของคุณ",
  "Areas": "พื้นที่",
  "Goals": "เป้าหมาย",
  "Running Level": "ระดับการวิ่ง",
  "Where are you in your running journey?": "ตอนนี้คุณอยู่ในระดับใดของการวิ่ง?",
  "Usual Pace": "เพซปกติ",
  "What’s your average running pace?": "เพซเฉลี่ยที่คุณวิ่งเป็นประจำอยู่ที่เท่าไร?",
  "Preferred Distance": "ระยะทางที่ต้องการ",
  "How far do you usually run?": "ปกติคุณชอบวิ่งระยะทางเท่าไร?",
  "Preferred Area": "พื้นที่ที่ต้องการวิ่ง",
  "Preferred Area & Park": "พื้นที่และสวนที่ต้องการวิ่ง",
  "Which area do you prefer to run in?": "คุณต้องการวิ่งในพื้นที่ใด?",
  "Running Time": "ช่วงเวลาที่ต้องการวิ่ง",
  "When do you normally prefer to run?": "ปกติคุณสะดวกวิ่งช่วงเวลาใด?",
  "Running Goal": "เป้าหมายการวิ่ง",
  "What are you hoping to get from running?": "คุณต้องการอะไรจากการวิ่ง?",
  "Community Style": "สไตล์คอมมูนิตี้",
  "What kind of running community feels right for you?": "คอมมูนิตี้แบบไหนที่เหมาะกับคุณ?",
  "Complete Your Profile": "บันทึกโปรไฟล์",
  "Choose all styles that feel right for you.": "เลือกได้มากกว่า 1 รูปแบบ",
  "You can choose more than one goal.": "เลือกได้มากกว่า 1 เป้าหมาย",
  "Choose your running areas": "เลือกพื้นที่ที่ต้องการวิ่ง",
  "Choose your preferred parks": "เลือกสวนที่ต้องการวิ่ง",
  "Select one or more": "เลือกได้มากกว่า 1 ข้อ",
  "Select at least one Area first to see park choices.": "เลือกพื้นที่อย่างน้อย 1 แห่งเพื่อดูตัวเลือกสวน",
  "AREA": "พื้นที่",
  "PARK": "สวนสาธารณะ",
  "Beginner": "มือใหม่",
  "Casual": "วิ่งสบาย ๆ",
  "Intermediate": "ระดับกลาง",
  "Advanced": "ระดับสูง",
  "Just getting started": "เพิ่งเริ่มวิ่ง",
  "Run for fun": "วิ่งเพื่อความสนุก",
  "Run regularly": "วิ่งเป็นประจำ",
  "Train seriously": "ฝึกซ้อมอย่างจริงจัง",
  "Morning": "ช่วงเช้า",
  "Afternoon": "ช่วงบ่าย",
  "Evening": "ช่วงเย็น",
  "Night": "ช่วงค่ำ",
  "Flexible": "ยืดหยุ่น",
  "Weekly": "ทุกสัปดาห์",
  "Health & Fitness": "สุขภาพและความฟิต",
  "Social / Meet People": "พบปะและทำความรู้จักผู้คน",
  "Improve Pace": "พัฒนาเพซ",
  "Race Training": "ฝึกซ้อมเพื่อการแข่งขัน",
  "Build Endurance": "เพิ่มความอึด",
  "Just Getting Started": "เพิ่งเริ่มต้น",
  "Social": "เน้นสังคม",
  "Beginner Friendly": "เหมาะสำหรับมือใหม่",
  "Training Focused": "เน้นการฝึกซ้อม",
  "Relaxed": "สบาย ๆ",
  "Networking": "สร้างเครือข่าย",
  "Community": "คอมมูนิตี้",
  "All Levels": "ทุกระดับ",
  "Any Pace": "ทุกเพซ",
  "Social Pace": "เพซสบาย ๆ",
  "Easy / No Pressure": "สบาย ๆ ไม่กดดัน",
  "Swipe minutes and seconds separately. Selected pace:": "เลื่อนนาทีและวินาทีแยกกัน เพซที่เลือก:",
  "/ km": "/ กม.",
  "1–9 km": "1–9 กม.",
  "10–20 km": "10–20 กม.",
  "21–41 km": "21–41 กม.",
  "42 km+": "42 กม. ขึ้นไป",
  "1-9km": "1–9 กม.",
  "10-20km": "10–20 กม.",
  "21-41km": "21–41 กม.",
  "42km+": "42 กม. ขึ้นไป",

  // Bangkok areas
  "Khlong Toei": "คลองเตย",
  "Watthana": "วัฒนา",
  "Pathum Wan": "ปทุมวัน",
  "Bang Rak": "บางรัก",
  "Chatuchak": "จตุจักร",
  "Phra Nakhon": "พระนคร",
  "Thon Buri": "ธนบุรี",
  "Sathon": "สาทร",

  // Parks
  "Benjakitti Park": "สวนเบญจกิติ",
  "Benchasiri Park": "สวนเบญจสิริ",
  "Benchasiri Park (Phrom Phong)": "สวนเบญจสิริ (พร้อมพงษ์)",
  "Lumphini Park": "สวนลุมพินี",
  "Lumphini Park (Silom side)": "สวนลุมพินี (ฝั่งสีลม)",
  "Chatuchak Park": "สวนจตุจักร",
  "Wachirabenchathat Park (Rod Fai Park)": "สวนวชิรเบญจทัศ (สวนรถไฟ)",
  "Queen Sirikit Park": "สวนสมเด็จพระนางเจ้าสิริกิติ์ฯ",
  "Saranrom Park": "สวนสราญรมย์",
  "Santichaiprakarn Park": "สวนสันติชัยปราการ",
  "Sanam Luang": "สนามหลวง",
  "Thonburirom Park (nearby)": "สวนธนบุรีรมย์ (บริเวณใกล้เคียง)",
  "80th Birthday Anniversary Park (Sathon)": "สวนเฉลิมพระเกียรติ 80 พรรษา (สาทร)",
  "Lumphini Park (nearby)": "สวนลุมพินี (บริเวณใกล้เคียง)",
  "Suan Luang Rama IX": "สวนหลวง ร.9",
  "Wachiratham Sathit Park": "สวนวชิรธรรมสาธิต",
  "Seri Thai Park": "สวนเสรีไทย",
  "Bang Bua Canal Park": "สวนริมคลองบางบัว",
  "Thung Si Kan Park": "สวนทุ่งสีกัน",
  "Chaloem Kanchanaphisek Park": "สวนเฉลิมกาญจนาภิเษก",
  "Suan Somdet Phra Srinagarindra Nonthaburi": "สวนสมเด็จพระศรีนครินทร์ นนทบุรี",
  "Thammasat University Rangsit Sports Area": "พื้นที่กีฬามหาวิทยาลัยธรรมศาสตร์ รังสิต",
  "Bang Pu Recreation Center": "สถานตากอากาศบางปู",
  "Sri Nakhon Khuean Khan Park": "สวนศรีนครเขื่อนขันธ์",
  "Sanam Chan Palace Park": "สวนพระราชวังสนามจันทร์",
  "Phutthamonthon Park": "อุทยานพุทธมณฑล",
  "Saphan Daeng Recreation Area": "พื้นที่พักผ่อนสะพานแดง",

  // Days / months
  "Mon": "จ.",
  "Tue": "อ.",
  "Wed": "พ.",
  "Thu": "พฤ.",
  "Fri": "ศ.",
  "Sat": "ส.",
  "Sun": "อา.",
  "Jan": "ม.ค.",
  "Feb": "ก.พ.",
  "Mar": "มี.ค.",
  "Apr": "เม.ย.",
  "May": "พ.ค.",
  "Jun": "มิ.ย.",
  "Jul": "ก.ค.",
  "Aug": "ส.ค.",
  "Sep": "ก.ย.",
  "Oct": "ต.ค.",
  "Nov": "พ.ย.",
  "Dec": "ธ.ค.",

  // Runner home / discovery
  "Good morning,": "สวัสดีตอนเช้า",
  "Ready to find your next run?": "พร้อมค้นหาการวิ่งครั้งต่อไปหรือยัง?",
  "SMART MATCHING": "จับคู่คลับที่เหมาะกับคุณ",
  "Recommended for you": "แนะนำสำหรับคุณ",
  "Find your club": "ค้นหาคลับที่ใช่",
  "Find your community": "ค้นหาคอมมูนิตี้ที่ใช่",
  "Explore all clubs, ranked by how well they fit you.": "สำรวจคลับทั้งหมด เรียงตามความเหมาะสมกับคุณ",
  "Find running communities that match your pace, place and lifestyle.": "ค้นหาคอมมูนิตี้การวิ่งที่เหมาะกับเพซ พื้นที่ และไลฟ์สไตล์ของคุณ",
  "Search clubs": "ค้นหาคลับ",
  "Search club or location": "ค้นหาคลับหรือพื้นที่",
  "YOUR USUAL DISTANCE": "ระยะวิ่งปกติของคุณ",
  "Used for Smart Matching,": "ใช้สำหรับการจับคู่คลับ",
  "not to hide other clubs.": "ไม่ได้ใช้เพื่อซ่อนคลับอื่น",
  "Used for Smart Matching, not to hide other clubs.": "ใช้สำหรับการจับคู่คลับ ไม่ได้ใช้เพื่อซ่อนคลับอื่น",
  "DISTANCE PREFERENCE": "ระยะทางที่ต้องการ",
  "Distance Preference": "ระยะทางที่ต้องการ",
  "LOCATION": "พื้นที่",
  "Location": "พื้นที่",
  "Distance": "ระยะทาง",
  "Pace": "เพซ",
  "Level": "ระดับ",
  "Schedule": "ตารางวิ่ง",
  "communities found": "คอมมูนิตี้ที่พบ",
  "Compare": "เปรียบเทียบ",
  "Run Clubs": "คลับวิ่ง",

  // Club detail
  "About": "เกี่ยวกับคลับ",
  "Community vibe": "บรรยากาศคอมมูนิตี้",
  "Upcoming Runs": "กิจกรรมวิ่งที่กำลังจะมาถึง",
  "JOIN A RUN": "เข้าร่วมกิจกรรมวิ่ง",
  "Join Run": "เข้าร่วมการวิ่ง",
  "Joined": "เข้าร่วมแล้ว",
  "Meeting Point": "จุดนัดพบ",
  "Route": "เส้นทาง",
  "What to Bring": "สิ่งที่ควรเตรียม",
  "What to bring": "สิ่งที่ควรเตรียม",
  "Capacity": "จำนวนที่รับ",
  "Save Club": "บันทึกคลับ",
  "No upcoming runs yet.": "ยังไม่มีกิจกรรมวิ่งที่กำลังจะมาถึง",
  "NOT SURE YET?": "ยังตัดสินใจไม่ได้?",
  "Compare with another club": "เปรียบเทียบกับคลับอื่น",
  "See pace, distance, schedule and community side by side.": "เปรียบเทียบเพซ ระยะทาง ตารางวิ่ง และคอมมูนิตี้แบบเทียบกันได้ทันที",
  "✓ Added to Compare": "✓ เพิ่มเพื่อเปรียบเทียบแล้ว",
  "⇆ Compare Club": "⇆ เปรียบเทียบคลับ",
  "PACE": "เพซ",
  "DISTANCE": "ระยะทาง",
  "LEVEL": "ระดับ",
  "RUNNERS": "นักวิ่ง",
  "UPCOMING RUN": "กิจกรรมวิ่งที่กำลังจะมาถึง",
  "spots left": "ที่ว่าง",
  "Join This Run": "เข้าร่วมกิจกรรมนี้",
  "Run Full": "เต็มแล้ว",
  "✓ Joined · Cancel Run": "✓ เข้าร่วมแล้ว · ยกเลิก",
  "members": "สมาชิก",

  // Seeded system descriptions
  "An early-morning social running community for runners who enjoy starting the day together.": "คอมมูนิตี้วิ่งยามเช้าที่เน้นการพบปะ เหมาะกับคนที่อยากเริ่มต้นวันใหม่ไปพร้อมกัน",
  "An evening running community welcoming runners of different levels.": "คอมมูนิตี้วิ่งช่วงเย็นที่ต้อนรับนักวิ่งทุกระดับ",
  "A Bangkok running community welcoming runners from beginners to experienced athletes.": "คอมมูนิตี้นักวิ่งในกรุงเทพฯ ที่ต้อนรับทั้งมือใหม่และนักวิ่งที่มีประสบการณ์",
  "An easy-going run club focused on community, good vibes and zero pace pressure.": "คลับวิ่งบรรยากาศสบาย ๆ ที่เน้นคอมมูนิตี้และไม่กดดันเรื่องเพซ",
  "A social running community focused on fun, connection and running together.": "คอมมูนิตี้วิ่งที่เน้นความสนุก การเชื่อมต่อ และการวิ่งไปด้วยกัน",
  "A weekly running community for founders, investors and friends, usually followed by coffee.": "คอมมูนิตี้วิ่งประจำสัปดาห์สำหรับผู้ก่อตั้ง นักลงทุน และเพื่อน ๆ โดยมักปิดท้ายด้วยการดื่มกาแฟร่วมกัน",
  "Easy park loop": "เส้นทางวนรอบสวนแบบสบาย ๆ",
  "Community park run": "เส้นทางวิ่งในสวนสำหรับคอมมูนิตี้",
  "Park loop": "เส้นทางวนรอบสวน",
  "Easy 5K loop": "เส้นทาง 5 กม. แบบสบาย ๆ",
  "Social park loop": "เส้นทางวนรอบสวนแบบเน้นสังคม",
  "3K community route": "เส้นทางคอมมูนิตี้ระยะ 3 กม.",
  "Running shoes and water.": "รองเท้าวิ่งและน้ำดื่ม",
  "Comfortable running shoes.": "รองเท้าวิ่งที่สวมใส่สบาย",
  "Running shoes and coffee energy.": "รองเท้าวิ่งและพลังสำหรับกาแฟหลังวิ่ง",
  "Route will be announced.": "จะแจ้งเส้นทางภายหลัง",

  // Compare
  "COMPARE": "เปรียบเทียบ",
  "Which club fits you?": "คลับไหนเหมาะกับคุณ?",
  "See the differences at a glance.": "ดูความแตกต่างของแต่ละคลับได้อย่างรวดเร็ว",
  "BEST FIT": "เหมาะกับคุณที่สุด",
  "Best Fit": "เหมาะที่สุด",
  "This club matches more of your current running preferences.": "คลับนี้ตรงกับความต้องการในการวิ่งของคุณมากที่สุด",
  "MATCH BREAKDOWN": "รายละเอียดการจับคู่",
  "What’s different?": "ต่างกันอย่างไร?",
  "Matches you": "ตรงกับคุณ",
  "Preferred area": "พื้นที่ที่ต้องการ",
  "Your preferred range": "ช่วงระยะทางที่ต้องการ",
  "Comfortable running pace": "เพซที่เหมาะกับคุณ",
  "When you prefer to run": "ช่วงเวลาที่ต้องการวิ่ง",
  "Community style": "สไตล์คอมมูนิตี้",
  "Compare Run Clubs": "เปรียบเทียบคลับวิ่ง",
  "Choose at least 2 clubs": "เลือกอย่างน้อย 2 คลับ",
  "Select clubs from Discover to compare them.": "เลือกคลับจากหน้าค้นหาเพื่อเปรียบเทียบ",

  // My Runs / notifications
  "MY RUNRISE": "MY RUNRISE",
  "Your running space": "พื้นที่การวิ่งของคุณ",
  "Everything you've joined and saved.": "รวมกิจกรรมและคลับที่คุณเข้าร่วมและบันทึกไว้",
  "UPCOMING": "กำลังจะมาถึง",
  "PAST": "ที่ผ่านมา",
  "Saved Clubs": "คลับที่บันทึกไว้",
  "YOUR NEXT RUN": "กิจกรรมถัดไปของคุณ",
  "Cancel next run": "ยกเลิกกิจกรรมถัดไป",
  "Your next run starts here": "เริ่มต้นกิจกรรมวิ่งครั้งถัดไปของคุณที่นี่",
  "Find a community and join your first run.": "ค้นหาคอมมูนิตี้และเข้าร่วมกิจกรรมวิ่งแรกของคุณ",
  "Discover Runs": "ค้นหากิจกรรมวิ่ง",
  "No saved clubs yet": "ยังไม่มีคลับที่บันทึกไว้",
  "Save clubs you're interested in and come back anytime.": "บันทึกคลับที่สนใจไว้เพื่อกลับมาดูภายหลังได้ทุกเมื่อ",
  "Discover Clubs": "ค้นหาคลับ",
  "No upcoming runs": "ยังไม่มีกิจกรรมวิ่งที่กำลังจะมาถึง",
  "No past runs": "ยังไม่มีกิจกรรมที่ผ่านมา",
  "Notifications": "การแจ้งเตือน",
  "Mark all as read": "ทำเครื่องหมายว่าอ่านทั้งหมดแล้ว",
  "UPDATES": "อัปเดต",
  "New club recommendation": "คำแนะนำคลับใหม่",
  "We found running communities that match your profile.": "เราพบคอมมูนิตี้การวิ่งที่เหมาะกับโปรไฟล์ของคุณ",

  // Runner Profile
  "Edit Preferences": "แก้ไขความต้องการ",
  "RUNNING PROFILE": "โปรไฟล์การวิ่ง",
  "Your preferences": "ความต้องการของคุณ",
  "Preferred Park": "สวนที่ต้องการ",
  "Preferred Running Time": "ช่วงเวลาที่ต้องการวิ่ง",
  "RUNNING GOALS": "เป้าหมายการวิ่ง",
  "What you’re running for": "เป้าหมายของคุณ",
  "COMMUNITY PREFERENCE": "คอมมูนิตี้ที่ต้องการ",
  "Your preferred vibe": "บรรยากาศที่คุณชอบ",
  "Not selected": "ยังไม่ได้เลือก",
  "ACCOUNT & SETTINGS": "บัญชีและการตั้งค่า",
  "Runrise settings": "การตั้งค่า Runrise",
  "Switch to Founder": "สลับเป็นผู้จัดคลับ",
  "Switch to Runner": "สลับเป็นนักวิ่ง",
  "Reset Prototype": "รีเซ็ตต้นแบบ",
  "EDIT PREFERENCES": "แก้ไขความต้องการ",
  "Your running profile": "โปรไฟล์การวิ่งของคุณ",
  "Running Goals": "เป้าหมายการวิ่ง",
  "Save Preferences": "บันทึกความต้องการ",

  // Founder dashboard
  "FOUNDER DASHBOARD": "แดชบอร์ดผู้จัดกิจกรรม",
  "Good morning 👋": "สวัสดีตอนเช้า 👋",
  "Here's what's happening with your community.": "ภาพรวมคอมมูนิตี้ของคุณในวันนี้",
  "YOUR RUN CLUB": "คลับวิ่งของคุณ",
  "Total Members": "สมาชิกทั้งหมด",
  "Growing": "กำลังเติบโต",
  "New Members": "สมาชิกใหม่",
  "This month": "เดือนนี้",
  "Scheduled": "กำหนดไว้แล้ว",
  "Event Sign-ups": "ผู้ลงทะเบียนกิจกรรม",
  "Total runners": "นักวิ่งทั้งหมด",
  "COMMUNITY GROWTH": "การเติบโตของคอมมูนิตี้",
  "Growing this month": "การเติบโตในเดือนนี้",
  "Quick Actions": "ทางลัด",
  "Create Run": "สร้างกิจกรรมวิ่ง",
  "Add a new event": "เพิ่มกิจกรรมใหม่",
  "Edit Club": "แก้ไขคลับ",
  "Update club profile": "อัปเดตโปรไฟล์คลับ",
  "Recent Members": "สมาชิกล่าสุด",
  "Joined Today": "เข้าร่วมวันนี้",

  // Founder club management
  "CLUB MANAGEMENT": "จัดการคลับ",
  "Manage your club": "จัดการคลับของคุณ",
  "Keep your club profile clear and up to date.": "ดูแลข้อมูลคลับให้ครบถ้วนและเป็นปัจจุบัน",
  "CLUB NAME": "ชื่อคลับ",
  "DESCRIPTION": "รายละเอียด",
  "SCHEDULE": "ตารางวิ่ง",
  "COMMUNITY STYLE": "สไตล์คอมมูนิตี้",
  "Save Changes": "บันทึกการเปลี่ยนแปลง",

  // Founder event management
  "EVENT MANAGEMENT": "จัดการกิจกรรม",
  "Your Runs": "กิจกรรมวิ่งของคุณ",
  "Create and manage upcoming community runs.": "สร้างและจัดการกิจกรรมวิ่งของคอมมูนิตี้",
  "EDIT RUN": "แก้ไขกิจกรรม",
  "NEW RUN": "กิจกรรมใหม่",
  "Update Run": "อัปเดตกิจกรรม",
  "Create a Run": "สร้างกิจกรรมวิ่ง",
  "EVENT NAME": "ชื่อกิจกรรม",
  "DATE": "วันที่",
  "TIME": "เวลา",
  "CAPACITY": "จำนวนที่รับ",
  "MEETING POINT": "จุดนัดพบ",
  "ROUTE": "เส้นทาง",
  "WHAT TO BRING": "สิ่งที่ควรเตรียม",
  "Publish Run": "เผยแพร่กิจกรรม",
  "Edit Run": "แก้ไขกิจกรรม",
  "joined": "เข้าร่วมแล้ว",
  "of": "จาก",
  "TBA": "รอประกาศ",
  "Cancel this run?": "ยกเลิกกิจกรรมนี้หรือไม่?",
  "Please enter an event name.": "กรุณากรอกชื่อกิจกรรม",

  // Founder member management
  "MEMBER MANAGEMENT": "จัดการสมาชิก",
  "Your community": "คอมมูนิตี้ของคุณ",
  "See who's joining and staying active.": "ดูสมาชิกที่เข้าร่วมและยังคงมีส่วนร่วมกับคลับ",
  "Run Joins": "การเข้าร่วมกิจกรรม",
  "Search member": "ค้นหาสมาชิก",
  "RECENT MEMBER RECORDS": "ข้อมูลสมาชิกล่าสุด",
  "No members found": "ไม่พบสมาชิก",
  "Try another name or filter.": "ลองค้นหาด้วยชื่อหรือเงื่อนไขอื่น",
  "Today": "วันนี้",
  "2 days ago": "2 วันที่แล้ว",
  "runs joined": "กิจกรรมที่เข้าร่วม",

  // Founder Profile
  "Run Club": "คลับวิ่ง",
  "Runs Hosted": "กิจกรรมที่จัด",
  "PREFERENCES": "การตั้งค่า",

  // Language
  "LANGUAGE": "ภาษา",
  "Language": "ภาษา",
  "App Language": "ภาษาของแอป",
  "Choose the language used throughout Runrise.": "เลือกภาษาที่ต้องการใช้ภายในแอป Runrise",
  "English": "English",
  "Thai": "ไทย",
  "Please enter your full name.": "กรุณากรอกชื่อ-นามสกุล",
  "Please enter your email.": "กรุณากรอกอีเมล",
  "Please enter a valid email address.": "กรุณากรอกอีเมลให้ถูกต้อง",
  "Please enter a password.": "กรุณากรอกรหัสผ่าน",
  "Please confirm your password.": "กรุณายืนยันรหัสผ่าน",
  "Passwords do not match.": "รหัสผ่านไม่ตรงกัน",
  "Please agree to the Terms & Privacy Policy.": "กรุณายอมรับข้อกำหนดและนโยบายความเป็นส่วนตัว",
  "No Runrise account found yet. Please create an account first.": "ยังไม่พบบัญชี Runrise กรุณาสร้างบัญชีก่อน",
  "Email or password is incorrect. Please try again.": "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง",
};

const THAI_PLACEHOLDERS: Record<string, string> = {
  "Search clubs": "ค้นหาคลับ",
  "Search club or location": "ค้นหาคลับหรือพื้นที่",
  "Search member": "ค้นหาสมาชิก",
  "Enter your password": "กรอกรหัสผ่าน",
  "Your full name": "กรอกชื่อ-นามสกุล",
  "Create a password": "สร้างรหัสผ่าน",
  "Re-enter your password": "กรอกรหัสผ่านอีกครั้ง",
  "Enter your club name": "กรอกชื่อคลับ",
  "Tell runners about your club": "แนะนำคลับของคุณให้นักวิ่งรู้จัก",
  "e.g. Lumpini": "เช่น ปทุมวัน",
  "e.g. 3K": "เช่น 3 กม.",
  "e.g. 6:00–8:00": "เช่น 6:00–8:00",
  "e.g. Sat / Sun · Morning": "เช่น ส. / อา. · ช่วงเช้า",
  "e.g. Sunday Easy 5K": "เช่น Sunday Easy 5K",
  "25 Oct": "25 ต.ค.",
  "Where should runners meet?": "ระบุจุดนัดพบ",
  "Describe the running route": "อธิบายเส้นทางการวิ่ง",
};

const THAI_TOKEN_REPLACEMENTS: Array<[RegExp, string]> = [
  // Parks — specific names first
  [/Benchasiri Park \(Phrom Phong\)/g, "สวนเบญจสิริ (พร้อมพงษ์)"],
  [/Lumphini Park \(Silom side\)/g, "สวนลุมพินี (ฝั่งสีลม)"],
  [/Lumphini Park \(nearby\)/g, "สวนลุมพินี (บริเวณใกล้เคียง)"],
  [/Wachirabenchathat Park \(Rod Fai Park\)/g, "สวนวชิรเบญจทัศ (สวนรถไฟ)"],
  [/80th Birthday Anniversary Park \(Sathon\)/g, "สวนเฉลิมพระเกียรติ 80 พรรษา (สาทร)"],
  [/Thonburirom Park \(nearby\)/g, "สวนธนบุรีรมย์ (บริเวณใกล้เคียง)"],
  [/Benjakitti Park/g, "สวนเบญจกิติ"],
  [/Benchasiri Park/g, "สวนเบญจสิริ"],
  [/Lumphini Park/g, "สวนลุมพินี"],
  [/Chatuchak Park/g, "สวนจตุจักร"],
  [/Queen Sirikit Park/g, "สวนสมเด็จพระนางเจ้าสิริกิติ์ฯ"],
  [/Saranrom Park/g, "สวนสราญรมย์"],
  [/Santichaiprakarn Park/g, "สวนสันติชัยปราการ"],
  [/Sanam Luang/g, "สนามหลวง"],

  // Bangkok areas
  [/\bKhlong Toei\b/g, "คลองเตย"],
  [/\bWatthana\b/g, "วัฒนา"],
  [/\bPathum Wan\b/g, "ปทุมวัน"],
  [/\bBang Rak\b/g, "บางรัก"],
  [/\bChatuchak\b/g, "จตุจักร"],
  [/\bPhra Nakhon\b/g, "พระนคร"],
  [/\bThon Buri\b/g, "ธนบุรี"],
  [/\bSathon\b/g, "สาทร"],

  // Full day names
  [/\bMonday\b/g, "วันจันทร์"],
  [/\bTuesday\b/g, "วันอังคาร"],
  [/\bWednesday\b/g, "วันพุธ"],
  [/\bThursday\b/g, "วันพฤหัสบดี"],
  [/\bFriday\b/g, "วันศุกร์"],
  [/\bSaturday\b/g, "วันเสาร์"],
  [/\bSunday\b/g, "วันอาทิตย์"],

  // Short day names
  [/\bMon\b/g, "จ."],
  [/\bTue\b/g, "อ."],
  [/\bWed\b/g, "พ."],
  [/\bThu\b/g, "พฤ."],
  [/\bFri\b/g, "ศ."],
  [/\bSat\b/g, "ส."],
  [/\bSun\b/g, "อา."],

  // Time of day
  [/\bMorning\b/g, "ช่วงเช้า"],
  [/\bAfternoon\b/g, "ช่วงบ่าย"],
  [/\bEvening\b/g, "ช่วงเย็น"],
  [/\bNight\b/g, "ช่วงค่ำ"],
  [/\bWeekly\b/g, "ทุกสัปดาห์"],

  // Months
  [/\bJan\b/g, "ม.ค."],
  [/\bFeb\b/g, "ก.พ."],
  [/\bMar\b/g, "มี.ค."],
  [/\bApr\b/g, "เม.ย."],
  [/\bMay\b/g, "พ.ค."],
  [/\bJun\b/g, "มิ.ย."],
  [/\bJul\b/g, "ก.ค."],
  [/\bAug\b/g, "ส.ค."],
  [/\bSep\b/g, "ก.ย."],
  [/\bOct\b/g, "ต.ค."],
  [/\bNov\b/g, "พ.ย."],
  [/\bDec\b/g, "ธ.ค."],

  // Distance values / units
  [/1-9km/gi, "1–9 กม."],
  [/10-20km/gi, "10–20 กม."],
  [/21-41km/gi, "21–41 กม."],
  [/42km\+/gi, "42 กม. ขึ้นไป"],
  [/(\d+(?:[–-]\d+)?)\s*km\b/gi, "$1 กม."],
  [/(\d+(?:[–-]\d+)?)\s*K\b/g, "$1 กม."],
  [/\bkm\b/gi, "กม."],
];

function translateDynamicSystemText(core: string): string {
  if (THAI_TEXT[core]) {
    return THAI_TEXT[core];
  }

  const matchScore = core.match(/^(\d+)%\s+Match$/i);
  if (matchScore) {
    return `${matchScore[1]}% ตรงกับคุณ`;
  }

  const communitiesFound = core.match(/^(\d+)\s+communities?\s+found$/i);
  if (communitiesFound) {
    return `พบ ${communitiesFound[1]} คอมมูนิตี้`;
  }

  const savedClubCount = core.match(/^Saved Clubs\s*(\(\d+\))$/i);
  if (savedClubCount) {
    return `คลับที่บันทึกไว้ ${savedClubCount[1]}`;
  }

  const memberCount = core.match(/^([\d,]+)\s+members$/i);
  if (memberCount) {
    return `${memberCount[1]} สมาชิก`;
  }

  const joinedCapacity = core.match(/^(\d+)\s+of\s+(\d+)\s+joined$/i);
  if (joinedCapacity) {
    return `เข้าร่วมแล้ว ${joinedCapacity[1]} จาก ${joinedCapacity[2]} คน`;
  }

  const runsJoined = core.match(/^(\d+)\s+runs?\s+joined$/i);
  if (runsJoined) {
    return `เข้าร่วม ${runsJoined[1]} กิจกรรม`;
  }

  const joinedWhen = core.match(/^Joined\s+(.+)$/i);
  if (joinedWhen) {
    const translatedWhen = translateDynamicSystemText(joinedWhen[1]);
    return `เข้าร่วม ${translatedWhen}`;
  }

  const compareCount = core.match(/^Compare\s+(\d+)\s+Run Clubs$/i);
  if (compareCount) {
    return `เปรียบเทียบ ${compareCount[1]} คลับ`;
  }

  const stepsLeft = core.match(/^(\d+)\s+steps?\s+left$/i);
  if (stepsLeft) {
    return `เหลืออีก ${stepsLeft[1]} ขั้นตอน`;
  }

  return THAI_TOKEN_REPLACEMENTS.reduce(
    (result, [pattern, replacement]) =>
      result.replace(pattern, replacement),
    core
  );
}

function translateExactText(
  value: string,
  language: AppLanguage
) {
  if (language === "en") return value;

  const leading = value.match(/^\s*/)?.[0] || "";
  const trailing = value.match(/\s*$/)?.[0] || "";
  const core = value.trim();

  if (!core) return value;

  return `${leading}${translateDynamicSystemText(core)}${trailing}`;
}

const ORIGINAL_TEXT_NODES = new WeakMap<Text, string>();
const ORIGINAL_PLACEHOLDERS = new WeakMap<
  HTMLInputElement | HTMLTextAreaElement,
  string
>();

function translateRunriseDocument(language: AppLanguage) {
  const root = document.getElementById("root");

  if (!root) return;

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT
  );

  const textNodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  textNodes.forEach((node) => {
    const element = node.parentElement;

    if (!element) return;
    if (element.closest("[data-no-translate='true']")) return;

    const currentValue = node.nodeValue || "";
    let original = ORIGINAL_TEXT_NODES.get(node);

    if (original === undefined) {
      original = currentValue;
      ORIGINAL_TEXT_NODES.set(node, original);
    } else if (language === "th") {
      const translatedStored = translateExactText(original, "th");

      if (
        currentValue !== original &&
        currentValue !== translatedStored
      ) {
        original = currentValue;
        ORIGINAL_TEXT_NODES.set(node, original);
      }
    }

    const nextValue =
      language === "th"
        ? translateExactText(original, "th")
        : original;

    if (node.nodeValue !== nextValue) {
      node.nodeValue = nextValue;
    }
  });

  root.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement
  >("input[placeholder], textarea[placeholder]")
    .forEach((element) => {
      const currentPlaceholder = element.placeholder;
      let original = ORIGINAL_PLACEHOLDERS.get(element);

      if (original === undefined) {
        original = currentPlaceholder;
        ORIGINAL_PLACEHOLDERS.set(element, original);
      } else if (language === "th") {
        const translatedStored =
          THAI_PLACEHOLDERS[original] ||
          THAI_TEXT[original] ||
          original;

        if (
          currentPlaceholder !== original &&
          currentPlaceholder !== translatedStored
        ) {
          original = currentPlaceholder;
          ORIGINAL_PLACEHOLDERS.set(element, original);
        }
      }

      const nextPlaceholder =
        language === "th"
          ? THAI_PLACEHOLDERS[original] ||
            THAI_TEXT[original] ||
            original
          : original;

      if (element.placeholder !== nextPlaceholder) {
        element.placeholder = nextPlaceholder;
      }
    });

  document.documentElement.lang =
    language === "th" ? "th" : "en";
}


function LanguageQuickSwitch({
  language,
  onChange,
  compact = false,
}: {
  language: AppLanguage;
  onChange: (language: AppLanguage) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "language-quick-switch compact"
          : "language-quick-switch"
      }
      data-no-translate="true"
      aria-label="Language"
    >
      <button
        type="button"
        className={language === "th" ? "active" : ""}
        onClick={() => onChange("th")}
      >
        ไทย
      </button>
      <button
        type="button"
        className={language === "en" ? "active" : ""}
        onClick={() => onChange("en")}
      >
        EN
      </button>
    </div>
  );
}

function LanguageSettings({
  language,
  onChange,
}: {
  language: AppLanguage;
  onChange: (language: AppLanguage) => void;
}) {
  return (
    <section
      className="profile-language-compact"
      data-no-translate="true"
    >
      <div className="profile-language-copy">
        <p className="small-label">
          {language === "th" ? "ภาษา" : "LANGUAGE"}
        </p>

        <h2>
          {language === "th"
            ? "ภาษาของแอป"
            : "App Language"}
        </h2>
      </div>

      <LanguageQuickSwitch
        language={language}
        onChange={onChange}
        compact
      />
    </section>
  );
}


const initialFriendThreads: FriendThread[] = [
  {
    id: 1,
    name: "Thammasat Runners",
    type: "group",
    preview: "วันนี้มีซ้อมวิ่งที่สนามเวลา 17:30 น.",
    time: "17:30",
    initials: "TU",
    accent: "gold",
  },
  {
    id: 2,
    name: "6am Run Club BKK",
    type: "group",
    preview: "พรุ่งนี้เช้า 6 โมง เจอกันที่จุดเดิม!",
    time: "13:29",
    initials: "6A",
    accent: "terracotta",
  },
  {
    id: 3,
    name: "Runrise Friends",
    type: "direct",
    preview: "พรุ่งนี้เจอกันกี่โมงดี?",
    time: "13:00",
    initials: "RF",
    accent: "sand",
  },
  {
    id: 4,
    name: "Mitrmiles Crew",
    type: "group",
    preview: "Long Run สุดสัปดาห์นี้ ใครไปบ้าง?",
    time: "12:13",
    initials: "MM",
    accent: "ochre",
  },
  {
    id: 5,
    name: "Roadlaan Morning Crew",
    type: "direct",
    preview: "รวมตัววิ่งครึ่งทางวันนี้ไหม?",
    time: "11:36",
    initials: "RL",
    accent: "rust",
  },
];

function App() {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem(RUNRISE_LANGUAGE_KEY);
    return saved === "en" ? "en" : "th";
  });

  const [page, setPage] = useState<Page>("welcome");
  const [role, setRole] = useState<Role>("runner");

  const [user, setUser] = useState<UserAccount | null>(() =>
    readStorage<UserAccount | null>("runrise-user", null)
  );

  const [profile, setProfile] = useState<RunnerProfile>(() =>
    normalizeProfile(
      readStorage("runrise-profile", {
        ...defaultProfile,
      })
    )
  );


  const [founderSetup, setFounderSetup] = useState<FounderSetupProfile>(() => {
    const saved = readStorage<Partial<FounderSetupProfile>>(
      "runrise-founder-setup",
      {}
    );

    return {
      ...defaultFounderSetup,
      ...saved,

      activities: Array.isArray(saved.activities)
        ? saved.activities
        : [],

      levels: Array.isArray(saved.levels)
        ? saved.levels
        : [],

      paceRanges: Array.isArray(saved.paceRanges)
        ? saved.paceRanges
        : [],

      distances: Array.isArray(saved.distances)
        ? saved.distances
        : [],

      locations: Array.isArray(saved.locations)
        ? saved.locations
        : [],

      parks: Array.isArray(saved.parks)
        ? saved.parks
        : [],

      days: Array.isArray(saved.days)
        ? saved.days
        : [],

      times: Array.isArray(saved.times)
        ? saved.times
        : [],

      vibe: Array.isArray(saved.vibe)
        ? saved.vibe
        : [],
    };
  });

const [clubs, setClubs] = useState<Club[]>(() => {
  const storedClubs = readStorage<Club[]>(
    "runrise-clubs",
    initialClubs
  );

  const updatedStoredClubs = storedClubs.map((club) => {
    if (club.id === 7) {
      return {
        ...club,
        name: "Roadlaan Runclub",
        founder: "Roadlaan Runclub",
      };
    }

    if (club.id === 8) {
      return {
        ...club,
        name: "Mitrmiles Runclub",
        founder: "Mitrmiles Runclub",
      };
    }

    if (club.id === 9) {
      return {
        ...club,
        name: "Sardine Runclub",
        founder: "Sardine Runclub",
      };
    }

    return club;
  });

  const storedIds = new Set(
    updatedStoredClubs.map((club) => club.id)
  );

  const mergedClubs = [
    ...updatedStoredClubs,
    ...initialClubs.filter(
      (club) => !storedIds.has(club.id)
    ),
  ];

  return mergedClubs.map((club) => ({
    ...club,
    location: normalizeDistrict(club.location),
  }));
});

  const [events, setEvents] = useState<RunEvent[]>(() =>
    readStorage<RunEvent[]>("runrise-events", initialEvents).map((event) => ({
      ...event,
      location: normalizeDistrict(event.location),
    }))
  );

  const [savedClubs, setSavedClubs] = useState<number[]>(() =>
    readStorage("runrise-saved", [])
  );

  const [joinedEvents, setJoinedEvents] = useState<number[]>(() =>
    readStorage("runrise-joined", [])
  );


  const [clubReviews, setClubReviews] = useState<ClubReview[]>(() =>
    readStorage<ClubReview[]>("runrise-club-reviews", initialClubReviews)
  );

  const [compareClubs, setCompareClubs] = useState<number[]>([]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "New club recommendation",
      detail: "We found running communities that match your profile.",
      read: false,
    },
  ]);

  const [selectedClubId, setSelectedClubId] = useState(1);
  const [clubBackPage, setClubBackPage] =
    useState<Page>("runner-home");
  const [selectedEventId, setSelectedEventId] = useState(101);
  const [eventBackPage, setEventBackPage] = useState<Page>("club");
  const [joinSuccessEventId, setJoinSuccessEventId] =
    useState<number | null>(null);
  const [selectedFriendThreadId, setSelectedFriendThreadId] = useState(1);

  useEffect(() => {
    if (user) {
      localStorage.setItem("runrise-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("runrise-user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("runrise-profile", JSON.stringify(profile));
  }, [profile]);


  useEffect(() => {
    localStorage.setItem(
      "runrise-founder-setup",
      JSON.stringify(founderSetup)
    );
  }, [founderSetup]);

  useEffect(() => {
    localStorage.setItem("runrise-clubs", JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem("runrise-events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("runrise-saved", JSON.stringify(savedClubs));
  }, [savedClubs]);

  useEffect(() => {
    localStorage.setItem("runrise-joined", JSON.stringify(joinedEvents));
  }, [joinedEvents]);


  useEffect(() => {
    localStorage.setItem(
      "runrise-club-reviews",
      JSON.stringify(clubReviews)
    );
  }, [clubReviews]);

  const addClubReview = (
    clubId: number,
    rating: number,
    comment: string
  ) => {
    const author =
      user?.name?.trim() ||
      profile.name?.trim() ||
      (language === "th" ? "คุณ" : "You");

    const newReview: ClubReview = {
      id: Date.now(),
      clubId,
      author,
      rating,
      comment: comment.trim(),
      createdAt:
        language === "th"
          ? "เมื่อสักครู่"
          : "Just now",
      source: "user",
    };

    setClubReviews((previous) => [
      newReview,
      ...previous.filter(
        (review) =>
          !(
            review.clubId === clubId &&
            review.source === "user" &&
            review.author === author
          )
      ),
    ]);
  };

  const completeFounderSetup = () => {
    const selectedLevel = founderSetup.levels.includes("All Levels")
      ? "All Levels"
      : founderSetup.levels.length > 1
        ? "All Levels"
        : founderSetup.levels[0] || "All Levels";

    const selectedPace = founderSetup.paceRanges.includes("Flexible Pace")
      ? "Flexible pace"
      : founderSetup.paceRanges.join(" · ");

    const selectedDistance = founderSetup.distances.includes(
      "Flexible Distance"
    )
      ? "Flexible distance"
      : founderSetup.distances.join(" · ");

    const selectedSchedule = [
      founderSetup.days.join(" / "),
      founderSetup.times.join(" / "),
    ]
      .filter(Boolean)
      .join(" · ");

    setClubs((previous) =>
      previous.map((club) =>
        club.id === 1
          ? {
              ...club,
              name:
                founderSetup.clubName.trim() ||
                club.name,
              description:
                founderSetup.clubDescription.trim() ||
                club.description,
              level: selectedLevel,
              pace: selectedPace,
              distance: selectedDistance,
              schedule: selectedSchedule,
              location:
                founderSetup.locations[0] ||
                founderSetup.province ||
                club.location,
              vibe: [
                ...founderSetup.vibe,
                ...founderSetup.activities,
              ],
            }
          : club
      )
    );

    setPage("founder-dashboard");
  };

  const selectedClub =
    clubs.find((club) => club.id === selectedClubId) || clubs[0];

  const selectedEvent =
    events.find((event) => event.id === selectedEventId) || events[0];

  const calculateMatch = (club: Club) => {
    let score = 0;

    if (
      profile.location.length > 0 &&
      profile.location.some(
        (area) =>
          area.toLowerCase() === club.location.toLowerCase()
      )
    ) {
      score += 25;
    }

    if (profile.pace && paceMatches(profile.pace, club.pace)) {
      score += 25;
    }

    if (profile.time === "Flexible") {
      score += 20;
    } else if (
      profile.time &&
      club.schedule.toLowerCase().includes(profile.time.toLowerCase())
    ) {
      score += 20;
    }

    if (
      profile.distance &&
      distanceMatches(profile.distance, club.distance)
    ) {
      score += 15;
    }

    if (
      profile.level &&
      (club.level === profile.level || club.level === "All Levels")
    ) {
      score += 10;
    }

    if (
      profile.vibe.length > 0 &&
      club.vibe.some((clubVibe) =>
        profile.vibe.some(
          (runnerVibe) =>
            clubVibe.toLowerCase() === runnerVibe.toLowerCase()
        )
      )
    ) {
      score += 5;
    }

    return score;
  };

  const matchedClubs = useMemo(() => {
    return [...clubs].sort(
      (a, b) => calculateMatch(b) - calculateMatch(a)
    );
  }, [clubs, profile]);


  const toggleSave = (clubId: number) => {
    setSavedClubs((previous) =>
      previous.includes(clubId)
        ? previous.filter((id) => id !== clubId)
        : [...previous, clubId]
    );
  };

  const toggleCompare = (clubId: number) => {
    setCompareClubs((previous) => {
      if (previous.includes(clubId)) {
        return previous.filter((id) => id !== clubId);
      }

      if (previous.length >= 3) {
        alert("Compareได้สูงสุด 3 Run Clubs");
        return previous;
      }

      return [...previous, clubId];
    });
  };

  const joinEvent = (eventId: number) => {
    if (!joinedEvents.includes(eventId)) {
      setJoinedEvents((previous) => [
        ...previous,
        eventId,
      ]);

      setEvents((previous) =>
        previous.map((event) =>
          event.id === eventId
            ? {
                ...event,
                participants: Math.min(
                  event.participants + 1,
                  event.capacity
                ),
              }
            : event
        )
      );
    }

    // Do not redirect to the old My Runs flow.
    // Stay on Event Detail and confirm the booking instead.
    setJoinSuccessEventId(eventId);
  };

  const cancelJoinedEvent = (eventId: number) => {
    if (!joinedEvents.includes(eventId)) {
      return;
    }

    setJoinedEvents((previous) =>
      previous.filter((id) => id !== eventId)
    );

    setEvents((previous) =>
      previous.map((event) =>
        event.id === eventId
          ? {
              ...event,
              participants: Math.max(
                event.participants - 1,
                0
              ),
            }
          : event
      )
    );
  };

  const switchRole = () => {
    const nextRole: Role =
      role === "runner" ? "founder" : "runner";

    setRole(nextRole);

    if (nextRole === "runner") {
      setPage(
        isRunnerProfileComplete(profile)
          ? "runner-home"
          : "runner-onboarding"
      );
      return;
    }

    setPage(
      isFounderSetupComplete(founderSetup)
        ? "founder-dashboard"
        : "founder-onboarding"
    );
  };

  const resetPrototype = () => {
    RUNRISE_STORAGE_KEYS.forEach((key) =>
      localStorage.removeItem(key)
    );

    setUser(null);
    setRole("runner");
    setProfile({
      ...defaultProfile,
    });
    setFounderSetup({
      ...defaultFounderSetup,
    });
    setClubs(initialClubs);
    setEvents(initialEvents);
    setSavedClubs([]);
    setJoinedEvents([]);
    setCompareClubs([]);
    setNotifications([
      {
        id: 1,
        title: "New club recommendation",
        detail: "We found running communities that match your profile.",
        read: false,
      },
    ]);
    setSelectedClubId(1);
    setSelectedEventId(101);
    setPage("welcome");
  };

  const registerUser = (account: UserAccount) => {
    setUser(account);
    setProfile({
      ...defaultProfile,
      name: account.name,
    });
    setPage("role");
  };

  const loginUser = (account: UserAccount) => {
    setUser(account);

    setProfile((previous) => ({
      ...previous,
      name: account.name,
    }));

    setPage("role");
  };

  useEffect(() => {
    localStorage.setItem(RUNRISE_LANGUAGE_KEY, language);

    const applyLanguage = () => {
      translateRunriseDocument(language);
    };

    applyLanguage();

    const observer = new MutationObserver(() => {
      requestAnimationFrame(applyLanguage);
    });

    observer.observe(
      document.getElementById("root") || document.body,
      {
        childList: true,
        subtree: true,
      }
    );

    return () => observer.disconnect();
  }, [language, page]);


  return (
    <div className="app-shell">
      <div className="phone">
        {page === "welcome" && (
          <Welcome
            language={language}
            setLanguage={setLanguage}
            onStart={() => setPage("login")}
            onRegister={() => setPage("register")}
          />
        )}

        {page === "login" && (
          <Login
            language={language}
            setLanguage={setLanguage}
            storedUser={user}
            onLogin={loginUser}
            onRegister={() => setPage("register")}
            onBack={() => setPage("welcome")}
          />
        )}

        {page === "register" && (
          <Register
            language={language}
            setLanguage={setLanguage}
            onRegister={registerUser}
            onLogin={() => setPage("login")}
            onBack={() => setPage("welcome")}
          />
        )}

        {page === "role" && (
          <RoleSelect
            language={language}
            setLanguage={setLanguage}
            onBack={() => setPage("login")}
            onRunner={() => {
              setRole("runner");
              setPage(
                isRunnerProfileComplete(profile)
                  ? "runner-home"
                  : "runner-onboarding"
              );
            }}
            onFounder={() => {
              setRole("founder");
              setPage(
                isFounderSetupComplete(founderSetup)
                  ? "founder-dashboard"
                  : "founder-onboarding"
              );
            }}
          />
        )}

        {page === "runner-onboarding" && (
          <RunnerOnboarding
            language={language}
            setLanguage={setLanguage}
            profile={profile}
            setProfile={setProfile}
            onBack={() => setPage("role")}
            onFinish={() => {
              setPage("runner-home");
            }}
          />
        )}

        {page === "founder-onboarding" && (
          <FounderOnboarding
            language={language}
            setLanguage={setLanguage}
            profile={founderSetup}
            setProfile={setFounderSetup}
            onBack={() => setPage("role")}
            onFinish={completeFounderSetup}
          />
        )}

        {page === "runner-home" && (
          <RunnerHome
            language={language}
            setLanguage={setLanguage}
            profile={profile}
            clubs={matchedClubs}
            calculateMatch={calculateMatch}
            unread={
              notifications.filter(
                (notification) => !notification.read
              ).length
            }
            onClub={(id: number) => {
              setSelectedClubId(id);
              setClubBackPage("runner-home");
              setPage("club");
            }}
            onNotifications={() => setPage("notifications")}
            onViewAllClubs={() => setPage("all-clubs")}
            onCompare={() => setPage("compare-select")}
            onNav={setPage}
          />
        )}


        {page === "runner-events" && (
          <RunnerEventsPage
            language={language}
            setLanguage={setLanguage}
            events={events}
            clubs={clubs}
            unread={
              notifications.filter(
                (notification) => !notification.read
              ).length
            }
            onNotifications={() => setPage("notifications")}
            onEvent={(id: number) => {
              const event = events.find((item) => item.id === id);

              if (event) {
                setSelectedClubId(event.clubId);
              }

              setSelectedEventId(id);
              setEventBackPage("runner-events");
              setPage("event");
            }}
            onNav={setPage}
          />
        )}

        {page === "all-clubs" && (
          <AllClubsPage
            language={language}
            clubs={clubs}
            calculateMatch={calculateMatch}
            onBack={() => setPage(clubBackPage)}
            onClub={(id: number) => {
              setSelectedClubId(id);
              setClubBackPage("all-clubs");
              setPage("club");
            }}
          />
        )}

        {page === "compare-select" && (
          <CompareSelect
            language={language}
            clubs={clubs}
            selectedIds={compareClubs}
            calculateMatch={calculateMatch}
            onToggle={toggleCompare}
            onBack={() => setPage("runner-home")}
            onCompare={() => setPage("compare")}
          />
        )}

        {page === "club" && (
          <ClubDetail
            language={language}
            club={selectedClub}
            score={calculateMatch(selectedClub)}
            saved={savedClubs.includes(selectedClub.id)}
            events={events.filter(
              (event) => event.clubId === selectedClub.id
            )}
            reviews={clubReviews.filter(
              (review) => review.clubId === selectedClub.id
            )}
            canReview={events.some(
              (event) =>
                event.clubId === selectedClub.id &&
                joinedEvents.includes(event.id)
            )}
            onBack={() => setPage("runner-home")}
            onSave={() => toggleSave(selectedClub.id)}
            onAddReview={(rating: number, comment: string) =>
              addClubReview(
                selectedClub.id,
                rating,
                comment
              )
            }
            onEvent={(id: number) => {
              setSelectedEventId(id);
              setEventBackPage("club");
              setPage("event");
            }}
          />
        )}

        {page === "compare" && (
          <Compare
            language={language}
            clubs={clubs.filter((club) =>
              compareClubs.includes(club.id)
            )}
            profile={profile}
            calculateMatch={calculateMatch}
            onBack={() => setPage("compare-select")}
          />
        )}

        {page === "event" && selectedEvent && (
          <EventDetail
            language={language}
            event={selectedEvent}
            club={
              clubs.find(
                (club) => club.id === selectedEvent.clubId
              ) || selectedClub
            }
            joined={joinedEvents.includes(selectedEvent.id)}
            joinSuccess={
              joinSuccessEventId === selectedEvent.id
            }
            onBack={() => {
              setJoinSuccessEventId(null);
              setPage(eventBackPage);
            }}
            onJoin={() => joinEvent(selectedEvent.id)}
            onCancel={() => {
              setJoinSuccessEventId(null);
              cancelJoinedEvent(selectedEvent.id);
            }}
            onCloseSuccess={() =>
              setJoinSuccessEventId(null)
            }
            onViewBookings={() => {
              setJoinSuccessEventId(null);
              setPage("runner-profile");
            }}
          />
        )}

        {page === "myruns" && (
          <MyRuns
            language={language}
            events={events.filter((event) =>
              joinedEvents.includes(event.id)
            )}
            clubs={clubs}
            savedClubs={clubs.filter((club) =>
              savedClubs.includes(club.id)
            )}
            onDiscover={() => setPage("runner-home")}
            onCancel={cancelJoinedEvent}
            onEvent={(event: RunEvent) => {
              setSelectedEventId(event.id);
              setSelectedClubId(event.clubId);
              setEventBackPage("myruns");
              setPage("event");
            }}
            onClub={(id: number) => {
              setSelectedClubId(id);
              setPage("club");
            }}
            onNav={setPage}
          />
        )}

        {page === "friends" && (
          <FriendForRun
            language={language}
            threads={initialFriendThreads}
            onOpenChat={(id: number) => {
              setSelectedFriendThreadId(id);
              setPage("friends-chat");
            }}
            onAddFriend={() => setPage("friend-qr")}
            onNav={setPage}
          />
        )}

        {page === "friends-chat" && (
          <FriendChat
            language={language}
            thread={
              initialFriendThreads.find(
                (item) => item.id === selectedFriendThreadId
              ) || initialFriendThreads[0]
            }
            onBack={() => setPage("friends")}
          />
        )}

        {page === "friend-qr" && (
          <FriendQr
            language={language}
            user={user}
            profile={profile}
            onBack={() => setPage("friends")}
          />
        )}

        {page === "runner-profile" && (
          <RunnerProfile
            profile={profile}
            setProfile={setProfile}
            language={language}
            setLanguage={setLanguage}
            events={events}
            clubs={clubs}
            joinedEvents={joinedEvents}
            onEvent={(event: RunEvent) => {
              setSelectedEventId(event.id);
              setSelectedClubId(event.clubId);
              setEventBackPage("runner-profile");
              setPage("event");
            }}
            onViewAll={() => setPage("myruns")}
            onSwitchRole={switchRole}
            onReset={resetPrototype}
            onNav={setPage}
          />
        )}

        {page === "notifications" && (
          <Notifications
            notifications={notifications}
            setNotifications={setNotifications}
            onBack={() =>
              setPage(
                role === "runner"
                  ? "runner-home"
                  : "founder-dashboard"
              )
            }
          />
        )}

        {page === "founder-dashboard" && (
          <FounderDashboard
            language={language}
            club={clubs[0]}
            events={events.filter(
              (event) => event.clubId === 1
            )}
            members={initialMembers}
            onCreateEvent={() => setPage("founder-events")}
            onEditClub={() => setPage("founder-club")}
            onNav={setPage}
          />
        )}

        {page === "founder-club" && (
          <FounderClub
            language={language}
            club={clubs[0]}
            setClub={(updated: Club) =>
              setClubs((previous) =>
                previous.map((club) =>
                  club.id === updated.id ? updated : club
                )
              )
            }
            onNav={setPage}
          />
        )}

        {page === "founder-events" && (
          <FounderEvents
            language={language}
            events={events.filter(
              (event) => event.clubId === 1
            )}
            setEvents={setEvents}
            onNav={setPage}
          />
        )}

        {page === "founder-members" && (
          <FounderMembers
            language={language}
            members={initialMembers}
            totalMembers={clubs[0]?.members || 0}
            newMembers={28}
            totalRunJoins={events
              .filter((event) => event.clubId === 1)
              .reduce(
                (total, event) => total + event.participants,
                0
              )}
            onNav={setPage}
          />
        )}

        {page === "founder-profile" && (
          <FounderProfile
            founderName={user?.name || "Founder"}
            club={clubs[0]}
            runsHosted={
              events.filter((event) => event.clubId === 1).length
            }
            newMembers={28}
            language={language}
            setLanguage={setLanguage}
            onSwitchRole={switchRole}
            onReset={resetPrototype}
            onNav={setPage}
          />
        )}
      </div>
    </div>
  );
}

function Welcome({
  language,
  setLanguage,
  onStart,
  onRegister,
}: {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  onStart: () => void;
  onRegister: () => void;
}) {
  return (
    <main className="screen welcome">
      <div className="welcome-language-row">
        <LanguageQuickSwitch language={language} onChange={setLanguage} compact />
      </div>

      <div className="brand-symbol">
        <img src={runriseLogo} alt="Runrise" />
      </div>

      <div>
        <p className="eyebrow">RUNRISE</p>

        <h1 className="hero-title">
          Find your run.
          <br />
          Find your community.
        </h1>

        <p className="muted">
          Discover running communities that fit your pace, place and lifestyle.
        </p>
      </div>

      <div className="welcome-actions">
        <button
          className="primary"
          onClick={onStart}
        >
          Get Started
        </button>

        <button
          className="welcome-register-link"
          onClick={onRegister}
        >
          New to Runrise? <strong>Create account</strong>
        </button>
      </div>
    </main>
  );
}

function Login({
  language,
  setLanguage,
  storedUser,
  onLogin,
  onRegister,
  onBack,
}: {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  storedUser: UserAccount | null;
  onLogin: (account: UserAccount) => void;
  onRegister: () => void;
  onBack: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const emailInlineError =
    emailTouched && email.trim() === ""
      ? "Please enter your email."
      : email.trim() !== "" && !emailValid
        ? "Please enter a valid email address."
        : "";

  const canSubmit =
    email.trim() !== "" &&
    emailValid &&
    password.trim() !== "";

  const submit = () => {
    setError("");
    setEmailTouched(true);

    if (!emailValid) {
      return;
    }

    if (!storedUser) {
      setError("No Runrise account found yet. Please create an account first.");
      return;
    }

    if (
      storedUser.email.trim().toLowerCase() !== email.trim().toLowerCase() ||
      storedUser.password !== password
    ) {
      setError("Email or password is incorrect. Please try again.");
      return;
    }

    onLogin(storedUser);
  };

  return (
    <main className="screen auth-screen">
      <div className="auth-language-switch">
        <LanguageQuickSwitch language={language} onChange={setLanguage} compact />
      </div>

      <button
        type="button"
        className="auth-back"
        onClick={onBack}
      >
        ← Back
      </button>

      <div className="auth-brand-mark">
        <img src={runriseLogo} alt="Runrise" />
      </div>

      <div className="auth-heading">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Log in to Runrise</h1>
        <p>
          Pick up where you left off and keep moving with your community.
        </p>
      </div>

      <div className="auth-card">
        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            aria-invalid={Boolean(emailInlineError)}
            onBlur={() => setEmailTouched(true)}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
          />
          {emailInlineError && (
            <small className="auth-inline-error" role="alert">
              {emailInlineError}
            </small>
          )}
        </label>

        <label className="auth-field">
          <span>Password</span>
          <div className="auth-password-wrap">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={
                showPassword
                  ? language === "th"
                    ? "ซ่อนรหัสผ่าน"
                    : "Hide password"
                  : language === "th"
                    ? "ดูรหัสผ่าน"
                    : "Show password"
              }
              title={
                showPassword
                  ? language === "th"
                    ? "ซ่อนรหัสผ่าน"
                    : "Hide password"
                  : language === "th"
                    ? "ดูรหัสผ่าน"
                    : "Show password"
              }
            >
              {showPassword ? (
                <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="2.7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              ) : (
                <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M3 3l18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M10.6 6.2A8.8 8.8 0 0 1 12 6c6 0 9.5 6 9.5 6a15.9 15.9 0 0 1-3.2 3.8M6.1 6.1C3.7 7.7 2.5 12 2.5 12s3.5 6 9.5 6a9.7 9.7 0 0 0 3.1-.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              )}
            </button>
          </div>
        </label>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="auth-primary"
          disabled={!canSubmit}
          onClick={submit}
        >
          Log In
        </button>

        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <button type="button" onClick={onRegister}>
            Create one
          </button>
        </p>
      </div>
    </main>
  );
}

function Register({
  language,
  setLanguage,
  onRegister,
  onLogin,
  onBack,
}: {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  onRegister: (account: UserAccount) => void;
  onLogin: () => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const errors = {
    name:
      name.trim() === ""
        ? "Please enter your full name."
        : "",
    email:
      email.trim() === ""
        ? "Please enter your email."
        : !emailValid
        ? "Please enter a valid email address."
        : "",
    password:
      password === ""
        ? "Please enter a password."
        : "",
    confirmPassword:
      confirmPassword === ""
        ? "Please confirm your password."
        : confirmPassword !== password
        ? "Passwords do not match."
        : "",
    agreed:
      !agreed
        ? "Please agree to the Terms & Privacy Policy."
        : "",
  };

  const showEmailError =
    submitted ||
    emailTouched ||
    (email.trim() !== "" && !emailValid);

  const showPasswordError =
    submitted || passwordTouched;

  const showConfirmError =
    submitted ||
    confirmTouched ||
    (confirmPassword !== "" && confirmPassword !== password);

  const canSubmit =
    !errors.name &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword &&
    !errors.agreed;

  const submit = () => {
    setSubmitted(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmTouched(true);

    if (!canSubmit) return;

    onRegister({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  };

  return (
    <main className="screen auth-screen auth-register-screen">
      <div className="auth-language-switch">
        <LanguageQuickSwitch language={language} onChange={setLanguage} compact />
      </div>

      <button
        type="button"
        className="auth-back"
        onClick={onBack}
      >
        ← Back
      </button>

      <div className="auth-brand-mark">
        <img src={runriseLogo} alt="Runrise" />
      </div>

      <div className="auth-heading">
        <p className="eyebrow">JOIN RUNRISE</p>
        <h1>Create your account</h1>
        <p>
          Start with the basics. Your running preferences come next.
        </p>
      </div>

      <div className="auth-card">
        <label className="auth-field">
          <span>Full Name</span>
          <input
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {submitted && errors.name && (
            <small className="auth-inline-error">{errors.name}</small>
          )}
        </label>

        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            aria-invalid={showEmailError && Boolean(errors.email)}
            onBlur={() => setEmailTouched(true)}
            onChange={(event) => setEmail(event.target.value)}
          />
          {showEmailError && errors.email && (
            <small className="auth-inline-error" role="alert">
              {errors.email}
            </small>
          )}
        </label>

        <label className="auth-field">
          <span>Password</span>
          <div className="auth-password-wrap">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              aria-invalid={showPasswordError && Boolean(errors.password)}
              onBlur={() => setPasswordTouched(true)}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={
                showPassword
                  ? language === "th"
                    ? "ซ่อนรหัสผ่าน"
                    : "Hide password"
                  : language === "th"
                    ? "ดูรหัสผ่าน"
                    : "Show password"
              }
              title={
                showPassword
                  ? language === "th"
                    ? "ซ่อนรหัสผ่าน"
                    : "Hide password"
                  : language === "th"
                    ? "ดูรหัสผ่าน"
                    : "Show password"
              }
            >
              {showPassword ? (
                <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="2.7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              ) : (
                <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M3 3l18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M10.6 6.2A8.8 8.8 0 0 1 12 6c6 0 9.5 6 9.5 6a15.9 15.9 0 0 1-3.2 3.8M6.1 6.1C3.7 7.7 2.5 12 2.5 12s3.5 6 9.5 6a9.7 9.7 0 0 0 3.1-.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              )}
            </button>
          </div>
          {showPasswordError && errors.password && (
            <small className="auth-inline-error" role="alert">
              {errors.password}
            </small>
          )}
        </label>

        <label className="auth-field">
          <span>Confirm Password</span>
          <div className="auth-password-wrap">
            <input
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              aria-invalid={showConfirmError && Boolean(errors.confirmPassword)}
              onBlur={() => setConfirmTouched(true)}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={
                showConfirmPassword
                  ? language === "th"
                    ? "ซ่อนรหัสผ่าน"
                    : "Hide password"
                  : language === "th"
                    ? "ดูรหัสผ่าน"
                    : "Show password"
              }
              title={
                showConfirmPassword
                  ? language === "th"
                    ? "ซ่อนรหัสผ่าน"
                    : "Hide password"
                  : language === "th"
                    ? "ดูรหัสผ่าน"
                    : "Show password"
              }
            >
              {showConfirmPassword ? (
                <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="2.7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              ) : (
                <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M3 3l18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M10.6 6.2A8.8 8.8 0 0 1 12 6c6 0 9.5 6 9.5 6a15.9 15.9 0 0 1-3.2 3.8M6.1 6.1C3.7 7.7 2.5 12 2.5 12s3.5 6 9.5 6a9.7 9.7 0 0 0 3.1-.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              )}
            </button>
          </div>
          {showConfirmError && errors.confirmPassword && (
            <small className="auth-inline-error" role="alert">
              {errors.confirmPassword}
            </small>
          )}
        </label>

        <label className="auth-check-row">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
          />
          <span>I agree to the Terms &amp; Privacy Policy</span>
        </label>

        {submitted && errors.agreed && (
          <small className="auth-inline-error auth-terms-error">
            {errors.agreed}
          </small>
        )}

        <button
          type="button"
          className="auth-primary"
          disabled={!canSubmit}
          onClick={submit}
        >
          Create Account
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <button type="button" onClick={onLogin}>
            Log in
          </button>
        </p>
      </div>
    </main>
  );
}

function RoleSelect({
  language,
  setLanguage,
  onRunner,
  onFounder,
  onBack,
}: {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  onRunner: () => void;
  onFounder: () => void;
  onBack: () => void;
}) {
  return (
    <main className="screen role-screen">
      <div className="role-language-switch">
        <LanguageQuickSwitch language={language} onChange={setLanguage} compact />
      </div>

      <button
        type="button"
        className="auth-back"
        onClick={onBack}
      >
        ← Back
      </button>

      <Header
        eyebrow="WELCOME"
        title="How will you use Runrise?"
        subtitle="You can switch roles later."
      />

      <button
        className="large-card role-card"
        onClick={onRunner}
      >
        <div className="role-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="14" cy="5" r="2.2" />
            <path d="m12.5 8-2.2 4.1 3.2 2.2 1.4 4.7" />
            <path d="m11 11-4 2.2M13.4 14.3l-4 4M15 9l3.5 2.5" />
          </svg>
        </div>

        <h2>Runner</h2>
        <p>
          Discover, compare and join running communities.
        </p>
      </button>

      <button
        className="large-card role-card"
        onClick={onFounder}
      >
        <div className="role-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="9" cy="7" r="3" />
            <circle cx="17" cy="8" r="2.2" />
            <path d="M3.5 19c.5-4 2.6-6 5.5-6s5 2 5.5 6" />
            <path d="M14.5 14c2.8-.4 5 1.3 5.5 4.5" />
          </svg>
        </div>

        <h2>Founder / Organizer</h2>
        <p>
          Create, manage and grow your running community.
        </p>
      </button>
    </main>
  );
}

function RunnerOnboarding({
  language,
  setLanguage,
  profile,
  setProfile,
  onBack,
  onFinish,
}: {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  profile: RunnerProfile;
  setProfile: (profile: RunnerProfile) => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);

  const questions = [
    {
      title: "Running experience",
      subtitle: "How long have you been running?",
      helper:
        "This helps us recommend Run Clubs that feel comfortable for your current experience.",
    },
    {
      title: "Pace (min/km)",
      subtitle: "What is your usual Easy Run pace?",
      helper:
        "Choose the pace you use for most comfortable training runs, not your race pace.",
    },
    {
      title: "Favorite distance",
      subtitle: "Which distance are you most interested in running?",
      helper:
        "Choose the distance you are most interested in joining. It does not have to be your everyday training distance.",
    },
    {
      title: "Province",
      subtitle: "Which province would you like to run in?",
      helper:
        "Choose your main area first. You can change this later.",
    },
    {
      title: "District / Amphoe",
      subtitle: "Which district or amphoe would you prefer?",
      helper:
        "Choose one or more areas. Recommendations will prioritize these locations.",
    },
    {
      title: "Running Time",
      subtitle: "When do you usually prefer to run?",
      helper:
        "This helps us prioritize events that fit your usual schedule.",
    },
    {
      title: "Main goal",
      subtitle: "What is your main goal for joining a Run Club?",
      helper:
        "Choose the goals that matter to you. You can select more than one.",
    },
    {
      title: "Community preference",
      subtitle: "What kind of Run Club atmosphere do you enjoy?",
      helper:
        "Choose all community styles that feel comfortable for you. You can select more than one.",
    },
  ];

  const totalSteps = questions.length;
  const currentStepNumber = step + 1;
  const remainingSteps = Math.max(0, totalSteps - currentStepNumber);
  const progressPercent = (currentStepNumber / totalSteps) * 100;

  const stepRemainingLabel =
    remainingSteps === 0
      ? language === "th"
        ? "ขั้นตอนสุดท้าย"
        : "Final step"
      : language === "th"
        ? `เหลืออีก ${remainingSteps} ขั้นตอน`
        : `${remainingSteps} ${remainingSteps === 1 ? "step" : "steps"} left`;

  const districtOptions =
    DISTRICTS_BY_PROVINCE[profile.province] || [];

  const currentComplete = [
    Boolean(profile.runningExperience),
    Boolean(profile.pace),
    Boolean(profile.preferredDistance),
    Boolean(profile.province),
    profile.location.length > 0,
    Boolean(profile.time),
    profile.goal.length > 0,
    profile.vibe.length > 0,
  ][step];

  const updateProfile = (
    key: keyof RunnerProfile,
    value: string | string[]
  ) => {
    setProfile({
      ...profile,
      [key]: value,
    } as RunnerProfile);
  };

  const setExperience = (runningExperience: string) => {
    setProfile({
      ...profile,
      runningExperience,
      level: experienceToLegacyLevel(runningExperience),
    });
  };

  const setPreferredDistance = (preferredDistance: string) => {
    setProfile({
      ...profile,
      preferredDistance,
      distance: preferredDistanceToLegacyRange(preferredDistance),
    });
  };

  const setProvince = (province: string) => {
    setProfile({
      ...profile,
      province,
      location: [],
      parks: [],
    });
  };

  const goBack = () => {
    if (!started) {
      onBack();
      return;
    }

    if (step === 0) {
      setStarted(false);
      return;
    }

    setStep((previous) => previous - 1);
  };

  const goNext = () => {
    if (!currentComplete) return;

    if (step === totalSteps - 1) {
      onFinish();
      return;
    }

    setStep((previous) => previous + 1);
  };

  if (!started) {
    return (
      <main className="ut-onboarding ut-onboarding-intro">
        <div className="ut-onboarding-scroll">
          <div className="ut-onboarding-top intro-top">
            <button type="button" className="ut-back" onClick={onBack}>
              ← Back
            </button>

            <LanguageQuickSwitch
              language={language}
              onChange={setLanguage}
              compact
            />
          </div>

          <section className="ut-setup-intro-card">
            <div className="ut-setup-intro-icon">
              <img src={runriseLogo} alt="Runrise" />
            </div>
            <p className="eyebrow">Profile setup</p>
            <h1>A quick setup for better recommendations</h1>
            <p className="ut-setup-intro-copy">
              Answer a few short questions so Runrise can recommend Run Clubs
              and events that fit your pace, preferred distance, area and goals.
            </p>

            <div className="ut-setup-benefits">
              <span>Run Clubs</span>
              <span>Events</span>
              <span>Pace</span>
              <span>Areas</span>
              <span>Goals</span>
            </div>

            <p className="ut-setup-time">
              This takes about 1–2 minutes. You can edit these preferences later.
            </p>
          </section>
        </div>

        <div className="ut-fixed-cta">
          <button type="button" onClick={() => setStarted(true)}>
            Start profile setup
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="ut-onboarding">
      <div className="ut-onboarding-scroll">
        <div className="ut-onboarding-top">
          <button type="button" className="ut-back" onClick={goBack}>
            ← Back
          </button>

          <div className="ut-onboarding-top-actions">
            <LanguageQuickSwitch
              language={language}
              onChange={setLanguage}
              compact
            />
            <span
              className="ut-step-counter"
              data-no-translate="true"
            >
              {currentStepNumber} / {totalSteps}
            </span>
          </div>
        </div>

        <div
          className="ut-progress"
          data-no-translate="true"
          aria-label={
            language === "th"
              ? `ขั้นตอน ${currentStepNumber} จาก ${totalSteps}`
              : `Step ${currentStepNumber} of ${totalSteps}`
          }
        >
          <div
            className="ut-progress-fill"
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>

        <div
          className="ut-progress-caption"
          data-no-translate="true"
        >
          <span>{stepRemainingLabel}</span>
        </div>

        <section
          key={`onboarding-question-${step}-${language}`}
          className="ut-question-card"
        >
          <p
            className="ut-question-number"
            data-no-translate="true"
          >
            {String(currentStepNumber).padStart(2, "0")}
          </p>

          <h1>{questions[step].title}</h1>
          <p className="ut-question-prompt">{questions[step].subtitle}</p>

          <div className="ut-question-explainer">
            <span>Why we ask</span>
            <p>{questions[step].helper}</p>
          </div>

          <div
            key={`onboarding-answer-${step}-${language}`}
            className="ut-answer-area"
          >
            {step === 0 && (
              <div className="ut-choice-grid experience-grid">
                {RUNNING_EXPERIENCE_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={
                      profile.runningExperience === option
                        ? "ut-choice-card selected"
                        : "ut-choice-card"
                    }
                    onClick={() => setExperience(option)}
                  >
                    <strong>{option}</strong>
                    {profile.runningExperience === option && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <>
                <PaceWheelPicker
                  value={profile.pace}
                  onChange={(value) =>
                    updateProfile("pace", value)
                  }
                />
                <p className="ut-helper pace-selected-helper">
                  Selected Easy Run pace:{" "}
                  <strong>{profile.pace} / km</strong>
                </p>
              </>
            )}

            {step === 2 && (
              <div className="ut-choice-grid preferred-distance-grid">
                {PREFERRED_DISTANCE_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={
                      profile.preferredDistance === option
                        ? "ut-choice-card selected"
                        : "ut-choice-card"
                    }
                    onClick={() => setPreferredDistance(option)}
                  >
                    <strong>{option}</strong>
                    {profile.preferredDistance === option && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="ut-choice-grid province-grid">
                {PROVINCES.map((province) => (
                  <button
                    type="button"
                    key={province}
                    className={
                      profile.province === province
                        ? "ut-choice-card selected"
                        : "ut-choice-card"
                    }
                    onClick={() => setProvince(province)}
                  >
                    <strong>{province}</strong>
                    {profile.province === province && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
              <LocationParkSelector
                province={profile.province}
                districtOptions={districtOptions}
                selectedDistricts={profile.location}
                selectedParks={profile.parks}
                onChangeProvince={() => setStep(3)}
                onChange={(location, parks) =>
                  setProfile({
                    ...profile,
                    location,
                    parks,
                  })
                }
              />
            )}

            {step === 5 && (
              <ChipChoices
                options={RUNNING_TIMES}
                value={profile.time}
                onChange={(value) =>
                  updateProfile("time", value as string)
                }
              />
            )}

            {step === 6 && (
              <>
                <ChipChoices
                  options={RUNNING_GOALS}
                  value={profile.goal}
                  multi
                  onChange={(value) =>
                    updateProfile("goal", value as string[])
                  }
                />
                <p
                  className="ut-helper"
                  style={{ marginTop: 12, textAlign: "right" }}
                >
                  You can select more than one goal.
                </p>
              </>
            )}

            {step === 7 && (
              <>
                <ChipChoices
                  options={COMMUNITY_STYLES}
                  value={profile.vibe}
                  multi
                  onChange={(value) =>
                    updateProfile("vibe", value as string[])
                  }
                />
                <p
                  className="ut-helper"
                  style={{ marginTop: 12, textAlign: "right" }}
                >
                  You can select more than one community style.
                </p>
              </>
            )}
          </div>
        </section>
      </div>

      <div className="ut-fixed-cta">
        <button
          type="button"
          disabled={!currentComplete}
          onClick={goNext}
        >
          {step === totalSteps - 1
            ? "Complete Your Profile"
            : "Continue"}
        </button>
      </div>
    </main>
  );
}

function FounderOnboarding({
  language,
  setLanguage,
  profile,
  setProfile,
  onBack,
  onFinish,
}: {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  profile: FounderSetupProfile;
  setProfile: (profile: FounderSetupProfile) => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);

  const questions =
    language === "th"
      ? [
          {
            title: "บทบาทของคุณใน Run Club",
            subtitle: "คุณมีบทบาทอะไรใน Run Club?",
            helper:
              "ข้อมูลนี้ช่วยให้ Runrise ปรับเครื่องมือและฟีเจอร์ให้เหมาะกับหน้าที่ของคุณ",
          },
          {
            title: "โปรไฟล์ Run Club",
            subtitle: "บอกข้อมูลพื้นฐานของคลับให้เรารู้จัก",
            helper:
              "ชื่อ คำอธิบาย และรูปคลับจะเป็นข้อมูลหลักที่นักวิ่งเห็นเมื่อเปิดดูโปรไฟล์คลับของคุณ",
          },
          {
            title: "Run Club ของคุณอยู่ที่ไหน?",
            subtitle: "Run Club ของคุณจัดกิจกรรมในพื้นที่ใดเป็นหลัก?",
            helper:
              "ข้อมูลนี้ช่วยให้ Runrise แนะนำคลับให้กับนักวิ่งที่อยู่ในพื้นที่ใกล้เคียง",
          },
          {
            title: "ประเภทกิจกรรมวิ่ง",
            subtitle: "Run Club ของคุณจัดกิจกรรมวิ่งรูปแบบใดบ้าง?",
            helper:
              "เลือกประเภทที่สะท้อนกิจกรรมหลักของคลับ เพื่อให้นักวิ่งเข้าใจลักษณะการวิ่งก่อนเข้าร่วม",
          },
          {
            title: "ระดับนักวิ่งที่รองรับ",
            subtitle: "นักวิ่งระดับไหนสามารถเข้าร่วมกับคลับของคุณได้บ้าง?",
            helper:
              "ข้อมูลนี้ช่วยให้ Runrise จับคู่คลับของคุณกับนักวิ่งที่มีประสบการณ์เหมาะสม",
          },
          {
            title: "เพซที่รองรับ",
            subtitle: "โดยทั่วไปคลับของคุณรองรับ Pace ช่วงไหน?",
            helper:
              "ช่วยให้นักวิ่งรู้ว่าความเร็วของคลับเหมาะกับตัวเองหรือไม่",
          },
          {
            title: "ระยะทางที่จัดวิ่ง",
            subtitle: "กิจกรรมของคลับมักมีระยะทางประมาณเท่าไร?",
            helper:
              "ข้อมูลนี้ช่วยจับคู่กิจกรรมของคลับกับระยะทางที่นักวิ่งสนใจ",
          },
          {
            title: "พื้นที่และจุดวิ่ง",
            subtitle: "คลับของคุณมักจัดวิ่งในเขต อำเภอ หรือสวนใด?",
            helper:
              "ระบุพื้นที่จริงที่คลับใช้วิ่ง เพื่อให้การค้นหาและการจับคู่แม่นยำขึ้น",
          },
          {
            title: "ตารางวิ่งประจำ",
            subtitle: "คลับของคุณมักจัด Community Run เมื่อไร?",
            helper:
              "วันและช่วงเวลาจะช่วยให้นักวิ่งเจอกิจกรรมที่เข้ากับตารางของตัวเอง",
          },
          {
            title: "สไตล์คอมมูนิตี้",
            subtitle: "บรรยากาศของ Run Club คุณเป็นแบบไหน?",
            helper:
              "เลือกสไตล์ที่สะท้อนบรรยากาศจริงของคลับ เพื่อให้นักวิ่งรู้ว่าคลับนี้เหมาะกับเขาหรือไม่",
          },
        ]
      : [
          {
            title: "Your role in the Run Club",
            subtitle: "What is your role in the Run Club?",
            helper:
              "This helps Runrise tailor tools and features to the way you manage your club.",
          },
          {
            title: "Run Club profile",
            subtitle: "Tell us the basics about your club",
            helper:
              "Your club name, description, and image are the first things runners will see on your club profile.",
          },
          {
            title: "Where is your Run Club based?",
            subtitle: "Where does your Run Club mainly organize activities?",
            helper:
              "This helps Runrise recommend your club to runners in relevant areas.",
          },
          {
            title: "Running activities",
            subtitle: "What type of running activities do you organize?",
            helper:
              "Choose the activity types that best reflect what runners can expect from your club.",
          },
          {
            title: "Runner levels",
            subtitle: "Which runner levels can join your club?",
            helper:
              "This helps Runrise match your club with runners whose experience fits your community.",
          },
          {
            title: "Supported pace",
            subtitle: "What pace ranges does your club usually support?",
            helper:
              "This helps runners understand whether your club's pace is comfortable for them.",
          },
          {
            title: "Running distance",
            subtitle: "What distances does your club usually organize?",
            helper:
              "This helps match your runs with the distances runners are interested in.",
          },
          {
            title: "Areas & running spots",
            subtitle: "Which districts, amphoes, or parks do you usually run in?",
            helper:
              "Use your actual running areas so search and matching can work more accurately.",
          },
          {
            title: "Regular run schedule",
            subtitle: "When does your club usually organize Community Runs?",
            helper:
              "Days and time periods help runners find events that fit their schedules.",
          },
          {
            title: "Community style",
            subtitle: "What is the atmosphere of your Run Club like?",
            helper:
              "Choose the styles that best describe your club so runners know what to expect.",
          },
        ];

  const totalSteps = questions.length;
  const currentStepNumber = step + 1;
  const remainingSteps = Math.max(
    0,
    totalSteps - currentStepNumber
  );
  const progressPercent =
    (currentStepNumber / totalSteps) * 100;

  const remainingLabel =
    remainingSteps === 0
      ? language === "th"
        ? "ขั้นตอนสุดท้าย"
        : "Final step"
      : language === "th"
        ? `เหลืออีก ${remainingSteps} ขั้นตอน`
        : `${remainingSteps} ${
            remainingSteps === 1 ? "step" : "steps"
          } left`;

  const districtOptions =
    DISTRICTS_BY_PROVINCE[profile.province] || [];

  const currentComplete = [
    Boolean(profile.roleInClub),
    Boolean((profile.clubName || "").trim()) &&
      Boolean((profile.clubDescription || "").trim()) &&
      Boolean(profile.clubImageMock),
    Boolean(profile.baseType),
    Array.isArray(profile.activities) &&
      profile.activities.length > 0,
    Array.isArray(profile.levels) &&
      profile.levels.length > 0,
    Array.isArray(profile.paceRanges) &&
      profile.paceRanges.length > 0,
    Array.isArray(profile.distances) &&
      profile.distances.length > 0,
    Boolean(profile.province) &&
      Array.isArray(profile.locations) &&
      profile.locations.length > 0,
    Array.isArray(profile.days) &&
      profile.days.length > 0 &&
      Array.isArray(profile.times) &&
      profile.times.length > 0,
    Array.isArray(profile.vibe) &&
      profile.vibe.length > 0,
  ][step];

  const toggleMulti = (
    key: keyof FounderSetupProfile,
    value: string
  ) => {
    const current = profile[key];

    if (!Array.isArray(current)) return;

    setProfile({
      ...profile,
      [key]: current.includes(value)
        ? current.filter(
            (item) => item !== value
          )
        : [...current, value],
    } as FounderSetupProfile);
  };

  const selectSingle = (
    key: "roleInClub" | "baseType",
    value: string
  ) => {
    const next: FounderSetupProfile = {
      ...profile,
      [key]: value,
    };

    if (key === "baseType") {
      if (value === "Bangkok") {
        next.province = "Bangkok";
        next.locations = [];
        next.parks = [];
      }

      if (value !== "Bangkok") {
        next.province = "";
        next.locations = [];
        next.parks = [];
      }
    }

    setProfile(next);
  };

  const setProvince = (province: string) => {
    setProfile({
      ...profile,
      province,
      locations: [],
      parks: [],
    });
  };

  const goBack = () => {
    if (!started) {
      onBack();
      return;
    }

    if (step === 0) {
      setStarted(false);
      return;
    }

    setStep((previous) => previous - 1);
  };

  const goNext = () => {
    if (!currentComplete) return;

    if (step === totalSteps - 1) {
      onFinish();
      return;
    }

    setStep((previous) => previous + 1);
  };

  const renderSingleChoices = (
    options: string[],
    selected: string,
    key: "roleInClub" | "baseType",
  ) => (
    <div className="ut-choice-grid founder-choice-grid founder-single-grid">
      {options.map((option) => {
        const active = selected === option;

        return (
          <button
            type="button"
            key={option}
            className={
              active
                ? "ut-choice-card selected"
                : "ut-choice-card"
            }
            onClick={() =>
              selectSingle(key, option)
            }
          >
            <strong>
              {founderLabel(option, language)}
            </strong>

            {active && <span>✓</span>}
          </button>
        );
      })}
    </div>
  );

  const renderMultiChoices = (
    options: string[],
    selected: string[],
    key: keyof FounderSetupProfile,
    extraClass = ""
  ) => (
    <div
      className={`ut-choice-grid founder-choice-grid ${extraClass}`}
    >
      {options.map((option) => {
        const active = selected.includes(option);

        return (
          <button
            type="button"
            key={option}
            className={
              active
                ? "ut-choice-card selected"
                : "ut-choice-card"
            }
            onClick={() =>
              toggleMulti(key, option)
            }
          >
            <strong>
              {founderLabel(option, language)}
            </strong>

            {active && <span>✓</span>}
          </button>
        );
      })}
    </div>
  );

  if (!started) {
    return (
      <main
        className="ut-onboarding ut-onboarding-intro founder-onboarding"
        data-no-translate="true"
      >
        <div className="ut-onboarding-scroll">
          <div className="ut-onboarding-top intro-top">
            <button
              type="button"
              className="ut-back"
              onClick={onBack}
            >
              {language === "th"
                ? "← ย้อนกลับ"
                : "← Back"}
            </button>

            <LanguageQuickSwitch
              language={language}
              onChange={setLanguage}
              compact
            />
          </div>

          <section className="ut-setup-intro-card founder-setup-intro-card">
            <div className="ut-setup-intro-icon">
              <img
                src={runriseLogo}
                alt="Runrise"
              />
            </div>

            <p className="eyebrow">
              {language === "th"
                ? "ตั้งค่าโปรไฟล์คลับ"
                : "RUN CLUB SETUP"}
            </p>

            <h1>
              {language === "th"
                ? "สร้างโปรไฟล์ Run Club ของคุณ"
                : "Build your Run Club profile"}
            </h1>

            <p className="ut-setup-intro-copy">
              {language === "th"
                ? "ตอบคำถามสั้น ๆ เพื่อให้ Runrise เข้าใจคลับของคุณ และแนะนำให้กับนักวิ่งที่เหมาะสมมากขึ้น"
                : "Answer a few short questions so Runrise can understand your club and recommend it to the right runners."}
            </p>

            <div className="ut-setup-benefits">
              <span>
                {language === "th"
                  ? "โปรไฟล์คลับ"
                  : "Profile"}
              </span>
              <span>
                {language === "th"
                  ? "กิจกรรม"
                  : "Activities"}
              </span>
              <span>
                {language === "th"
                  ? "เพซ"
                  : "Pace"}
              </span>
              <span>
                {language === "th"
                  ? "พื้นที่"
                  : "Areas"}
              </span>
              <span>
                {language === "th"
                  ? "คอมมูนิตี้"
                  : "Community"}
              </span>
            </div>

            <p className="ut-setup-time">
              {language === "th"
                ? "ใช้เวลาประมาณ 2–3 นาที และคุณสามารถกลับมาแก้ไขข้อมูลคลับได้ภายหลัง"
                : "This takes about 2–3 minutes. You can edit your club details later."}
            </p>
          </section>
        </div>

        <div className="ut-fixed-cta">
          <button
            type="button"
            onClick={() => setStarted(true)}
          >
            {language === "th"
              ? "เริ่มตั้งค่าคลับ"
              : "Start club setup"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="ut-onboarding founder-onboarding"
      data-no-translate="true"
    >
      <div className="ut-onboarding-scroll">
        <div className="ut-onboarding-top">
          <button
            type="button"
            className="ut-back"
            onClick={goBack}
          >
            {language === "th"
              ? "← ย้อนกลับ"
              : "← Back"}
          </button>

          <div className="ut-onboarding-top-actions">
            <LanguageQuickSwitch
              language={language}
              onChange={setLanguage}
              compact
            />

            <span className="ut-step-counter">
              {currentStepNumber} / {totalSteps}
            </span>
          </div>
        </div>

        <div className="ut-progress">
          <div
            className="ut-progress-fill"
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>

        <div className="ut-progress-caption">
          <span>{remainingLabel}</span>
        </div>

        <section
          key={`founder-question-${step}-${language}`}
          className="ut-question-card founder-question-card"
        >
          <p className="ut-question-number">
            {String(currentStepNumber).padStart(
              2,
              "0"
            )}
          </p>

          <h1>
            {questions[step].title}
          </h1>

          <p className="ut-question-prompt">
            {questions[step].subtitle}
          </p>

          <div className="ut-question-explainer">
            <span>
              {language === "th"
                ? "ทำไมเราถึงถาม"
                : "WHY WE ASK"}
            </span>

            <p>
              {questions[step].helper}
            </p>
          </div>

          <div className="ut-answer-area founder-answer-area">
            {step === 0 &&
              renderSingleChoices(
                FOUNDER_ROLE_OPTIONS,
                profile.roleInClub,
                "roleInClub"
              )}

            {step === 1 && (
              <div className="founder-club-profile-form">
                <label className="founder-profile-field">
                  <span>
                    {language === "th"
                      ? "ชื่อ Run Club"
                      : "Run Club name"}
                  </span>

                  <input
                    type="text"
                    value={profile.clubName}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        clubName: event.target.value,
                      })
                    }
                    placeholder={
                      language === "th"
                        ? "กรอกชื่อ Run Club ของคุณ"
                        : "Enter your Run Club name"
                    }
                    maxLength={60}
                  />
                </label>

                <label className="founder-profile-field">
                  <span>
                    {language === "th"
                      ? "คำอธิบายคลับ"
                      : "Club description"}
                  </span>

                  <textarea
                    value={profile.clubDescription}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        clubDescription: event.target.value,
                      })
                    }
                    placeholder={
                      language === "th"
                        ? "เล่าบรรยากาศ จุดเด่น และสิ่งที่นักวิ่งจะได้จากคลับของคุณ..."
                        : "Describe your club vibe, what makes it special, and what runners can expect..."
                    }
                    maxLength={220}
                  />

                  <small>
                    {(profile.clubDescription || "").length}/220
                  </small>
                </label>

                <div className="founder-club-image-mock">
                  <div className="founder-club-image-preview">
                    <img src={runriseLogo} alt="" />
                  </div>

                  <div className="founder-club-image-copy">
                    <strong>
                      {language === "th"
                        ? "รูปโปรไฟล์คลับ"
                        : "Club profile image"}
                    </strong>

                    <p>
                      {language === "th"
                        ? "สำหรับ Prototype นี้ใช้รูป Mockup ก่อน ยังไม่ต้องอัปโหลดรูปจริง"
                        : "For this prototype, use a mock image. No real upload is needed yet."}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setProfile({
                          ...profile,
                          clubImageMock: "runrise-template",
                        })
                      }
                    >
                      {language === "th"
                        ? "ใช้รูปตัวอย่าง"
                        : "Use mock image"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 &&
              renderSingleChoices(
                FOUNDER_BASE_OPTIONS,
                profile.baseType,
                "baseType"
              )}

            {step === 3 &&
              renderMultiChoices(
                FOUNDER_ACTIVITY_OPTIONS,
                profile.activities,
                "activities",
                "founder-activity-grid"
              )}

            {step === 4 &&
              renderMultiChoices(
                FOUNDER_LEVEL_OPTIONS,
                profile.levels,
                "levels"
              )}

            {step === 5 &&
              renderMultiChoices(
                FOUNDER_PACE_OPTIONS,
                profile.paceRanges,
                "paceRanges"
              )}

            {step === 6 &&
              renderMultiChoices(
                FOUNDER_DISTANCE_OPTIONS,
                profile.distances,
                "distances"
              )}

            {step === 7 && (
              <div className="founder-location-setup">
                {profile.baseType !== "Bangkok" && (
                  <div className="founder-province-step">
                    <div className="founder-schedule-heading">
                      <strong>
                        {language === "th"
                          ? "จังหวัดหลัก"
                          : "Main province"}
                      </strong>

                      <span>
                        {language === "th"
                          ? "เลือกจังหวัดก่อน"
                          : "Choose a province first"}
                      </span>
                    </div>

                    <div className="ut-choice-grid province-grid founder-choice-grid">
                      {PROVINCES.map((province) => (
                        <button
                          type="button"
                          key={province}
                          className={
                            profile.province === province
                              ? "ut-choice-card selected"
                              : "ut-choice-card"
                          }
                          onClick={() => setProvince(province)}
                        >
                          <strong>
                            {profileValueForLanguage(
                              province,
                              language
                            )}
                          </strong>

                          {profile.province === province && (
                            <span>✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {profile.province ? (
                  <LocationParkSelector
                    province={profile.province}
                    districtOptions={districtOptions}
                    selectedDistricts={profile.locations}
                    selectedParks={profile.parks}
                    onChangeProvince={() => {
                      if (profile.baseType !== "Bangkok") {
                        setProfile({
                          ...profile,
                          province: "",
                          locations: [],
                          parks: [],
                        });
                      }
                    }}
                    onChange={(locations, parks) =>
                      setProfile({
                        ...profile,
                        locations,
                        parks,
                      })
                    }
                  />
                ) : (
                  <div className="founder-location-empty">
                    {language === "th"
                      ? "เลือกจังหวัดเพื่อดูเขต อำเภอ และจุดวิ่ง"
                      : "Choose a province to see districts and running spots."}
                  </div>
                )}
              </div>
            )}

            {step === 8 && (
              <div className="founder-schedule-setup">
                <div className="founder-schedule-block">
                  <div className="founder-schedule-heading">
                    <strong>
                      {language === "th"
                        ? "วันประจำ"
                        : "Regular days"}
                    </strong>

                    <span>
                      {language === "th"
                        ? "เลือกได้มากกว่า 1 วัน"
                        : "Select one or more"}
                    </span>
                  </div>

                  {renderMultiChoices(
                    FOUNDER_DAY_OPTIONS,
                    profile.days,
                    "days",
                    "founder-day-grid"
                  )}
                </div>

                <div className="founder-schedule-block">
                  <div className="founder-schedule-heading">
                    <strong>
                      {language === "th"
                        ? "ช่วงเวลา"
                        : "Time period"}
                    </strong>

                    <span>
                      {language === "th"
                        ? "เลือกได้มากกว่า 1 ช่วง"
                        : "Select one or more"}
                    </span>
                  </div>

                  {renderMultiChoices(
                    FOUNDER_TIME_OPTIONS,
                    profile.times,
                    "times"
                  )}
                </div>
              </div>
            )}

            {step === 9 &&
              renderMultiChoices(
                FOUNDER_COMMUNITY_OPTIONS,
                profile.vibe,
                "vibe"
              )}

            {[3, 4, 5, 6, 9].includes(step) && (
              <p className="ut-helper founder-multi-helper">
                {language === "th"
                  ? "เลือกได้มากกว่า 1 ข้อ"
                  : "You can select more than one."}
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="ut-fixed-cta">
        <button
          type="button"
          disabled={!currentComplete}
          onClick={goNext}
        >
          {step === totalSteps - 1
            ? language === "th"
              ? "ตั้งค่าคลับให้เสร็จสิ้น"
              : "Complete Club Setup"
            : language === "th"
              ? "ดำเนินการต่อ"
              : "Continue"}
        </button>
      </div>
    </main>
  );
}

function RunnerHome({
  language,
  setLanguage,
  profile,
  clubs,
  calculateMatch,
  unread,
  onClub,
  onNotifications,
  onViewAllClubs,
  onCompare,
  onNav,
}: any) {
  const [homeClubSearch, setHomeClubSearch] = useState("");
  const [homeBannerIndex, setHomeBannerIndex] = useState(0);
  const [homeBannerPreviewIndex, setHomeBannerPreviewIndex] =
    useState<number | null>(null);

  const homeBanners = [
    {
      id: "pocari",
      image: pocariRunriseBanner,
      alt:
        language === "th"
          ? "Pocari Sweat x Runrise Official Partner"
          : "Pocari Sweat x Runrise Official Partner",
    },
    {
      id: "sabai",
      image: sabaiRunriseBanner,
      alt:
        language === "th"
          ? "Runrise x Sabai Run Club Official Partner"
          : "Runrise x Sabai Run Club Official Partner",
    },
    {
      id: "adidas",
      image: adidasRunriseBanner,
      alt:
        language === "th"
          ? "adidas x Runrise Brand Collaboration"
          : "adidas x Runrise Brand Collaboration",
    },
  ];

  useEffect(() => {
    if (homeBannerPreviewIndex !== null) {
      return;
    }

    const bannerTimer = window.setInterval(() => {
      setHomeBannerIndex(
        (current) => (current + 1) % homeBanners.length
      );
    }, 4500);

    return () => {
      window.clearInterval(bannerTimer);
    };
  }, [homeBanners.length, homeBannerPreviewIndex]);

  const filteredHomeClubs = useMemo(() => {
    const keyword = homeClubSearch.trim().toLowerCase();

    if (!keyword) {
      return clubs;
    }

    return clubs.filter((club: Club) => {
      const searchableText = [
        club.name,
        club.location,
        club.distance,
        club.pace,
        club.schedule,
        club.level,
        ...(club.vibe || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [clubs, homeClubSearch]);

  const showAllHomeClubs = () => {
    setHomeClubSearch("");
    onViewAllClubs();
  };

  return (
    <main className="screen with-nav">
      <div className="ut-home-header">
        <div className="ut-home-brand-row">
          <p className="eyebrow">RUNRISE</p>

          <div className="ut-home-actions">
            <LanguageQuickSwitch
              language={language}
              onChange={setLanguage}
              compact
            />

          <button
            className="ut-notification"
            onClick={onNotifications}
            aria-label="Notifications"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>

            {unread > 0 && <span>{unread}</span>}
          </button>
          </div>
        </div>

        <h1 className="ut-home-greeting">
          Good morning, <strong>{profile.name || "Runner"}</strong>{" "}
          <span className="ut-wave">👋</span>
        </h1>
      </div>

      <div
        className="home-club-search"
        data-no-translate="true"
      >
        <span
          className="home-club-search-icon"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
          </svg>
        </span>

        <input
          value={homeClubSearch}
          onChange={(event) =>
            setHomeClubSearch(event.target.value)
          }
          placeholder={
            language === "th"
              ? "ค้นหา Run Club"
              : "Search run clubs"
          }
          aria-label={
            language === "th"
              ? "ค้นหา Run Club"
              : "Search run clubs"
          }
        />

        {homeClubSearch && (
          <button
            type="button"
            className="home-club-search-clear"
            onClick={() => setHomeClubSearch("")}
            aria-label={
              language === "th"
                ? "ล้างคำค้นหา"
                : "Clear search"
            }
          >
            ×
          </button>
        )}
      </div>

      <section
        className="home-promo-carousel"
        data-no-translate="true"
        aria-label={
          language === "th"
            ? "แบนเนอร์ประชาสัมพันธ์"
            : "Promotional banners"
        }
      >
        <div className="home-promo-viewport">
          <div
            className="home-promo-track"
            style={{
              transform: `translateX(-${homeBannerIndex * 100}%)`,
            }}
          >
            {homeBanners.map((banner, index) => (
              <button
                type="button"
                key={banner.id}
                className="home-promo-slide"
                onClick={() => {
                  setHomeBannerIndex(index);
                  setHomeBannerPreviewIndex(index);
                }}
                aria-label={
                  language === "th"
                    ? `เปิดดู ${banner.alt} แบบเต็ม`
                    : `View ${banner.alt} larger`
                }
              >
                <img
                  src={banner.image}
                  alt={banner.alt}
                />

                <span
                  className="home-promo-expand-hint"
                  aria-hidden="true"
                >
                  ⛶
                </span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="home-promo-dots"
          aria-label={
            language === "th"
              ? "เลือกแบนเนอร์"
              : "Select banner"
          }
        >
          {homeBanners.map((banner, index) => (
            <button
              type="button"
              key={banner.id}
              className={
                homeBannerIndex === index
                  ? "home-promo-dot active"
                  : "home-promo-dot"
              }
              onClick={() => setHomeBannerIndex(index)}
              aria-label={
                language === "th"
                  ? `แบนเนอร์ ${index + 1}`
                  : `Banner ${index + 1}`
              }
            />
          ))}
        </div>
      </section>

      {homeBannerPreviewIndex !== null && (
        <div
          className="home-banner-preview-backdrop"
          role="presentation"
          onClick={() => setHomeBannerPreviewIndex(null)}
        >
          <section
            className="home-banner-preview-modal"
            role="dialog"
            aria-modal="true"
            aria-label={
              language === "th"
                ? "ตัวอย่างแบนเนอร์ขนาดใหญ่"
                : "Large banner preview"
            }
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="home-banner-preview-close"
              onClick={() => setHomeBannerPreviewIndex(null)}
              aria-label={
                language === "th"
                  ? "ปิดรูป"
                  : "Close preview"
              }
            >
              ×
            </button>

            <div className="home-banner-preview-image-wrap">
              <img
                src={
                  homeBanners[homeBannerPreviewIndex].image
                }
                alt={
                  homeBanners[homeBannerPreviewIndex].alt
                }
              />
            </div>

            <div className="home-banner-preview-footer">
              <button
                type="button"
                className="home-banner-preview-arrow"
                onClick={() =>
                  setHomeBannerPreviewIndex((current) => {
                    if (current === null) {
                      return 0;
                    }

                    const next =
                      (current - 1 + homeBanners.length) %
                      homeBanners.length;

                    setHomeBannerIndex(next);
                    return next;
                  })
                }
                aria-label={
                  language === "th"
                    ? "แบนเนอร์ก่อนหน้า"
                    : "Previous banner"
                }
              >
                ‹
              </button>

              <div className="home-banner-preview-dots">
                {homeBanners.map((banner, index) => (
                  <button
                    type="button"
                    key={banner.id}
                    className={
                      homeBannerPreviewIndex === index
                        ? "home-banner-preview-dot active"
                        : "home-banner-preview-dot"
                    }
                    onClick={() => {
                      setHomeBannerPreviewIndex(index);
                      setHomeBannerIndex(index);
                    }}
                    aria-label={
                      language === "th"
                        ? `ดูแบนเนอร์ ${index + 1}`
                        : `View banner ${index + 1}`
                    }
                  />
                ))}
              </div>

              <button
                type="button"
                className="home-banner-preview-arrow"
                onClick={() =>
                  setHomeBannerPreviewIndex((current) => {
                    if (current === null) {
                      return 0;
                    }

                    const next =
                      (current + 1) %
                      homeBanners.length;

                    setHomeBannerIndex(next);
                    return next;
                  })
                }
                aria-label={
                  language === "th"
                    ? "แบนเนอร์ถัดไป"
                    : "Next banner"
                }
              >
                ›
              </button>
            </div>
          </section>
        </div>
      )}

      <div
        className="home-club-actions"
        data-no-translate="true"
      >
        <button
          type="button"
          className="home-club-action-button"
          onClick={showAllHomeClubs}
        >
          <span
            className="home-club-action-icon"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24">
              <rect x="3.5" y="3.5" width="6" height="6" rx="1.2" />
              <rect x="14.5" y="3.5" width="6" height="6" rx="1.2" />
              <rect x="3.5" y="14.5" width="6" height="6" rx="1.2" />
              <rect x="14.5" y="14.5" width="6" height="6" rx="1.2" />
            </svg>
          </span>

          <span>
            {language === "th"
              ? "ดูคลับทั้งหมด"
              : "View all clubs"}
          </span>
        </button>

        <button
          type="button"
          className="home-club-action-button"
          onClick={onCompare}
        >
          <span
            className="home-club-action-icon home-compare-icon"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24">
              <rect x="3.5" y="5" width="6.5" height="14" rx="2" />
              <rect x="14" y="5" width="6.5" height="14" rx="2" />

              <path d="M10.8 9h2.4" />
              <path d="m12.1 7.7 1.5 1.3-1.5 1.3" />

              <path d="M13.2 15h-2.4" />
              <path d="m11.9 13.7-1.5 1.3 1.5 1.3" />
            </svg>
          </span>

          <span>
            {language === "th"
              ? "เปรียบเทียบ"
              : "Compare"}
          </span>
        </button>
      </div>

      <div
        id="home-club-list"
        className="section-row home-club-list-anchor"
      >
        <div>
          <p className="eyebrow">SMART MATCHING</p>
          <h2>Recommended for you</h2>
          <p className="ut-recommendation-helper">
            Based on your pace, preferred distance, area and goals.
          </p>
        </div>

      </div>

      <div className="cards">
        {filteredHomeClubs.length > 0 ? (
          filteredHomeClubs.map((club: Club) => (
            <ClubCard
              key={club.id}
              club={club}
              score={calculateMatch(club)}
              onOpen={() => onClub(club.id)}
            />
          ))
        ) : (
          <div
            className="home-club-search-empty"
            data-no-translate="true"
          >
            <strong>
              {language === "th"
                ? "ไม่พบ Run Club ที่ตรงกับคำค้นหา"
                : "No Run Clubs match your search"}
            </strong>

            <p>
              {language === "th"
                ? "ลองค้นหาด้วยชื่อคลับ พื้นที่ ระยะ หรือสไตล์คอมมูนิตี้อื่น"
                : "Try another club name, area, distance, or community style."}
            </p>

            <button
              type="button"
              onClick={() => setHomeClubSearch("")}
            >
              {language === "th"
                ? "ดูคลับทั้งหมด"
                : "View all clubs"}
            </button>
          </div>
        )}
      </div>

      <RunnerNav language={language} active="home" onNav={onNav} />
    </main>
  );
}

function ClubCard({
  club,
  score,
  onOpen,
}: {
  club: Club;
  score: number;
  onOpen: () => void;
}) {
  return (
    <article className="club-card">
      <div className={`club-cover cover-${club.id}`}>
        {getClubImage(club.id) && (
          <img
            src={getClubImage(club.id)}
            alt={club.name}
            className="club-cover-image"
          />
        )}
{club.promoted && (
          <span className="featured">
            Featured
          </span>
        )}

        <span className="match">
          {score}% Match
        </span>
      </div>

      <div className="club-body">
        <h3>{club.name}</h3>

        <p className="muted">
          📍 {club.location}
        </p>

        <div className="meta">
          <span>
            ⏱ {club.pace}
          </span>

          <span>
            🏃 {club.distance}
          </span>

          <span>
            📅 {club.schedule}
          </span>
        </div>

        <div className="tags">
          {club.vibe.map(
            (tag) => (
              <span key={tag}>
                {tag}
              </span>
            )
          )}
        </div>

        <button
          className="secondary"
          onClick={onOpen}
        >
          View Club
        </button>
      </div>
    </article>
  );
}



function AllClubsPage({
  language,
  clubs,
  calculateMatch,
  onBack,
  onClub,
}: {
  language: AppLanguage;
  clubs: Club[];
  calculateMatch: (club: Club) => number;
  onBack: () => void;
  onClub: (clubId: number) => void;
}) {
  const [query, setQuery] = useState("");

  const filteredClubs = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return clubs;
    }

    return clubs.filter((club) => {
      const searchable = [
        club.name,
        club.location,
        club.distance,
        club.pace,
        club.schedule,
        club.level,
        ...(club.vibe || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [clubs, query]);

  return (
    <main
      className="screen all-clubs-page"
      data-no-translate="true"
    >
      <header className="all-clubs-header">
        <button
          type="button"
          className="all-clubs-back"
          onClick={onBack}
          aria-label={
            language === "th" ? "ย้อนกลับ" : "Back"
          }
        >
          ←
        </button>

        <div>
          <h1>
            {language === "th"
              ? "คลับทั้งหมด"
              : "All Run Clubs"}
          </h1>

          <p>
            {language === "th"
              ? "สำรวจ Run Club ที่เหมาะกับสไตล์การวิ่งของคุณ"
              : "Explore Run Clubs that match your running style"}
          </p>
        </div>
      </header>

      <label className="all-clubs-search">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="10.5"
            cy="10.5"
            r="6.5"
          />
          <path d="m15.5 15.5 5 5" />
        </svg>

        <input
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder={
            language === "th"
              ? "ค้นหา Run Club ชื่อคลับ พื้นที่ หรือระยะทาง"
              : "Search clubs, areas, pace or distance"
          }
        />

        {query && (
          <button
            type="button"
            className="all-clubs-clear"
            onClick={() => setQuery("")}
            aria-label={
              language === "th"
                ? "ล้างคำค้นหา"
                : "Clear search"
            }
          >
            ×
          </button>
        )}
      </label>

      <div className="all-clubs-section-head">
        <h2>
          {language === "th"
            ? "Run Club ทั้งหมด"
            : "All run clubs"}
        </h2>

        <span>
          {filteredClubs.length}{" "}
          {language === "th"
            ? "คลับ"
            : "clubs"}
        </span>
      </div>

      {filteredClubs.length > 0 ? (
        <section className="all-clubs-grid">
          {filteredClubs.map((club) => (
            <article
              className="all-club-card"
              key={club.id}
            >
              <div className="all-club-image-wrap">
                {getClubImage(club.id) && (
                  <img
                    src={getClubImage(club.id)}
                    alt={club.name}
                  />
                )}

                <span className="all-club-score">
                  {calculateMatch(club)}% Match
                </span>
              </div>

              <div className="all-club-card-body">
                <h3>{club.name}</h3>

                <p className="all-club-meta">
                  <span aria-hidden="true">●</span>
                  {language === "th"
                    ? profileValueForLanguage(
                        club.location,
                        language
                      )
                    : club.location}
                </p>

                <p className="all-club-meta">
                  <span aria-hidden="true">◷</span>
                  {language === "th"
                    ? profileValueForLanguage(
                        club.pace,
                        language
                      )
                    : club.pace}
                  {" · "}
                  {language === "th"
                    ? profileValueForLanguage(
                        club.distance,
                        language
                      )
                    : club.distance}
                </p>

                <div className="all-club-tags">
                  {club.vibe
                    .slice(0, 2)
                    .map((vibe) => (
                      <span key={vibe}>
                        {language === "th"
                          ? profileValueForLanguage(
                              vibe,
                              language
                            )
                          : vibe}
                      </span>
                    ))}
                </div>

                <button
                  type="button"
                  className="all-club-detail-button"
                  onClick={() =>
                    onClub(club.id)
                  }
                >
                  {language === "th"
                    ? "ดูรายละเอียด"
                    : "View Details"}

                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="all-clubs-empty">
          <strong>
            {language === "th"
              ? "ไม่พบ Run Club"
              : "No Run Clubs found"}
          </strong>

          <p>
            {language === "th"
              ? "ลองค้นหาด้วยชื่อคลับ พื้นที่ หรือระยะทางอื่น"
              : "Try another club name, area, pace or distance."}
          </p>

          <button
            type="button"
            onClick={() => setQuery("")}
          >
            {language === "th"
              ? "ดูคลับทั้งหมด"
              : "View all clubs"}
          </button>
        </div>
      )}
    </main>
  );
}

function CompareSelect({
  language,
  clubs,
  selectedIds,
  calculateMatch,
  onToggle,
  onBack,
  onCompare,
}: {
  language: AppLanguage;
  clubs: Club[];
  selectedIds: number[];
  calculateMatch: (club: Club) => number;
  onToggle: (clubId: number) => void;
  onBack: () => void;
  onCompare: () => void;
}) {
  const canCompare = selectedIds.length >= 2;

  return (
    <main
      className="screen compare-select-page"
      data-no-translate="true"
    >
      <header className="compare-select-header">
        <button
          type="button"
          className="compare-select-back"
          onClick={onBack}
          aria-label={language === "th" ? "ย้อนกลับ" : "Back"}
        >
          ←
        </button>

        <div>
          <h1>
            {language === "th"
              ? "เปรียบเทียบคลับ"
              : "Compare"}
          </h1>
          <p>
            {language === "th"
              ? "เลือก Run Club ได้สูงสุด 3 คลับ"
              : "Choose up to 3 run clubs"}
          </p>
        </div>
      </header>

      <div className="compare-select-search">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 5 5" />
        </svg>

        <span>
          {language === "th"
            ? "เลือกคลับที่ต้องการเปรียบเทียบ"
            : "Select clubs to compare"}
        </span>
      </div>

      <div className="compare-select-section-head">
        <h2>
          {language === "th"
            ? "Run Club ทั้งหมด"
            : "All run clubs"}
        </h2>

        <strong>
          {selectedIds.length}/3{" "}
          {language === "th" ? "เลือกแล้ว" : "selected"}
        </strong>
      </div>

      <section className="compare-select-grid">
        {clubs.map((club) => {
          const selected = selectedIds.includes(club.id);

          return (
            <button
              type="button"
              key={club.id}
              className={
                selected
                  ? "compare-select-card selected"
                  : "compare-select-card"
              }
              onClick={() => onToggle(club.id)}
            >
              <div className="compare-select-image-wrap">
                {getClubImage(club.id) && (
                  <img
                    src={getClubImage(club.id)}
                    alt={club.name}
                  />
                )}

                <span
                  className={
                    selected
                      ? "compare-select-check selected"
                      : "compare-select-check"
                  }
                  aria-hidden="true"
                >
                  {selected ? "✓" : ""}
                </span>

                <span className="compare-select-score">
                  {calculateMatch(club)}%
                </span>
              </div>

              <div className="compare-select-card-body">
                <h3>{club.name}</h3>

                <p>
                  <span aria-hidden="true">●</span>
                  {club.location}
                </p>

                <p>
                  <span aria-hidden="true">◷</span>
                  {club.pace} · {club.distance}
                </p>

                <div className="compare-select-tags">
                  {club.vibe.slice(0, 2).map((vibe) => (
                    <span key={vibe}>
                      {language === "th"
                        ? profileValueForLanguage(vibe, language)
                        : vibe}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </section>

      <div className="compare-select-sticky">
        <p>
          {selectedIds.length}{" "}
          {language === "th"
            ? "คลับที่เลือก · เลือกได้สูงสุด 3"
            : "clubs selected · Maximum 3"}
        </p>

        <button
          type="button"
          disabled={!canCompare}
          onClick={onCompare}
        >
          <span aria-hidden="true">⇆</span>
          {language === "th"
            ? `เปรียบเทียบ (${selectedIds.length})`
            : `Compare (${selectedIds.length})`}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </main>
  );
}

function RunnerEventsPage({
  language,
  setLanguage,
  events,
  clubs,
  unread,
  onNotifications,
  onEvent,
  onNav,
}: {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  events: RunEvent[];
  clubs: Club[];
  unread: number;
  onNotifications: () => void;
  onEvent: (id: number) => void;
  onNav: (page: Page) => void;
}) {
  type EventFilter = "all" | "week" | "month" | "calendar";

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<EventFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  const eventDate = (event: RunEvent) => {
    const parts = event.date.trim().split(/\s+/);
    const day = Number(parts[0]) || 1;
    const monthText = parts[1] || "Jan";

    const monthIndex = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].indexOf(monthText);

    return new Date(
      2026,
      monthIndex >= 0 ? monthIndex : 0,
      day
    );
  };

  const monthLabel = (
    monthIndex: number,
    currentLanguage: AppLanguage
  ) => {
    const th = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];

    const en = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return currentLanguage === "th"
      ? th[monthIndex]
      : en[monthIndex];
  };

  const weekdayLabel = (
    date: Date,
    currentLanguage: AppLanguage
  ) => {
    const th = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];

    const en = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ];

    return currentLanguage === "th"
      ? th[date.getDay()]
      : en[date.getDay()];
  };

  const eventTitle = (
    event: RunEvent,
    currentLanguage: AppLanguage
  ) => {
    if (currentLanguage === "en") {
      return event.name;
    }

    const thaiNames: Record<number, string> = {
      101: "Weekend Morning Run",
      201: "Evening Community Run",
      301: "Bangkok Morning Run",
      401: "Sunday Easy 5K",
      501: "Sabai Social Run",
      601: "Founders Morning 3K",
    };

    return thaiNames[event.id] || event.name;
  };

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) =>
        eventDate(a).getTime() -
        eventDate(b).getTime()
    );
  }, [events]);

  const visibleEvents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let next = sortedEvents.filter((event) => {
      const club = clubs.find(
        (item) => item.id === event.clubId
      );

      const searchable = [
        event.name,
        event.location,
        event.meetingPoint,
        event.distance,
        event.pace,
        club?.name || "",
      ]
        .join(" ")
        .toLowerCase();

      return (
        keyword.length === 0 ||
        searchable.includes(keyword)
      );
    });

    if (activeFilter === "week") {
      next = next.slice(0, 3);
    }

    if (activeFilter === "calendar") {
      next = [...next].sort(
        (a, b) =>
          eventDate(a).getTime() -
          eventDate(b).getTime()
      );
    }

    return next;
  }, [
    activeFilter,
    clubs,
    search,
    sortedEvents,
  ]);

  return (
    <main
      className="screen with-nav runrise-event-list-page"
      data-no-translate="true"
    >
      <header className="event-list-top">
        <p className="event-list-brand">
          RUNRISE
        </p>

        <div className="event-list-top-actions">
          <LanguageQuickSwitch
            language={language}
            onChange={setLanguage}
            compact
          />

          <button
            type="button"
            className="event-list-notification"
            onClick={onNotifications}
            aria-label={
              language === "th"
                ? "การแจ้งเตือน"
                : "Notifications"
            }
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>

            {unread > 0 && (
              <span>{unread}</span>
            )}
          </button>
        </div>
      </header>

      <section className="event-list-hero">
        <div className="event-list-hero-copy">
          <h1>
            {language === "th"
              ? "อีเวนต์"
              : "Event"}
          </h1>

          <p>
            {language === "th"
              ? "ค้นหาและเข้าร่วมงานวิ่งจาก Run Club ในกรุงเทพฯ และปริมณฑล"
              : "Find and join runs from Run Clubs around Bangkok and nearby areas."}
          </p>
        </div>

        <div
          className="event-list-hero-art"
          aria-hidden="true"
        >
          <span className="event-list-sun" />
          <span className="event-list-road road-a" />
          <span className="event-list-road road-b" />
          <span className="event-list-road road-c" />
        </div>
      </section>

      <div className="event-search-row">
        <label className="event-search-box">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              cx="10.5"
              cy="10.5"
              r="6.5"
            />
            <path d="m15.5 15.5 5 5" />
          </svg>

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder={
              language === "th"
                ? "ค้นหาอีเวนต์ (ชื่อคลับ, ชื่องาน, พื้นที่)"
                : "Search events (club, event, area)"
            }
          />

          {search && (
            <button
              type="button"
              className="event-search-clear"
              onClick={() => setSearch("")}
              aria-label={
                language === "th"
                  ? "ล้างคำค้นหา"
                  : "Clear search"
              }
            >
              ×
            </button>
          )}
        </label>

        <button
          type="button"
          className={
            showFilters
              ? "event-filter-button active"
              : "event-filter-button"
          }
          onClick={() =>
            setShowFilters((previous) => !previous)
          }
          aria-label={
            language === "th"
              ? "ตัวกรอง"
              : "Filter"
          }
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M4 7h9M17 7h3" />
            <circle cx="15" cy="7" r="2" />
            <path d="M4 17h3M11 17h9" />
            <circle cx="9" cy="17" r="2" />
          </svg>
        </button>
      </div>

      {showFilters && (
        <div className="event-filter-note">
          {language === "th"
            ? "เลือกช่วงเวลาจากแถบด้านล่างเพื่อกรองอีเวนต์"
            : "Use the tabs below to filter events by period."}
        </div>
      )}

      <div className="event-filter-tabs">
        <button
          type="button"
          className={
            activeFilter === "all"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveFilter("all")
          }
        >
          {language === "th"
            ? "ทั้งหมด"
            : "All"}
        </button>

        <button
          type="button"
          className={
            activeFilter === "week"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveFilter("week")
          }
        >
          {language === "th"
            ? "สัปดาห์นี้"
            : "This week"}
        </button>

        <button
          type="button"
          className={
            activeFilter === "month"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveFilter("month")
          }
        >
          {language === "th"
            ? "เดือนนี้"
            : "This month"}
        </button>

        <button
          type="button"
          className={
            activeFilter === "calendar"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveFilter("calendar")
          }
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <rect
              x="3.5"
              y="5"
              width="17"
              height="15"
              rx="2"
            />
            <path d="M7.5 3v4M16.5 3v4M3.5 9h17" />
          </svg>

          {language === "th"
            ? "ปฏิทิน"
            : "Calendar"}
        </button>
      </div>

      <section className="event-card-list">
        {visibleEvents.length > 0 ? (
          visibleEvents.map((event) => {
            const club = clubs.find(
              (item) =>
                item.id === event.clubId
            );

            const date = eventDate(event);
            const image = club
              ? getClubImage(club.id)
              : undefined;

            return (
              <button
                type="button"
                key={event.id}
                className="event-list-card"
                onClick={() =>
                  onEvent(event.id)
                }
              >
                <div className="event-list-image">
                  {image ? (
                    <img
                      src={image}
                      alt={club?.name || event.name}
                    />
                  ) : (
                    <div className="event-list-image-fallback">
                      {club?.name
                        ?.slice(0, 2)
                        .toUpperCase() ||
                        "RR"}
                    </div>
                  )}
                </div>

                <div className="event-list-card-content">
                  <span className="event-club-pill">
                    {club?.name ||
                      "Runrise Run Club"}
                  </span>

                  <h2>
                    {eventTitle(
                      event,
                      language
                    )}
                  </h2>

                  <p className="event-list-location">
                    <span
                      className="event-location-pin"
                      aria-hidden="true"
                    >
                      ●
                    </span>

                    {profileValueForLanguage(
                      event.meetingPoint ||
                        event.location,
                      language
                    )}

                    {event.location && (
                      <>
                        {" · "}
                        {profileValueForLanguage(
                          event.location,
                          language
                        )}
                      </>
                    )}
                  </p>

                  <div className="event-list-meta">
                    <span>
                      <b aria-hidden="true">
                        ↟
                      </b>

                      {profileValueForLanguage(
                        event.distance,
                        language
                      )}
                    </span>

                    <span>
                      <b aria-hidden="true">
                        ◷
                      </b>
                      Pace {event.pace}
                      {language === "th"
                        ? " / กม."
                        : " / km"}
                    </span>
                  </div>

                  <p className="event-list-time">
                    <span aria-hidden="true">
                      ◷
                    </span>

                    {event.time}
                    {language === "th"
                      ? " น."
                      : ""}
                  </p>
                </div>

                <div className="event-date-card">
                  <small>
                    {weekdayLabel(
                      date,
                      language
                    )}
                  </small>

                  <strong>
                    {date.getDate()}
                  </strong>

                  <span>
                    {monthLabel(
                      date.getMonth(),
                      language
                    )}{" "}
                    {language === "th"
                      ? "2569"
                      : "2026"}
                  </span>
                </div>

                <span
                  className="event-list-chevron"
                  aria-hidden="true"
                >
                  ›
                </span>
              </button>
            );
          })
        ) : (
          <div className="event-list-empty">
            <div>◎</div>

            <h2>
              {language === "th"
                ? "ไม่พบอีเวนต์"
                : "No events found"}
            </h2>

            <p>
              {language === "th"
                ? "ลองค้นหาด้วยชื่อคลับ ชื่องาน หรือพื้นที่อื่น"
                : "Try another club, event name, or area."}
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveFilter("all");
              }}
            >
              {language === "th"
                ? "ดูอีเวนต์ทั้งหมด"
                : "View all events"}
            </button>
          </div>
        )}
      </section>

      <RunnerNav
        language={language}
        active="events"
        onNav={onNav}
      />
    </main>
  );
}

function ClubDetail({
  language,
  club,
  score,
  saved,
  events,
  reviews,
  canReview,
  onBack,
  onSave,
  onAddReview,
  onEvent,
}: {
  language: AppLanguage;
  club: Club;
  score: number;
  saved: boolean;
  events: RunEvent[];
  reviews: ClubReview[];
  canReview: boolean;
  onBack: () => void;
  onSave: () => void;
  onAddReview: (rating: number, comment: string) => void;
  onEvent: (eventId: number) => void;
}) {
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / reviews.length
      : 0;

  const submitReview = () => {
    if (!reviewComment.trim()) {
      return;
    }

    onAddReview(reviewRating, reviewComment);
    setReviewComment("");
    setReviewRating(5);
    setReviewFormOpen(false);
  };

  return (
    <main className="screen">
      <div className="detail-toolbar">
        <button
          className="circle-button"
          onClick={onBack}
        >
          ←
        </button>

        <button
          className="pill-button"
          onClick={onSave}
        >
          {saved
            ? "★ Saved"
            : "☆ Save"}
        </button>
      </div>

      <div className={`club-cover large-cover cover-${club.id}`}>
        {getClubImage(club.id) && (
          <img
            src={getClubImage(club.id)}
            alt={club.name}
            className="club-cover-image club-detail-cover-image"
          />
        )}
        <span className="match">
          {score}% Match
        </span>
      </div>

      <h1 className="club-title">
        {club.name}
      </h1>

      <p className="muted">
        📍 {club.location}
        {club.members > 0
          ? ` · ${club.members} members`
          : ""}
      </p>

      <div className="stat-grid">
        <Stat
          label="PACE"
          value={club.pace}
        />

        <Stat
          label="DISTANCE"
          value={club.distance}
        />

        <Stat
          label="LEVEL"
          value={club.level}
        />
      </div>

      <section className="section">
        <h2>About</h2>

        <p className="muted">
          {club.description}
        </p>

        {CLUB_INSTAGRAM[club.id] && (
          <a
            className="club-instagram-contact"
            href={CLUB_INSTAGRAM[club.id]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${club.name} Instagram`}
          >
            <span
              className="club-instagram-icon"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                focusable="false"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1.2"
                  fill="currentColor"
                />
              </svg>
            </span>

            <span className="club-instagram-link-text">
              {CLUB_INSTAGRAM[club.id]}
            </span>
          </a>
        )}
      </section>

      <section className="section">
        <h2>
          Community vibe
        </h2>

        <div className="tags">
          {club.vibe.map(
            (vibe: string) => (
              <span key={vibe}>
                {vibe}
              </span>
            )
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-row">
          <div>
            <p className="eyebrow">
              JOIN A RUN
            </p>

            <h2>
              Upcoming Runs
            </h2>
          </div>
        </div>

        {events.length === 0 && (
          <p className="muted">
            No upcoming runs yet.
          </p>
        )}

        {events.map(
          (event: RunEvent) => (
            <button
              key={event.id}
              className="event-row"
              onClick={() =>
                onEvent(event.id)
              }
            >
              <div>
                <strong>
                  {event.name}
                </strong>

                <p>
                  {event.date} ·{" "}
                  {event.time}
                </p>

                <small className="event-mini-detail">
                  {event.distance} ·{" "}
                  {event.pace}
                </small>
              </div>

              <div className="event-arrow">
                ›
              </div>
            </button>
          )
        )}
      </section>


      <section className="section club-review-section">
        <div className="club-review-heading">
          <div>
            <p className="eyebrow">
              {language === "th"
                ? "รีวิวจากนักวิ่ง"
                : "RUNNER REVIEWS"}
            </p>
          </div>

          {reviews.length > 0 && (
            <div className="club-review-summary">
              <strong>
                {averageRating.toFixed(1)}
              </strong>

              <div>
                <div className="club-review-summary-stars">
                  {"★★★★★"}
                </div>

                <span>
                  {reviews.length}{" "}
                  {language === "th"
                    ? "รีวิว"
                    : "reviews"}
                </span>
              </div>
            </div>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="club-review-scroll">
            {reviews.map((review) => (
              <article
                className="club-review-card"
                key={review.id}
              >
                <div className="club-review-card-top">
                  <div className="club-review-avatar">
                    {review.author
                      .trim()
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>

                  <div className="club-review-author">
                    <strong>{review.author}</strong>

                    <span>{review.createdAt}</span>
                  </div>

                  <div
                    className="club-review-stars"
                    aria-label={`${review.rating} stars`}
                  >
                    {Array.from({ length: 5 }).map(
                      (_, index) => (
                        <span
                          key={index}
                          className={
                            index < review.rating
                              ? "filled"
                              : ""
                          }
                        >
                          ★
                        </span>
                      )
                    )}
                  </div>
                </div>

                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="club-review-empty">
            <strong>
              {language === "th"
                ? "ยังไม่มีรีวิว"
                : "No reviews yet"}
            </strong>

            <p>
              {language === "th"
                ? "เป็นคนแรกที่มาแชร์ประสบการณ์หลังวิ่งกับคลับนี้"
                : "Be the first to share your experience after running with this club."}
            </p>
          </div>
        )}

        <div className="club-review-action-area">
          {canReview ? (
            <>
              {!reviewFormOpen ? (
                <button
                  type="button"
                  className="club-review-write-button"
                  onClick={() =>
                    setReviewFormOpen(true)
                  }
                >
                  <span aria-hidden="true">✎</span>

                  {language === "th"
                    ? "เขียนรีวิวหลังวิ่ง"
                    : "Write a review"}
                </button>
              ) : (
                <div className="club-review-form">
                  <div className="club-review-form-head">
                    <div>
                      <strong>
                        {language === "th"
                          ? "ให้คะแนนคลับนี้"
                          : "Rate this club"}
                      </strong>

                      <span>
                        {language === "th"
                          ? "เลือกดาวและแชร์ประสบการณ์ของคุณ"
                          : "Choose a rating and share your experience"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setReviewFormOpen(false)
                      }
                      aria-label={
                        language === "th"
                          ? "ปิด"
                          : "Close"
                      }
                    >
                      ×
                    </button>
                  </div>

                  <div className="club-review-rating-picker">
                    {Array.from({ length: 5 }).map(
                      (_, index) => {
                        const rating = index + 1;

                        return (
                          <button
                            type="button"
                            key={rating}
                            className={
                              rating <= reviewRating
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              setReviewRating(rating)
                            }
                            aria-label={`${rating} stars`}
                          >
                            ★
                          </button>
                        );
                      }
                    )}
                  </div>

                  <textarea
                    value={reviewComment}
                    onChange={(event) =>
                      setReviewComment(
                        event.target.value
                      )
                    }
                    placeholder={
                      language === "th"
                        ? "เล่าให้คนอื่นฟังหน่อยว่า บรรยากาศ เพซ เส้นทาง หรือสมาชิกเป็นอย่างไร..."
                        : "Tell other runners about the vibe, pace, route, or community..."
                    }
                    maxLength={280}
                  />

                  <div className="club-review-form-footer">
                    <span>
                      {reviewComment.length}/280
                    </span>

                    <button
                      type="button"
                      disabled={
                        !reviewComment.trim()
                      }
                      onClick={submitReview}
                    >
                      {language === "th"
                        ? "ส่งรีวิว"
                        : "Post review"}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="club-review-locked">
              <span aria-hidden="true">✓</span>

              <p>
                {language === "th"
                  ? "หลังจากคุณเข้าร่วมกิจกรรมของคลับนี้แล้ว จะสามารถกลับมาเขียนรีวิวได้"
                  : "After you join a run with this club, you’ll be able to come back and write a review."}
              </p>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}

function Compare({
  language,
  clubs,
  profile,
  calculateMatch,
  onBack,
}: {
  language: AppLanguage;
  clubs: Club[];
  profile: RunnerProfile;
  calculateMatch: (club: Club) => number;
  onBack: () => void;
}) {
  if (clubs.length < 2) {
    return (
      <main className="screen">
        <button
          className="circle-button"
          onClick={onBack}
        >
          ←
        </button>

        <Header
          eyebrow="COMPARE"
          title="Compare Run Clubs"
        />

        <Empty
          icon="⇆"
          title={
            language === "th"
              ? "เลือกอย่างน้อย 2 คลับ"
              : "Choose at least 2 clubs"
          }
          description={
            language === "th"
              ? "ย้อนกลับไปเลือก Run Club ที่ต้องการเปรียบเทียบ"
              : "Go back and select the Run Clubs you want to compare."
          }
        />
      </main>
    );
  }

  const sorted = [...clubs].sort(
    (a, b) => calculateMatch(b) - calculateMatch(a)
  );

  const bestClub = sorted[0];
  const bestClubIndex = clubs.findIndex(
    (club) => club.id === bestClub.id
  );

  const scheduleMatches = (club: Club) => {
    if (!profile.time) return false;

    return (
      profile.time === "Flexible" ||
      club.schedule
        .toLowerCase()
        .includes(profile.time.toLowerCase())
    );
  };

  const levelMatches = (club: Club) => {
    if (!profile.level) return false;

    return (
      club.level === profile.level ||
      club.level === "All Levels"
    );
  };

  const communityMatches = (club: Club) => {
    if (profile.vibe.length === 0) return false;

    return club.vibe.some((clubVibe) =>
      profile.vibe.some(
        (runnerVibe) =>
          clubVibe.toLowerCase() === runnerVibe.toLowerCase()
      )
    );
  };

  const criteria = [
    {
      label: "LOCATION",
      subtitle: "Preferred area",
      values: clubs.map((club) => club.location),
      matches: clubs.map((club) =>
        profile.location.some(
          (area) =>
            area.toLowerCase() === club.location.toLowerCase()
        )
      ),
    },
    {
      label: "DISTANCE",
      subtitle: "Your preferred range",
      values: clubs.map((club) => club.distance),
      matches: clubs.map((club) =>
        Boolean(profile.distance) &&
        distanceMatches(profile.distance, club.distance)
      ),
    },
    {
      label: "PACE",
      subtitle: "Comfortable running pace",
      values: clubs.map((club) => club.pace),
      matches: clubs.map((club) =>
        Boolean(profile.pace) &&
        paceMatches(profile.pace, club.pace)
      ),
    },
    {
      label: "SCHEDULE",
      subtitle: "When you prefer to run",
      values: clubs.map((club) => club.schedule),
      matches: clubs.map(scheduleMatches),
    },
    {
      label: "LEVEL",
      subtitle: "Running experience",
      values: clubs.map((club) => club.level),
      matches: clubs.map(levelMatches),
    },
    {
      label: "COMMUNITY",
      subtitle: "Community style",
      values: clubs.map((club) => club.vibe.join(" · ")),
      matches: clubs.map(communityMatches),
    },
  ];

  return (
    <main className="screen compare-page">
      <button
        className="circle-button"
        onClick={onBack}
      >
        ←
      </button>

      <Header
        eyebrow="COMPARE"
        title="Which club fits you?"
        subtitle="See the differences at a glance."
      />

      <section className="compare-winner">
        <div className="compare-winner-label">
          BEST FIT
        </div>

        <div>
          <span className="compare-winner-score">
            {calculateMatch(bestClub)}%
          </span>
          <h2>{bestClub.name}</h2>
          <p>
            This club matches more of your current running
            preferences.
          </p>
        </div>
      </section>

      <div
        className="compare-club-heads compare-club-heads-v2"
        style={{
          gridTemplateColumns: `repeat(${clubs.length}, minmax(0, 1fr))`,
        }}
      >
        {clubs.map((club, index) => {
          const isBest = index === bestClubIndex;

          return (
            <div
              key={club.id}
              className={
                isBest
                  ? "compare-club-head-v2 best"
                  : "compare-club-head-v2"
              }
            >
              {isBest && (
                <span className="compare-best-pill">
                  Best Fit
                </span>
              )}

              <div className={`compare-cover compare-cover-v2 cover-${club.id}`}>
                {getClubImage(club.id) && (
                  <img
                    src={getClubImage(club.id)}
                    alt={club.name}
                    className="club-cover-image compare-club-image"
                  />
                )}
              </div>

              <div className="compare-head-content">
                <strong>{club.name}</strong>

                <div className="compare-score-row">
                  <b>{calculateMatch(club)}%</b>
                  <span>Match</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="compare-breakdown">
        <div className="compare-breakdown-title">
          <div>
            <p className="eyebrow">MATCH BREAKDOWN</p>
            <h2>What’s different?</h2>
          </div>

          <span className="compare-match-key">
            <i /> Matches you
          </span>
        </div>

        {criteria.map((criterion) => (
          <CompareCriterionRow
            key={criterion.label}
            label={criterion.label}
            subtitle={criterion.subtitle}
            values={criterion.values}
            matches={criterion.matches}
            bestClubIndex={bestClubIndex}
          />
        ))}
      </section>
    </main>
  );
}

function CompareCriterionRow({
  label,
  subtitle,
  values,
  matches,
  bestClubIndex,
}: {
  label: string;
  subtitle: string;
  values: string[];
  matches: boolean[];
  bestClubIndex: number;
}) {
  return (
    <div className="compare-criterion-row">
      <div className="compare-criterion-label">
        <strong>{label}</strong>
        <span>{subtitle}</span>
      </div>

      <div
        className="compare-criterion-values"
        style={{
          gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
        }}
      >
        {values.map((value, index) => (
          <div
            key={`${label}-${index}`}
            className={[
              "compare-value-card",
              matches[index] ? "matches" : "",
              index === bestClubIndex ? "best-column" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span>{value}</span>

            {matches[index] && (
              <b className="compare-match-check">
                ✓
              </b>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EventDetail({
  language,
  event,
  club,
  joined,
  joinSuccess,
  onBack,
  onJoin,
  onCancel,
  onCloseSuccess,
  onViewBookings,
}: {
  language: AppLanguage;
  event: RunEvent;
  club: Club;
  joined: boolean;
  joinSuccess: boolean;
  onBack: () => void;
  onJoin: () => void;
  onCancel: () => void;
  onCloseSuccess: () => void;
  onViewBookings: () => void;
}) {
  const full =
    event.participants >=
    event.capacity;

  return (
    <main className="screen event-screen">
      <div className="event-topbar">
        <button
          className="circle-button"
          onClick={onBack}
        >
          ←
        </button>

        <span className="club-mini-name">
          {club.name}
        </span>
      </div>

      <div className="event-hero">
        <div>
          <p className="eyebrow">
            UPCOMING RUN
          </p>

          <h1>
            {event.name}
          </h1>

          <p>
            {event.date} ·{" "}
            {event.time}
          </p>
        </div>

        <div className="event-spots">
          <strong>
            {Math.max(
              event.capacity -
                event.participants,
              0
            )}
          </strong>

          <span>
            spots left
          </span>
        </div>
      </div>

      <button
        className={
          joined
            ? "hero-join-button joined"
            : "hero-join-button"
        }
        disabled={
          full && !joined
        }
        onClick={
          joined
            ? onCancel
            : onJoin
        }
      >
        {joined
          ? "✓ Joined · Cancel Run"
          : full
          ? "Run Full"
          : "Join This Run"}
      </button>

      <div className="event-quick-info">
        <Info
          label="DISTANCE"
          value={event.distance}
        />

        <Info
          label="PACE"
          value={event.pace}
        />

        <Info
          label="RUNNERS"
          value={`${event.participants}/${event.capacity}`}
        />
      </div>

      <section className="section">
        <h2>
          Meeting Point
        </h2>

        <div className="map">
          <span>📍</span>

          <strong>
            {event.meetingPoint}
          </strong>
        </div>
      </section>

      <section className="section">
        <h2>Route</h2>

        <p className="muted">
          {event.route}
        </p>
      </section>

      <section className="section">
        <h2>
          What to bring
        </h2>

        <p className="muted">
          {event.whatToBring}
        </p>
      </section>

      {joinSuccess && (
        <div
          className="join-success-backdrop"
          onClick={onCloseSuccess}
        >
          <section
            className="join-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-success-title"
            onClick={(clickEvent) =>
              clickEvent.stopPropagation()
            }
          >
            <button
              type="button"
              className="join-success-close"
              onClick={onCloseSuccess}
              aria-label={
                language === "th"
                  ? "ปิด"
                  : "Close"
              }
            >
              ×
            </button>

            <div
              className="join-success-icon"
              aria-hidden="true"
            >
              ✓
            </div>

            <p className="join-success-eyebrow">
              {language === "th"
                ? "เข้าร่วมสำเร็จ"
                : "JOINED SUCCESSFULLY"}
            </p>

            <h2 id="join-success-title">
              {language === "th"
                ? "คุณได้เข้าร่วมกิจกรรมนี้แล้ว"
                : "You’ve joined this run!"}
            </h2>

            <p className="join-success-copy">
              {language === "th"
                ? "ระบบบันทึกกิจกรรมนี้ไว้ใน “การจองของฉัน” เรียบร้อยแล้ว"
                : "This event has been saved to My Bookings."}
            </p>

            <div className="join-success-event">
              <strong>{event.name}</strong>

              <span>
                {event.date} · {event.time}
              </span>
            </div>

            <button
              type="button"
              className="join-success-primary"
              onClick={onViewBookings}
            >
              {language === "th"
                ? "ดูการจองของฉัน"
                : "View My Bookings"}

              <span aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className="join-success-secondary"
              onClick={onCloseSuccess}
            >
              {language === "th"
                ? "อยู่หน้านี้ต่อ"
                : "Stay on this page"}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

function MyRuns({
  language,
  events,
  clubs,
  savedClubs,
  onDiscover,
  onCancel,
  onEvent,
  onClub,
  onNav,
}: any) {
  const [tab, setTab] =
    useState<
      "runs" | "saved"
    >("runs");

  const nextRun =
    events[0];

  return (
    <main className="screen with-nav">
      <Header
        eyebrow="MY RUNRISE"
        title="Your running space"
        subtitle="Everything you've joined and saved."
      />

      <div className="segmented-control">
        <button
          className={
            tab === "runs"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab("runs")
          }
        >
          Upcoming Runs
        </button>

        <button
          className={
            tab === "saved"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab("saved")
          }
        >
          Saved Clubs{" "}
          {savedClubs.length > 0 &&
            `(${savedClubs.length})`}
        </button>
      </div>

      {tab === "runs" && (
        <>
          {events.length === 0 ? (
            <Empty
              icon="🏃"
              title="Your next run starts here"
              description="Find a community and join your first run."
              action="Discover Runs"
              onAction={
                onDiscover
              }
            />
          ) : (
            <>
              <section className="next-run-section">
                <p className="small-label">
                  YOUR NEXT RUN
                </p>

                <div
                  className="next-run-hero"
                  onClick={() =>
                    onEvent(
                      nextRun
                    )
                  }
                >
                  <div className="calendar-block">
                    <strong>
                      {nextRun.date.split(
                        " "
                      )[0]}
                    </strong>

                    <span>
                      {nextRun.date.split(
                        " "
                      )[1]}
                    </span>
                  </div>

                  <div className="next-run-info">
                    <small>
                      {
                        clubs.find(
                          (
                            club: Club
                          ) =>
                            club.id ===
                            nextRun.clubId
                        )?.name
                      }
                    </small>

                    <h2>
                      {nextRun.name}
                    </h2>

                    <p>
                      {nextRun.time} ·{" "}
                      {
                        nextRun.location
                      }
                    </p>

                    <div className="next-run-tags">
                      <span>
                        {
                          nextRun.distance
                        }
                      </span>

                      <span>
                        {
                          nextRun.pace
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <button
                className="cancel-next-run"
                onClick={() =>
                  onCancel(
                    nextRun.id
                  )
                }
              >
                Cancel next run
              </button>
            </>
          )}
        </>
      )}

      {tab === "saved" && (
        <>
          {savedClubs.length ===
          0 ? (
            <Empty
              icon="☆"
              title="No saved clubs yet"
              description="Save clubs you're interested in and come back anytime."
              action="Discover Clubs"
              onAction={
                onDiscover
              }
            />
          ) : (
            <div className="saved-club-list">
              {savedClubs.map(
                (club: Club) => (
                  <article
                    className="saved-club-card"
                    key={club.id}
                  >
                    <div
                      className={`saved-cover cover-${club.id}`}
                    />

                    <div className="saved-club-info">
                      <h3>
                        {club.name}
                      </h3>

                      <p>
                        📍{" "}
                        {
                          club.location
                        }
                      </p>

                      <div className="saved-meta">
                        <span>
                          {
                            club.distance
                          }
                        </span>

                        <span>
                          {
                            club.pace
                          }
                        </span>
                      </div>

                      <button
                        className="secondary"
                        onClick={() =>
                          onClub(
                            club.id
                          )
                        }
                      >
                        View Club
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </>
      )}

      <RunnerNav
        language={language}
        active="myruns"
        onNav={onNav}
      />
    </main>
  );
}


function FriendForRun({
  language,
  threads,
  onOpenChat,
  onAddFriend,
  onNav,
}: {
  language: AppLanguage;
  threads: FriendThread[];
  onOpenChat: (id: number) => void;
  onAddFriend: () => void;
  onNav: (page: Page) => void;
}) {
  const [query, setQuery] = useState("");

  const threadsWithLatestMessage =
    threads.map(getFriendThreadPreview);

  const filteredThreads =
    threadsWithLatestMessage.filter((thread) => {
      const keyword =
        query.trim().toLowerCase();

      if (!keyword) return true;

      return (
        thread.name
          .toLowerCase()
          .includes(keyword) ||
        thread.preview
          .toLowerCase()
          .includes(keyword)
      );
    });

  return (
    <main
      className="screen with-nav friends-page"
      data-no-translate="true"
    >
      <header className="friends-header">
        <div className="friends-heading">
          <p className="friends-eyebrow">RUNRISE FRIENDS</p>
          <h1>
            {language === "th"
              ? "เพื่อนวิ่ง"
              : "Friend for Run"}
          </h1>
          <p>
            {language === "th"
              ? "ค้นหาเพื่อน กลุ่มวิ่ง และพูดคุยก่อนออกไปวิ่งด้วยกัน"
              : "Find friends, running groups, and chat before your next run."}
          </p>
        </div>

        <button
          type="button"
          className="friends-add-button"
          onClick={onAddFriend}
          aria-label={
            language === "th"
              ? "เพิ่มเพื่อน"
              : "Add friend"
          }
        >
          <span className="friends-add-qr" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 4h6v6H4z" />
              <path d="M14 4h6v6h-6z" />
              <path d="M4 14h6v6H4z" />

              <path d="M14 14h2v2h-2z" />
              <path d="M18 14h2v2h-2z" />
              <path d="M14 18h2v2h-2z" />
              <path d="M18 18h2v2h-2z" />
              <path d="M16 16h2v2h-2z" />
            </svg>
          </span>
          <small>
            {language === "th" ? "เพิ่มเพื่อน" : "Add Friend"}
          </small>
        </button>
      </header>

      <div className="friends-search-wrap">
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
          </svg>
        </span>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            language === "th"
              ? "ค้นหาเพื่อนหรือกลุ่มวิ่ง"
              : "Search friends or running groups"
          }
        />
      </div>

      <section className="friends-list">
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => (
            <button
              type="button"
              className="friend-thread"
              key={thread.id}
              onClick={() => onOpenChat(thread.id)}
            >
              <span
                className={`friend-avatar friend-avatar-${thread.accent}`}
                aria-hidden="true"
              >
                {thread.initials}
              </span>

              <span className="friend-thread-main">
                <span className="friend-thread-top">
                  <strong>{thread.name}</strong>
                  <time>{thread.time}</time>
                </span>

                <span className="friend-thread-preview">
                  {thread.preview}
                </span>

                <span className="friend-thread-type">
                  {thread.type === "group"
                    ? language === "th"
                      ? "กลุ่มวิ่ง"
                      : "Group"
                    : language === "th"
                      ? "แชทส่วนตัว"
                      : "Direct"}
                </span>
              </span>

              <span className="friend-thread-chevron" aria-hidden="true">
                ›
              </span>
            </button>
          ))
        ) : (
          <div className="friends-empty">
            <strong>
              {language === "th"
                ? "ไม่พบเพื่อนหรือกลุ่มวิ่ง"
                : "No friends or groups found"}
            </strong>
            <p>
              {language === "th"
                ? "ลองค้นหาด้วยชื่ออื่น"
                : "Try another search term."}
            </p>
          </div>
        )}
      </section>

      <RunnerNav
        language={language}
        active="friends"
        onNav={onNav}
      />
    </main>
  );
}

function FriendChat({
  language,
  thread,
  onBack,
}: {
  language: AppLanguage;
  thread: FriendThread;
  onBack: () => void;
}) {
  const storageKey =
    `runrise-friend-chat-${thread.id}`;

  const [messages, setMessages] =
    useState<FriendChatMessage[]>(() =>
      readStorage<FriendChatMessage[]>(
        storageKey,
        getInitialFriendMessages(thread)
      )
    );

  const [draft, setDraft] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  const sendMessage = () => {
    const text = draft.trim();

    if (!text) return;

    const nextMessage: FriendChatMessage = {
      id: Date.now(),
      from: "me",
      text,
    };

    setMessages((previous) => {
      const nextMessages = [
        ...previous,
        nextMessage,
      ];

      localStorage.setItem(
        storageKey,
        JSON.stringify(nextMessages)
      );

      return nextMessages;
    });

    setDraft("");
  };

  return (
    <main
      className="screen friend-chat-page"
      data-no-translate="true"
    >
      <header className="friend-chat-header">
        <button
          className="friend-chat-back"
          type="button"
          onClick={onBack}
          aria-label={language === "th" ? "ย้อนกลับ" : "Back"}
        >
          ←
        </button>

        <span
          className={`friend-avatar friend-avatar-${thread.accent}`}
          aria-hidden="true"
        >
          {thread.initials}
        </span>

        <div>
          <strong>{thread.name}</strong>
          <small>
            {thread.type === "group"
              ? language === "th"
                ? "กลุ่มวิ่ง"
                : "Running group"
              : language === "th"
                ? "เพื่อนวิ่ง"
                : "Running friend"}
          </small>
        </div>
      </header>

      <section className="friend-chat-messages">
        <div className="friend-chat-date">
          {language === "th" ? "วันนี้" : "Today"}
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.from === "me"
                ? "friend-message-row mine"
                : "friend-message-row"
            }
          >
            <div className="friend-message-bubble">
              {message.text}
            </div>
          </div>
        ))}
      </section>

      <div className="friend-chat-composer">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder={
            language === "th"
              ? "พิมพ์ข้อความ..."
              : "Type a message..."
          }
        />

        <button
          type="button"
          onClick={sendMessage}
          disabled={!draft.trim()}
          aria-label={language === "th" ? "ส่งข้อความ" : "Send"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m4 4 16 8-16 8 3-8-3-8Z" />
            <path d="M7 12h13" />
          </svg>
        </button>
      </div>
    </main>
  );
}

function FriendQr({
  language,
  user,
  profile,
  onBack,
}: {
  language: AppLanguage;
  user: UserAccount | null;
  profile: RunnerProfile;
  onBack: () => void;
}) {
  const displayName =
    profile.name ||
    user?.name ||
    "Runrise Runner";

  const idBase =
    user?.email?.split("@")[0] ||
    displayName.toLowerCase().replace(/\s+/g, ".");

  const runnerId = `@${idBase || "runner"}`;

  const shareUrl =
    `https://primsupitsara.github.io/runrise/?friend=${encodeURIComponent(
      idBase || "runner"
    )}`;

  const qrUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encodeURIComponent(
      shareUrl
    )}`;

  const shareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${displayName} · Runrise`,
          text:
            language === "th"
              ? "เพิ่มฉันเป็นเพื่อนวิ่งบน Runrise"
              : "Add me as a running friend on Runrise",
          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      alert(
        language === "th"
          ? "คัดลอกลิงก์โปรไฟล์แล้ว"
          : "Profile link copied"
      );
    } catch {
      // User cancelled sharing or the browser blocked it.
    }
  };

  return (
    <main
      className="screen friend-qr-page"
      data-no-translate="true"
    >
      <header className="friend-qr-top">
        <button
          type="button"
          className="friend-qr-back"
          onClick={onBack}
        >
          ←
        </button>

        <div>
          <h1>
            {language === "th"
              ? "QR Code ของฉัน"
              : "My QR Code"}
          </h1>
          <p>
            {language === "th"
              ? "ให้เพื่อนสแกนเพื่อเพิ่มคุณเป็นเพื่อนวิ่ง"
              : "Let another runner scan this to add you."}
          </p>
        </div>
      </header>

      <section className="friend-qr-card">
        <div className="friend-qr-avatar">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <h2>{displayName}</h2>
        <p className="friend-qr-id">ID: {runnerId}</p>

        <div className="friend-qr-code-wrap">
          <img
            src={qrUrl}
            alt={`Runrise QR code for ${displayName}`}
          />

          <img
            className="friend-qr-logo"
            src={runriseLogo}
            alt=""
            aria-hidden="true"
          />
        </div>

        <p className="friend-qr-caption">
          {language === "th"
            ? "สแกนเพื่อเชื่อมต่อและออกวิ่งไปด้วยกัน"
            : "Scan to connect and run together."}
        </p>
      </section>

      <div className="friend-qr-actions">
        <button
          type="button"
          className="friend-qr-primary"
          onClick={() => {
            alert(
              language === "th"
                ? "เปิดกล้องเพื่อสแกน QR Code ในเวอร์ชันทดสอบ"
                : "QR scanner opened in prototype mode"
            );
          }}
        >
          <span aria-hidden="true">⌗</span>
          {language === "th"
            ? "สแกน QR Code"
            : "Scan QR Code"}
        </button>

        <button
          type="button"
          className="friend-qr-secondary"
          onClick={shareProfile}
        >
          <span aria-hidden="true">↗</span>
          {language === "th"
            ? "แชร์โปรไฟล์"
            : "Share Profile"}
        </button>
      </div>
    </main>
  );
}

function RunnerProfile({
  profile,
  setProfile,
  language,
  setLanguage,
  events,
  clubs,
  joinedEvents,
  onEvent,
  onViewAll,
  onSwitchRole,
  onReset,
  onNav,
}: {
  profile: RunnerProfile;
  setProfile: (profile: RunnerProfile) => void;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  events: RunEvent[];
  clubs: Club[];
  joinedEvents: number[];
  onEvent: (event: RunEvent) => void;
  onViewAll: () => void;
  onSwitchRole: () => void;
  onReset: () => void;
  onNav: (page: Page) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [calendarWeekOffset, setCalendarWeekOffset] = useState(0);
  const [draft, setDraft] = useState<RunnerProfile>({
    ...profile,
    goal: [...profile.goal],
    vibe: [...profile.vibe],
    location: [...profile.location],
    parks: [...profile.parks],
  });

  useEffect(() => {
    if (!editing) {
      setDraft({
        ...profile,
        goal: [...profile.goal],
        vibe: [...profile.vibe],
        location: [...profile.location],
        parks: [...profile.parks],
      });
    }
  }, [profile, editing]);

  const requestReset = () => {
    if (
      confirm(
        "Reset Runrise for the next tester? This clears your account, preferences, saved clubs and joined runs."
      )
    ) {
      onReset();
    }
  };

  const savePreferences = () => {
    setProfile(draft);
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft({
      ...profile,
      goal: [...profile.goal],
      vibe: [...profile.vibe],
      location: [...profile.location],
      parks: [...profile.parks],
    });
    setEditing(false);
  };

  const parseEventDate = (event: RunEvent) => {
    const [dayText, monthText] = event.date.trim().split(/\s+/);
    const day = Number(dayText) || 1;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = Math.max(0, months.indexOf(monthText));
    return new Date(2026, monthIndex, day);
  };

  const joinedBookings = useMemo(
    () =>
      events
        .filter((event) => joinedEvents.includes(event.id))
        .sort(
          (a, b) =>
            parseEventDate(a).getTime() -
            parseEventDate(b).getTime()
        ),
    [events, joinedEvents]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarAnchor = useMemo(() => {
    if (joinedBookings.length === 0) {
      return today;
    }

    const upcoming = joinedBookings.find(
      (event) => parseEventDate(event).getTime() >= today.getTime()
    );

    return parseEventDate(
      upcoming || joinedBookings[joinedBookings.length - 1]
    );
  }, [joinedBookings]);

  const weekStart = useMemo(() => {
    const date = new Date(calendarAnchor);
    const day = date.getDay();
    const difference = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + difference + calendarWeekOffset * 7);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [calendarAnchor, calendarWeekOffset]);

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);
        return date;
      }),
    [weekStart]
  );

  const eventOnDate = (date: Date) =>
    joinedBookings.some((event) => {
      const eventDate = parseEventDate(event);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });

  const selectedCalendarDay = calendarAnchor.getDate();

  const shortWeekday = (date: Date) => {
    const thai = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    const english = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return language === "th"
      ? thai[date.getDay()]
      : english[date.getDay()];
  };

  const monthName = (date: Date) => {
    const thai = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    const english = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return language === "th"
      ? thai[date.getMonth()]
      : english[date.getMonth()];
  };

  const weekRangeLabel = `${monthName(weekDays[0])} ${weekDays[0].getDate()} – ${monthName(
    weekDays[6]
  )} ${weekDays[6].getDate()}, ${language === "th" ? 2569 : 2026}`;

  const fullEventDateLabel = (event: RunEvent) => {
    const date = parseEventDate(event);

    if (language === "th") {
      const thaiWeekday = [
        "อาทิตย์",
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัสบดี",
        "ศุกร์",
        "เสาร์",
      ][date.getDay()];

      return `${thaiWeekday} ${date.getDate()} ${monthName(date)} 2569`;
    }

    const englishWeekday = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ][date.getDay()];

    return `${englishWeekday}, ${monthName(date)} ${date.getDate()}, 2026`;
  };

  const bookingLocation = (event: RunEvent) =>
    event.meetingPoint || event.location;

  return (
    <main
      className="screen with-nav ut-profile-page runner-profile-reference"
      data-no-translate="true"
    >
      <section className="rp-profile-hero">
        <div className="rp-avatar">
          {(profile.name?.trim()?.[0] || "R").toUpperCase()}
        </div>

        <div className="rp-profile-name">
          <h1>{profile.name || (language === "th" ? "นักวิ่ง Runrise" : "Runrise Runner")}</h1>
          <p>{language === "th" ? "นักวิ่ง" : "Runner"}</p>
        </div>

        <button
          type="button"
          className="rp-edit-profile-button"
          onClick={() => setEditing((current) => !current)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Z" />
            <path d="m13.5 6.5 4 4" />
          </svg>
          <span>
            {editing
              ? language === "th"
                ? "ยกเลิก"
                : "Cancel"
              : language === "th"
                ? "แก้ไขโปรไฟล์"
                : "Edit Profile"}
          </span>
        </button>
      </section>

      {editing ? (
        <section className="ut-edit-preferences rp-edit-card">
          <div className="ut-profile-section-head">
            <p className="eyebrow">
              {language === "th" ? "แก้ไขความต้องการ" : "EDIT PREFERENCES"}
            </p>
            <h2>
              {language === "th" ? "โปรไฟล์การวิ่งของคุณ" : "Your running profile"}
            </h2>
          </div>

          <div className="ut-edit-block">
            <h3>{language === "th" ? "ประสบการณ์การวิ่ง" : "Running experience"}</h3>
            <div className="ut-choice-grid experience-grid compact">
              {RUNNING_EXPERIENCE_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={
                    draft.runningExperience === option
                      ? "ut-choice-card selected"
                      : "ut-choice-card"
                  }
                  onClick={() =>
                    setDraft({
                      ...draft,
                      runningExperience: option,
                      level: experienceToLegacyLevel(option),
                    })
                  }
                >
                  <strong>{profileValueForLanguage(option, language)}</strong>
                  {draft.runningExperience === option && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="ut-edit-block">
            <h3>{language === "th" ? "Pace (นาที/กม.)" : "Pace (min/km)"}</h3>
            <PaceWheelPicker
              value={draft.pace}
              onChange={(pace) => setDraft({ ...draft, pace })}
            />
          </div>

          <div className="ut-edit-block">
            <h3>{language === "th" ? "ระยะที่สนใจ" : "Favorite distance"}</h3>
            <div className="ut-choice-grid preferred-distance-grid compact">
              {PREFERRED_DISTANCE_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={
                    draft.preferredDistance === option
                      ? "ut-choice-card selected"
                      : "ut-choice-card"
                  }
                  onClick={() =>
                    setDraft({
                      ...draft,
                      preferredDistance: option,
                      distance: preferredDistanceToLegacyRange(option),
                    })
                  }
                >
                  <strong>{profileValueForLanguage(option, language)}</strong>
                  {draft.preferredDistance === option && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="ut-edit-block">
            <h3>{language === "th" ? "จังหวัด" : "Province"}</h3>
            <div className="ut-choice-grid province-grid compact">
              {PROVINCES.map((province) => (
                <button
                  type="button"
                  key={province}
                  className={
                    draft.province === province
                      ? "ut-choice-card selected"
                      : "ut-choice-card"
                  }
                  onClick={() =>
                    setDraft({
                      ...draft,
                      province,
                      location: [],
                      parks: [],
                    })
                  }
                >
                  <strong>{profileValueForLanguage(province, language)}</strong>
                  {draft.province === province && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="ut-edit-block">
            <h3>
              {language === "th"
                ? "เขต / อำเภอ และสวนที่ต้องการ"
                : "District / Amphoe & Preferred Park"}
            </h3>

            <LocationParkSelector
              province={draft.province}
              districtOptions={DISTRICTS_BY_PROVINCE[draft.province] || []}
              selectedDistricts={draft.location}
              selectedParks={draft.parks}
              onChangeProvince={() =>
                setDraft({
                  ...draft,
                  province: "",
                  location: [],
                  parks: [],
                })
              }
              onChange={(location, parks) =>
                setDraft({
                  ...draft,
                  location,
                  parks,
                })
              }
            />
          </div>

          <div className="ut-edit-block">
            <h3>
              {language === "th" ? "ช่วงเวลาที่ต้องการวิ่ง" : "Preferred Running Time"}
            </h3>
            <ChipChoices
              options={RUNNING_TIMES}
              value={draft.time}
              onChange={(time) =>
                setDraft({
                  ...draft,
                  time: time as string,
                })
              }
            />
          </div>

          <div className="ut-edit-block">
            <h3>{language === "th" ? "เป้าหมายการวิ่ง" : "Running Goals"}</h3>
            <ChipChoices
              options={RUNNING_GOALS}
              value={draft.goal}
              multi
              onChange={(goal) =>
                setDraft({
                  ...draft,
                  goal: goal as string[],
                })
              }
            />
          </div>

          <div className="ut-edit-block">
            <h3>{language === "th" ? "สไตล์คอมมูนิตี้" : "Community Style"}</h3>
            <ChipChoices
              options={COMMUNITY_STYLES}
              value={draft.vibe}
              multi
              onChange={(vibe) =>
                setDraft({
                  ...draft,
                  vibe: vibe as string[],
                })
              }
            />
          </div>

          <div className="rp-edit-actions">
            <button
              type="button"
              className="rp-edit-cancel"
              onClick={cancelEdit}
            >
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </button>

            <button
              type="button"
              className="ut-save-preferences"
              disabled={!isRunnerProfileComplete(draft)}
              onClick={savePreferences}
            >
              {language === "th" ? "บันทึกความต้องการ" : "Save Preferences"}
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="rp-card rp-preferences-card">
            <div className="rp-card-heading">
              <div>
                <p className="rp-eyebrow">
                  {language === "th" ? "โปรไฟล์การวิ่ง" : "RUNNING PROFILE"}
                </p>
                <h2>
                  {language === "th" ? "ความต้องการของคุณ" : "Your Preferences"}
                </h2>
              </div>

              <button
                type="button"
                className="rp-inline-edit"
                onClick={() => setEditing(true)}
              >
                {language === "th" ? "แก้ไข" : "Edit"} <span>›</span>
              </button>
            </div>

            <div className="rp-preference-grid">
              <ProfileInfo
                icon="runner"
                label={language === "th" ? "ระดับ" : "Level"}
                value={profileValueForLanguage(
                  profile.runningExperience,
                  language
                )}
              />

              <ProfileInfo
                icon="pace"
                label={language === "th" ? "Pace" : "Pace"}
                value={profilePaceForLanguage(profile.pace, language)}
              />

              <ProfileInfo
                icon="distance"
                label={language === "th" ? "ระยะทาง" : "Distance"}
                value={profileDistanceForLanguage(
                  profile.preferredDistance,
                  language
                )}
              />

              <ProfileInfo
                icon="area"
                label={language === "th" ? "พื้นที่" : "Area"}
                value={[
                  profileValueForLanguage(profile.province, language),
                  ...profile.location.map((item) =>
                    profileValueForLanguage(item, language)
                  ),
                ]
                  .map((item) => String(item || "").trim())
                  .filter((item) => item && item !== "—")
                  .join(", ")}
              />

              <ProfileInfo
                icon="park"
                label={language === "th" ? "สวน" : "Park"}
                value={
                  profile.parks.length > 0
                    ? profile.parks
                        .map((item) =>
                          profileValueForLanguage(item, language)
                        )
                        .map((item) => String(item || "").trim())
                        .filter(Boolean)
                        .join(", ")
                    : "—"
                }
              />

              <ProfileInfo
                icon="time"
                label={language === "th" ? "เวลา" : "Time"}
                value={profileValueForLanguage(profile.time, language)}
              />
            </div>
          </section>

          <section className="rp-card rp-bookings-card">
            <div className="rp-card-heading rp-booking-heading">
              <div>
                <p className="rp-eyebrow">
                  {language === "th" ? "กิจกรรมของฉัน" : "MY ACTIVITIES"}
                </p>
                <h2>{language === "th" ? "การจองของฉัน" : "My Bookings"}</h2>
              </div>

              <button
                type="button"
                className="rp-inline-edit"
                onClick={onViewAll}
              >
                {language === "th" ? "ดูทั้งหมด" : "View All"} <span>›</span>
              </button>
            </div>

            {joinedBookings.length > 0 ? (
              <>
                <div className="rp-calendar-toolbar">
                  <button
                    type="button"
                    className="rp-calendar-arrow"
                    aria-label="Previous week"
                    onClick={() =>
                      setCalendarWeekOffset((current) => current - 1)
                    }
                  >
                    ‹
                  </button>

                  <strong>{weekRangeLabel}</strong>

                  <button
                    type="button"
                    className="rp-calendar-arrow"
                    aria-label="Next week"
                    onClick={() =>
                      setCalendarWeekOffset((current) => current + 1)
                    }
                  >
                    ›
                  </button>
                </div>

                <div className="rp-week-strip">
                  {weekDays.map((date) => {
                    const hasBooking = eventOnDate(date);
                    const active = date.getDate() === selectedCalendarDay;

                    return (
                      <div
                        key={date.toISOString()}
                        className={[
                          "rp-week-day",
                          active ? "active" : "",
                          hasBooking ? "has-booking" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <span>{shortWeekday(date)}</span>
                        <strong>{date.getDate()}</strong>
                        {hasBooking && <i />}
                      </div>
                    );
                  })}
                </div>

                <div className="rp-booking-list">
                  {joinedBookings.map((event) => {
                    const club = clubs.find(
                      (item) => item.id === event.clubId
                    );
                    const clubImage = getClubImage(event.clubId);

                    return (
                      <div className="rp-booking-group" key={event.id}>
                        <h3>{fullEventDateLabel(event)}</h3>

                        <button
                          type="button"
                          className="rp-booking-item"
                          onClick={() => onEvent(event)}
                        >
                          <div className="rp-booking-image">
                            {clubImage ? (
                              <img src={clubImage} alt={club?.name || event.name} />
                            ) : (
                              <span>{club?.name?.[0] || "R"}</span>
                            )}
                          </div>

                          <div className="rp-booking-copy">
                            <span className="rp-booked-pill">
                              {language === "th" ? "จองแล้ว" : "Booked"}
                            </span>

                            <strong>{event.name}</strong>

                            <p>
                              <span aria-hidden="true">◷</span>
                              {event.time}
                              <span className="rp-booking-divider">|</span>
                              <span aria-hidden="true">⌖</span>
                              {profileValueForLanguage(
                                bookingLocation(event),
                                language
                              )}
                            </p>
                          </div>

                          <span className="rp-booking-chevron">›</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="rp-empty-bookings">
                <div className="rp-empty-calendar" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="16" rx="3" />
                    <path d="M7 3v4M17 3v4M3 10h18" />
                  </svg>
                </div>
                <h3>
                  {language === "th"
                    ? "ยังไม่มีการจอง"
                    : "No bookings yet"}
                </h3>
                <p>
                  {language === "th"
                    ? "เมื่อคุณกดเข้าร่วมกิจกรรม รายการจะมาแสดงตรงนี้"
                    : "Events you join will appear here automatically."}
                </p>
                <button
                  type="button"
                  className="rp-find-event-button"
                  onClick={() => onNav("runner-events")}
                >
                  {language === "th" ? "ค้นหาอีเวนต์" : "Find Events"}
                </button>
              </div>
            )}
          </section>

          <section className="rp-card rp-chip-card">
            <div className="rp-card-heading">
              <div>
                <p className="rp-eyebrow">
                  {language === "th" ? "เป้าหมายการวิ่ง" : "RUNNING GOALS"}
                </p>
                <h2>
                  {language === "th" ? "เป้าหมายของคุณ" : "What you’re running for"}
                </h2>
              </div>
            </div>

            <div className="ut-display-chips">
              {profile.goal.length > 0 ? (
                profile.goal.map((goal) => (
                  <span key={goal}>
                    {profileValueForLanguage(goal, language)}
                  </span>
                ))
              ) : (
                <span>{language === "th" ? "ยังไม่ได้เลือก" : "Not selected"}</span>
              )}
            </div>
          </section>

          <section className="rp-card rp-chip-card">
            <div className="rp-card-heading">
              <div>
                <p className="rp-eyebrow">
                  {language === "th" ? "สไตล์คอมมูนิตี้" : "COMMUNITY PREFERENCE"}
                </p>
                <h2>
                  {language === "th" ? "บรรยากาศที่คุณชอบ" : "Your preferred vibe"}
                </h2>
              </div>
            </div>

            <div className="ut-display-chips">
              {profile.vibe.length > 0 ? (
                profile.vibe.map((vibe) => (
                  <span key={vibe}>
                    {profileValueForLanguage(vibe, language)}
                  </span>
                ))
              ) : (
                <span>{language === "th" ? "ยังไม่ได้เลือก" : "Not selected"}</span>
              )}
            </div>
          </section>
        </>
      )}

      {!editing && (
        <>
          <section className="rp-card rp-language-card">
            <div>
              <p className="rp-eyebrow">{language === "th" ? "ภาษา" : "LANGUAGE"}</p>
              <h2>{language === "th" ? "ภาษาของแอป" : "App Language"}</h2>
            </div>

            <LanguageQuickSwitch
              language={language}
              onChange={setLanguage}
              compact
            />
          </section>

          <section className="rp-card rp-settings-card">
            <div className="rp-card-heading">
              <div>
                <p className="rp-eyebrow">
                  {language === "th" ? "บัญชีและการตั้งค่า" : "ACCOUNT & SETTINGS"}
                </p>
                <h2>
                  {language === "th" ? "การตั้งค่า Runrise" : "Runrise settings"}
                </h2>
              </div>
            </div>

            <div className="settings-card rp-settings-list">
              <button className="settings-row" onClick={onSwitchRole}>
                {language === "th" ? "สลับเป็นผู้จัดคลับ" : "Switch to Founder"}
                <span>›</span>
              </button>

              <button className="settings-row reset-row" onClick={requestReset}>
                {language === "th" ? "รีเซ็ตต้นแบบ" : "Reset Prototype"}
                <span>↻</span>
              </button>
            </div>
          </section>
        </>
      )}

      <RunnerNav language={language} active="profile" onNav={onNav} />
    </main>
  );
}
type ProfileInfoIcon = "runner" | "pace" | "distance" | "area" | "park" | "time";

function ProfileInfo({
  icon,
  label,
  value,
}: {
  icon: ProfileInfoIcon;
  label: string;
  value: string;
}) {
  const renderIcon = () => {
    switch (icon) {
      case "runner":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="14.4" cy="4.2" r="2.1" />
            <path d="m12.9 7.1-2.4 3.3-3.5.8M12.9 7.1l3.3 2.2 2.7-.7M11 10.2l2.4 3.4-1.3 5.4M13.4 13.6l3.3 2.2 1.7 3.1M8.7 10.8 6.9 15l-2.8 2" />
          </svg>
        );
      case "pace":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="13" r="7.4" />
            <path d="M12 13V9.4M9.5 2.8h5M12 2.8v2.7M17.4 7.7l1.5-1.5" />
          </svg>
        );
      case "distance":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s6.1-6.5 6.1-12A6.1 6.1 0 0 0 5.9 9C5.9 14.5 12 21 12 21Z" />
            <circle cx="12" cy="9" r="2.1" />
          </svg>
        );
      case "area":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m3.5 5.4 5-2.1 7 2.1 5-2.1v15.3l-5 2.1-7-2.1-5 2.1V5.4Z" />
            <path d="M8.5 3.3v15.3M15.5 5.4v15.3" />
          </svg>
        );
      case "park":
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3.4c-2.2 0-4 1.7-4 3.9 0 .4.1.9.2 1.3-1.5.7-2.5 2.2-2.5 3.9 0 2.2 1.8 4 4 4h.8v4.1h3v-4.1h.8c2.2 0 4-1.8 4-4 0-1.7-1-3.2-2.5-3.9.1-.4.2-.9.2-1.3 0-2.2-1.8-3.9-4-3.9Z" />
          </svg>
        );
      case "time":
      default:
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3.5" y="5.5" width="17" height="15" rx="2.6" />
            <path d="M7.5 3v5M16.5 3v5M3.5 10h17" />
          </svg>
        );
    }
  };

  return (
    <div className="ut-profile-info">
      <span className="rp-preference-icon">{renderIcon()}</span>
      <div className="rp-preference-copy">
        <span className="rp-preference-label">{label}</span>
        <strong>{value || "—"}</strong>
      </div>
    </div>
  );
}

function Notifications({
  notifications,
  setNotifications,
  onBack,
}: any) {
  return (
    <main className="screen">
      <button
        className="circle-button"
        onClick={onBack}
      >
        ←
      </button>

      <Header
        eyebrow="UPDATES"
        title="Notifications"
      />

      <button
        className="link"
        onClick={() =>
          setNotifications(
            notifications.map(
              (
                notification: NotificationItem
              ) => ({
                ...notification,
                read: true,
              })
            )
          )
        }
      >
        Mark all as read
      </button>

      <div className="notification-list">
        {notifications.map(
          (
            notification: NotificationItem
          ) => (
            <article
              key={
                notification.id
              }
              className={
                notification.read
                  ? "notification-item"
                  : "notification-item unread"
              }
            >
              <strong>
                {
                  notification.title
                }
              </strong>

              <p>
                {
                  notification.detail
                }
              </p>
            </article>
          )
        )}
      </div>
    </main>
  );
}

function FounderDashboard({
  language,
  club,
  events,
  members,
  onCreateEvent,
  onEditClub,
  onNav,
}: any) {
  const totalSignups = events.reduce(
    (total: number, event: RunEvent) =>
      total + event.participants,
    0
  );

  return (
    <main className="screen with-nav founder-screen">
      <div className="founder-welcome">
        <div>
          <p className="eyebrow">FOUNDER DASHBOARD</p>
          <h1>Good morning 👋</h1>
          <p className="muted">
            Here's what's happening with your community.
          </p>
        </div>

        <div className="founder-avatar">A</div>
      </div>

      <div className="founder-club-banner">
        <div className={`founder-club-cover cover-${club.id}`} />

        <div className="founder-club-banner-info">
          <small>YOUR RUN CLUB</small>
          <h2>{club.name}</h2>
          <p>
            📍 {club.location} · {club.schedule}
          </p>
        </div>
      </div>

      <div className="founder-dashboard-grid founder-dashboard-grid-premium">
        <FounderMetric
          type="members"
          value={
            club.members > 0
              ? club.members.toLocaleString()
              : "—"
          }
          label="Total Members"
          detail="Growing"
          positive
        />

        <FounderMetric
          type="new"
          value="28"
          label="New Members"
          detail="This month"
          positive
        />

        <FounderMetric
          type="runs"
          value={events.length}
          label="Upcoming Runs"
          detail="Scheduled"
        />

        <FounderMetric
          type="signups"
          value={totalSignups}
          label="Event Sign-ups"
          detail="Total runners"
        />
      </div>

      <section className="founder-section">
        <div className="founder-section-title">
          <div>
            <p className="eyebrow">COMMUNITY GROWTH</p>
            <h2>Growing this month</h2>
          </div>

          <span className="growth-pill">+12%</span>
        </div>

        <div className="growth-chart">
          {[35, 48, 45, 65, 70, 82, 95].map(
            (height, index) => (
              <div
                key={index}
                className={
                  index === 6
                    ? "growth-bar active"
                    : "growth-bar"
                }
                style={{ height: `${height}%` }}
              />
            )
          )}
        </div>

        <div className="growth-labels">
          {["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"].map(
            (month) => (
              <span key={month}>{month}</span>
            )
          )}
        </div>
      </section>

      <section className="founder-section">
        <h2>Quick Actions</h2>

        <div className="founder-actions">
          <button
            className="founder-action primary-action"
            onClick={onCreateEvent}
          >
            <div>＋</div>

            <span>
              <strong>Create Run</strong>
              <small>Add a new event</small>
            </span>
          </button>

          <button
            className="founder-action"
            onClick={onEditClub}
          >
            <div>✎</div>

            <span>
              <strong>Edit Club</strong>
              <small>Update club profile</small>
            </span>
          </button>
        </div>
      </section>

      <section className="founder-section">
        <div className="founder-section-title">
          <h2>Upcoming Runs</h2>

          <button
            className="link"
            onClick={onCreateEvent}
          >
            Manage
          </button>
        </div>

        {events.length === 0 ? (
          <p className="muted">
            No upcoming runs yet.
          </p>
        ) : (
          events.slice(0, 2).map((event: RunEvent) => (
            <div
              className="dashboard-event-card"
              key={event.id}
            >
              <div className="dashboard-event-date">
                <strong>
                  {event.date.split(" ")[0]}
                </strong>

                <span>
                  {event.date.split(" ")[1]}
                </span>
              </div>

              <div className="dashboard-event-info">
                <strong>{event.name}</strong>

                <p>
                  {event.time} · {event.distance}
                </p>

                <small>
                  {event.participants}/{event.capacity} joined
                </small>
              </div>

              <span className="dashboard-event-arrow">
                ›
              </span>
            </div>
          ))
        )}
      </section>

      <section className="founder-section">
        <div className="founder-section-title">
          <h2>Recent Members</h2>

          <button
            className="link"
            onClick={() =>
              onNav("founder-members")
            }
          >
            See all
          </button>
        </div>

        {members.slice(0, 3).map((member: Member) => (
          <div
            className="founder-member-preview"
            key={member.id}
          >
            <div className="member-avatar">
              {member.name[0]}
            </div>

            <div className="grow">
              <strong>{member.name}</strong>

              <p>Joined {member.joined}</p>
            </div>

            <span
              className={`member-badge ${
                member.status === "New"
                  ? "new"
                  : ""
              }`}
            >
              {member.status}
            </span>
          </div>
        ))}
      </section>

      <FounderNav
        language={language}
        active="dashboard"
        onNav={onNav}
      />
    </main>
  );
}

function FounderClub({
  language,
  club,
  setClub,
  onNav,
}: any) {
  const [draft, setDraft] = useState<Club>({
    ...club,
  });

  const [saved, setSaved] = useState(false);

  const [levelOpen, setLevelOpen] = useState(false);

  const levelOptions = [
    "All Levels",
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  const updateField = (
    field: keyof Club,
    value: any
  ) => {
    setDraft({
      ...draft,
      [field]: value,
    });

    setSaved(false);
  };

  const saveChanges = () => {
    setClub(draft);
    setSaved(true);
    setLevelOpen(false);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <main
      className="screen with-nav founder-screen founder-club-page"
      onClick={() => {
        if (levelOpen) {
          setLevelOpen(false);
        }
      }}
    >
      <header className="fcm-header">
        <p className="fcm-eyebrow">
          CLUB MANAGEMENT
        </p>

        <h1>Manage your club</h1>

        <p className="fcm-subtitle">
          Keep your club profile clear and up to date.
        </p>
      </header>

      <section className="fcm-cover-card">
        <img
          src={club6amImage}
          alt={`${draft.name} cover`}
          className="fcm-cover-image"
        />
      </section>

      <section className="fcm-main-card">
        <div className="fcm-text-field">
          <span className="fcm-label">
            CLUB NAME
          </span>

          <input
            className="fcm-input"
            value={draft.name}
            placeholder="Enter your club name"
            onChange={(event) =>
              updateField(
                "name",
                event.target.value
              )
            }
          />
        </div>

        <div className="fcm-text-field">
          <span className="fcm-label">
            DESCRIPTION
          </span>

          <textarea
            className="fcm-textarea"
            rows={4}
            value={draft.description}
            placeholder="Tell runners about your club"
            onChange={(event) =>
              updateField(
                "description",
                event.target.value
              )
            }
          />
        </div>
      </section>

      <div className="fcm-grid">
        <div className="fcm-field">
          <span className="fcm-label">
            LOCATION
          </span>

          <input
            className="fcm-input"
            value={draft.location}
            placeholder="e.g. Lumpini"
            onChange={(event) =>
              updateField(
                "location",
                event.target.value
              )
            }
          />
        </div>

        <div className="fcm-field">
          <span className="fcm-label">
            DISTANCE
          </span>

          <input
            className="fcm-input"
            value={draft.distance}
            placeholder="e.g. 3K"
            onChange={(event) =>
              updateField(
                "distance",
                event.target.value
              )
            }
          />
        </div>

        <div className="fcm-field">
          <span className="fcm-label">
            PACE
          </span>

          <input
            className="fcm-input"
            value={draft.pace}
            placeholder="e.g. 6:00–8:00"
            onChange={(event) =>
              updateField(
                "pace",
                event.target.value
              )
            }
          />
        </div>

        <div
          className={`fcm-field ${levelOpen ? "is-open" : ""}`}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <span className="fcm-label">
            LEVEL
          </span>

          <button
            type="button"
            className={
              levelOpen
                ? "fcm-dropdown-trigger open"
                : "fcm-dropdown-trigger"
            }
            onClick={() =>
              setLevelOpen(!levelOpen)
            }
          >
            <span className="fcm-dropdown-value">
              {draft.level}
            </span>

            <span
              className={
                levelOpen
                  ? "fcm-chevron open"
                  : "fcm-chevron"
              }
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>

          {levelOpen && (
            <div className="fcm-dropdown-menu">
              {levelOptions.map(
                (option) => (
                  <button
                    type="button"
                    key={option}
                    className={
                      draft.level === option
                        ? "fcm-dropdown-option selected"
                        : "fcm-dropdown-option"
                    }
                    onClick={() => {
                      updateField(
                        "level",
                        option
                      );
                      setLevelOpen(false);
                    }}
                  >
                    <span>{option}</span>

                    {draft.level === option && (
                      <span className="fcm-selected-dot" />
                    )}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <div className="fcm-field">
        <span className="fcm-label">
          SCHEDULE
        </span>

        <input
          className="fcm-input"
          value={draft.schedule}
          placeholder="e.g. Sat / Sun · Morning"
          onChange={(event) =>
            updateField(
              "schedule",
              event.target.value
            )
          }
        />
      </div>

      <section className="fcm-community-card">
        <span className="fcm-label">
          COMMUNITY STYLE
        </span>

        <div className="fcm-vibes">
          {[
            "Social",
            "Beginner Friendly",
            "Relaxed",
            "Training Focused",
            "Networking",
          ].map((vibe) => {
            const selected =
              draft.vibe.includes(vibe);

            return (
              <button
                type="button"
                key={vibe}
                className={
                  selected
                    ? "fcm-vibe selected"
                    : "fcm-vibe"
                }
                onClick={(event) => {
                  event.stopPropagation();

                  const nextVibes =
                    selected
                      ? draft.vibe.filter(
                          (item) =>
                            item !== vibe
                        )
                      : [
                          ...draft.vibe,
                          vibe,
                        ];

                  updateField(
                    "vibe",
                    nextVibes
                  );
                }}
              >
                {vibe}
              </button>
            );
          })}
        </div>
      </section>

      <button
        type="button"
        className={
          saved
            ? "fcm-save-button saved"
            : "fcm-save-button"
        }
        onClick={saveChanges}
      >
        {saved
          ? "Changes Saved"
          : "Save Changes"}
      </button>

      <FounderNav
        language={language}
        active="club"
        onNav={onNav}
      />
    </main>
  );
}

function FounderEvents({
  language,
  events,
  setEvents,
  onNav,
}: any) {
  const [creating, setCreating] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [distanceOpen, setDistanceOpen] =
    useState(false);

  const distanceOptions = [
    "3K",
    "5K",
    "8K",
    "10K",
    "15K",
  ];

  const emptyDraft = {
    name: "",
    date: "",
    time: "06:00",
    location: "Pathum Wan",
    distance: "5K",
    pace: "6:00–7:00",
    capacity: 50,
    meetingPoint: "",
    route: "",
    whatToBring:
      "Running shoes and water.",
  };

  const [draft, setDraft] =
    useState(emptyDraft);

  const resetForm = () => {
    setDraft(emptyDraft);
    setCreating(false);
    setEditingId(null);
    setDistanceOpen(false);
  };

  const createEvent = () => {
    if (!draft.name.trim()) {
      alert(
        "Please enter an event name."
      );
      return;
    }

    const newEvent: RunEvent = {
      id: Date.now(),
      clubId: 1,
      name: draft.name,
      date:
        draft.date || "TBA",
      time: draft.time,
      location: draft.location,
      distance: draft.distance,
      pace: draft.pace,
      capacity: Number(
        draft.capacity
      ),
      participants: 0,
      meetingPoint:
        draft.meetingPoint ||
        `${draft.location} Meeting Point`,
      route:
        draft.route ||
        "Route will be announced.",
      whatToBring:
        draft.whatToBring,
    };

    setEvents(
      (previous: RunEvent[]) => [
        ...previous,
        newEvent,
      ]
    );

    resetForm();
  };

  const startEdit = (
    event: RunEvent
  ) => {
    setEditingId(event.id);
    setCreating(false);
    setDistanceOpen(false);

    setDraft({
      name: event.name,
      date: event.date,
      time: event.time,
      location: event.location,
      distance: event.distance,
      pace: event.pace,
      capacity: event.capacity,
      meetingPoint:
        event.meetingPoint,
      route: event.route,
      whatToBring:
        event.whatToBring,
    });
  };

  const saveEdit = () => {
    setEvents(
      (previous: RunEvent[]) =>
        previous.map((event) =>
          event.id === editingId
            ? {
                ...event,
                ...draft,
                capacity: Number(
                  draft.capacity
                ),
              }
            : event
        )
    );

    resetForm();
  };

  const cancelEvent = (
    id: number
  ) => {
    const confirmed = confirm(
      "Cancel this run?"
    );

    if (!confirmed) return;

    setEvents(
      (previous: RunEvent[]) =>
        previous.filter(
          (event) =>
            event.id !== id
        )
    );
  };

  return (
    <main
      className="screen with-nav founder-screen"
      onClick={() => {
        if (distanceOpen) {
          setDistanceOpen(false);
        }
      }}
    >
      <div className="founder-page-top">
        <div>
          <p className="eyebrow">
            EVENT MANAGEMENT
          </p>

          <h1>Your Runs</h1>

          <p className="muted">
            Create and manage upcoming community runs.
          </p>
        </div>

        <button
          className="founder-create-button"
          onClick={() => {
            setCreating(true);
            setEditingId(null);
            setDistanceOpen(false);
            setDraft(emptyDraft);
          }}
        >
          ＋
        </button>
      </div>

      {(creating ||
        editingId !== null) && (
        <div className="event-editor">
          <div className="event-editor-header">
            <div>
              <p className="eyebrow">
                {editingId
                  ? "EDIT RUN"
                  : "NEW RUN"}
              </p>

              <h2>
                {editingId
                  ? "Update Run"
                  : "Create a Run"}
              </h2>
            </div>

            <button
              className="circle-button"
              onClick={resetForm}
            >
              ×
            </button>
          </div>

          <label>
            EVENT NAME

            <input
              placeholder="e.g. Sunday Easy 5K"
              value={draft.name}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  name:
                    e.target.value,
                })
              }
            />
          </label>

          <div className="founder-form-two">
            <label>
              DATE

              <input
                placeholder="25 Oct"
                value={draft.date}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    date:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              TIME

              <input
                type="time"
                value={draft.time}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    time:
                      e.target.value,
                  })
                }
              />
            </label>
          </div>

          <div className="founder-form-two">
            <div
              className={`event-distance-field ${
                distanceOpen ? "is-open" : ""
              }`}
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <span className="event-field-label">
                DISTANCE
              </span>

              <button
                type="button"
                className={
                  distanceOpen
                    ? "event-distance-trigger open"
                    : "event-distance-trigger"
                }
                onClick={() =>
                  setDistanceOpen(
                    !distanceOpen
                  )
                }
              >
                <span>
                  {draft.distance}
                </span>

                <span
                  className={
                    distanceOpen
                      ? "event-distance-chevron open"
                      : "event-distance-chevron"
                  }
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>

              {distanceOpen && (
                <div className="event-distance-menu">
                  {distanceOptions.map(
                    (option) => (
                      <button
                        type="button"
                        key={option}
                        className={
                          draft.distance ===
                          option
                            ? "event-distance-option selected"
                            : "event-distance-option"
                        }
                        onClick={() => {
                          setDraft({
                            ...draft,
                            distance:
                              option,
                          });
                          setDistanceOpen(
                            false
                          );
                        }}
                      >
                        <span>
                          {option}
                        </span>

                        {draft.distance ===
                          option && (
                          <span className="event-selected-dot" />
                        )}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            <label>
              CAPACITY

              <input
                type="number"
                value={
                  draft.capacity
                }
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    capacity:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />
            </label>
          </div>

          <label>
            PACE

            <input
              value={draft.pace}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  pace:
                    e.target.value,
                })
              }
            />
          </label>

          <label>
            LOCATION

            <input
              value={
                draft.location
              }
              onChange={(e) =>
                setDraft({
                  ...draft,
                  location:
                    e.target.value,
                })
              }
            />
          </label>

          <label>
            MEETING POINT

            <input
              placeholder="Where should runners meet?"
              value={
                draft.meetingPoint
              }
              onChange={(e) =>
                setDraft({
                  ...draft,
                  meetingPoint:
                    e.target.value,
                })
              }
            />
          </label>

          <label>
            ROUTE

            <textarea
              rows={3}
              placeholder="Describe the running route"
              value={draft.route}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  route:
                    e.target.value,
                })
              }
            />
          </label>

          <label>
            WHAT TO BRING

            <textarea
              rows={2}
              value={
                draft.whatToBring
              }
              onChange={(e) =>
                setDraft({
                  ...draft,
                  whatToBring:
                    e.target.value,
                })
              }
            />
          </label>

          <button
            className="primary"
            onClick={
              editingId
                ? saveEdit
                : createEvent
            }
          >
            {editingId
              ? "Save Changes"
              : "Publish Run"}
          </button>
        </div>
      )}

      <div className="event-management-list">
        {events.map(
          (event: RunEvent) => {
            const percentage =
              Math.min(
                (event.participants /
                  event.capacity) *
                  100,
                100
              );

            return (
              <article
                className="founder-event-card"
                key={event.id}
              >
                <div className="founder-event-top">
                  <div className="founder-event-date">
                    <strong>
                      {
                        event.date.split(
                          " "
                        )[0]
                      }
                    </strong>

                    <span>
                      {
                        event.date.split(
                          " "
                        )[1]
                      }
                    </span>
                  </div>

                  <div className="grow">
                    <p className="eyebrow">
                      UPCOMING
                    </p>

                    <h3>
                      {event.name}
                    </h3>

                    <p className="muted">
                      {event.time} ·{" "}
                      {event.location}
                    </p>
                  </div>

                  <button
                    className="event-menu-button"
                    onClick={() =>
                      startEdit(event)
                    }
                  >
                    •••
                  </button>
                </div>

                <div className="founder-event-tags">
                  <span>
                    {event.distance}
                  </span>

                  <span>
                    {event.pace}
                  </span>
                </div>

                <div className="capacity-row">
                  <span>
                    {event.participants} of{" "}
                    {event.capacity} joined
                  </span>

                  <strong>
                    {Math.round(
                      percentage
                    )}
                    %
                  </strong>
                </div>

                <div className="capacity-progress">
                  <div
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <div className="founder-event-actions">
                  <button
                    className="secondary"
                    onClick={() =>
                      startEdit(event)
                    }
                  >
                    Edit Run
                  </button>

                  <button
                    className="founder-danger-button"
                    onClick={() =>
                      cancelEvent(
                        event.id
                      )
                    }
                  >
                    Cancel
                  </button>
                </div>
              </article>
            );
          }
        )}
      </div>

      <FounderNav
        language={language}
        active="events"
        onNav={onNav}
      />
    </main>
  );
}

function FounderMembers({
  language,
  members,
  totalMembers,
  newMembers,
  totalRunJoins,
  onNav,
}: any) {
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "All" | "New" | "Active"
  >("All");

  const filteredMembers = members.filter(
    (member: Member) => {
      const matchesSearch =
        member.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        member.status === filter;

      return matchesSearch && matchesFilter;
    }
  );

  return (
    <main className="screen with-nav founder-screen">
      <Header
        eyebrow="MEMBER MANAGEMENT"
        title="Your community"
        subtitle="See who's joining and staying active."
      />

      <div className="member-summary">
        <div>
          <strong>{totalMembers}</strong>
          <span>Total Members</span>
        </div>

        <div>
          <strong>{newMembers}</strong>
          <span>New Members</span>
        </div>

        <div>
          <strong>{totalRunJoins}</strong>
          <span>Run Joins</span>
        </div>
      </div>

      <input
        className="search"
        placeholder="Search member"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="member-filter-tabs">
        {["All", "New", "Active"].map((item) => (
          <button
            key={item}
            className={filter === item ? "active" : ""}
            onClick={() =>
              setFilter(
                item as "All" | "New" | "Active"
              )
            }
          >
            {item}
          </button>
        ))}
      </div>

      <p className="small-label">
        RECENT MEMBER RECORDS
      </p>

      <div className="founder-member-list">
        {filteredMembers.map((member: Member) => (
          <article
            className="founder-member-card"
            key={member.id}
          >
            <div className="member-avatar large">
              {member.name[0]}
            </div>

            <div className="grow">
              <div className="member-name-row">
                <strong>{member.name}</strong>

                <span
                  className={`member-badge ${
                    member.status === "New" ? "new" : ""
                  }`}
                >
                  {member.status}
                </span>
              </div>

              <p>Joined {member.joined}</p>

              <small>
                {member.events} runs joined
              </small>
            </div>
          </article>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Empty
          icon="⌕"
          title="No members found"
          description="Try another name or filter."
        />
      )}

      <FounderNav
        language={language}
        active="members"
        onNav={onNav}
      />
    </main>
  );
}

function FounderProfile({
  founderName,
  club,
  runsHosted,
  newMembers,
  language,
  setLanguage,
  onSwitchRole,
  onReset,
  onNav,
}: any) {
  const [
    notificationsEnabled,
    setNotificationsEnabled,
  ] = useState(true);

  const requestReset = () => {
    if (
      confirm(
        "Reset Runrise for the next tester? This clears your account, preferences, club edits, events, saved clubs and joined runs."
      )
    ) {
      onReset();
    }
  };

  return (
    <main className="screen with-nav founder-screen">
      <div className="founder-profile-header">
        <div className="founder-profile-avatar">
          {founderName?.[0] || "F"}
        </div>

        <h1>{founderName || "Founder"}</h1>

        <p className="muted">
          Founder · {club?.name || "Run Club"}
        </p>
      </div>

      <div className="founder-profile-stats">
        <div>
          <strong>1</strong>
          <span>Run Club</span>
        </div>

        <div>
          <strong>{newMembers}</strong>
          <span>New Members</span>
        </div>

        <div>
          <strong>{runsHosted}</strong>
          <span>Runs Hosted</span>
        </div>
      </div>

      <section className="founder-profile-section">
        <p className="small-label">
          PREFERENCES
        </p>

        <div className="settings-card">
          <div className="settings-row">
            <span>Notifications</span>

            <button
              className={
                notificationsEnabled
                  ? "toggle-switch active"
                  : "toggle-switch"
              }
              onClick={() =>
                setNotificationsEnabled(
                  !notificationsEnabled
                )
              }
              aria-label="Toggle notifications"
            >
              <span />
            </button>
          </div>
        </div>
      </section>

      <section className="founder-profile-section">
        <p className="small-label">
          RUNRISE
        </p>

        <div className="settings-card">
          <button
            className="settings-row"
            onClick={onSwitchRole}
          >
            <span>Switch to Runner</span>
            <span>›</span>
          </button>

          <button
            className="settings-row reset-row"
            onClick={requestReset}
          >
            <span>Reset Prototype</span>
            <span>↻</span>
          </button>
        </div>
      </section>

      <LanguageSettings
        language={language}
        onChange={setLanguage}
      />

      <FounderNav
        language={language}
        active="profile"
        onNav={onNav}
      />
    </main>
  );
}

function FounderMetric({
  type,
  value,
  label,
  detail,
  positive = false,
}: {
  type: "members" | "new" | "runs" | "signups";
  value: string | number;
  label: string;
  detail: string;
  positive?: boolean;
}) {
  const icon = {
    members: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <circle cx="16.5" cy="9" r="2.4" />
        <path d="M3.5 19c.5-4 2.8-6 5.5-6s5 2 5.5 6" />
        <path d="M14 14c2.8-.5 5.2 1.2 5.7 4.5" />
      </svg>
    ),
    new: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.8 14 8l5.2 2-5.2 2-2 5.2-2-5.2-5.2-2L10 8l2-5.2Z" />
      </svg>
    ),
    runs: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5.5" width="16" height="14" rx="2.5" />
        <path d="M8 3.5v4M16 3.5v4M4 9.5h16" />
        <path d="M8 13h2M14 13h2M8 16h2M14 16h2" />
      </svg>
    ),
    signups: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="7.5" r="3" />
        <path d="M3.8 18c.5-3.7 2.4-5.6 5.2-5.6 2.1 0 3.7 1 4.6 2.8" />
        <path d="m15 17 2 2 4-5" />
      </svg>
    ),
  }[type];

  return (
    <div className={`founder-metric founder-metric-${type}`}>
      <div className="founder-metric-icon">
        {icon}
      </div>

      <div className={`founder-metric-art art-${type}`} aria-hidden="true">
        {type === "members" && (
          <>
            <span className="member-node node-1" />
            <span className="member-node node-2" />
            <span className="member-node node-3" />
            <span className="member-node node-4" />
            <span className="member-orbit orbit-1" />
            <span className="member-orbit orbit-2" />
          </>
        )}

        {type === "new" && (
          <div className="mini-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        )}

        {type === "runs" && (
          <>
            <span className="route-line route-a" />
            <span className="route-line route-b" />
            <span className="route-pin" />
          </>
        )}

        {type === "signups" && (
          <>
            <span className="signup-bubble bubble-1" />
            <span className="signup-bubble bubble-2" />
            <span className="signup-bubble bubble-3" />
            <span className="signup-person person-1" />
            <span className="signup-person person-2" />
          </>
        )}
      </div>

      <span className="founder-metric-label">
        {label}
      </span>

      <strong className="founder-metric-value">
        {value}
      </strong>

      <small
        className={
          positive
            ? "founder-metric-detail positive"
            : "founder-metric-detail"
        }
      >
        {positive ? "↑ " : ""}
        {detail}
      </small>
    </div>
  );
}

function Header({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="page-header">
      <p className="eyebrow">
        {eyebrow}
      </p>

      <h1>{title}</h1>

      {subtitle && (
        <p className="muted">
          {subtitle}
        </p>
      )}
    </header>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="stat">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="info-row">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function Empty({
  icon,
  title,
  description,
  action,
  onAction,
}: {
  icon: string;
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="empty">
      <div>{icon}</div>

      <h2>{title}</h2>

      <p className="muted">
        {description}
      </p>

      {action && (
        <button
          className="primary"
          onClick={onAction}
        >
          {action}
        </button>
      )}
    </div>
  );
}

function RunnerNav({
  language,
  active,
  onNav,
}: {
  language: AppLanguage;
  active: string;
  onNav: (page: Page) => void;
}) {
  return (
    <nav
      className="bottom-nav runner-nav"
      data-no-translate="true"
    >
      <NavButton
        label={language === "th" ? "หน้าหลัก" : "Home"}
        icon={<RunnerNavIcon name="home" />}
        active={
          active === "home"
        }
        onClick={() =>
          onNav(
            "runner-home"
          )
        }
      />

      <NavButton
        label={language === "th" ? "อีเวนต์" : "Event"}
        icon={<RunnerNavIcon name="event" />}
        active={
          active === "events"
        }
        onClick={() =>
          onNav("runner-events")
        }
      />

      <NavButton
        label={language === "th" ? "เพื่อนวิ่ง" : "Friends"}
        icon={<RunnerNavIcon name="friends" />}
        active={
          active ===
          "friends"
        }
        onClick={() =>
          onNav("friends")
        }
      />

      <NavButton
        label={language === "th" ? "โปรไฟล์" : "Profile"}
        icon={<RunnerNavIcon name="profile" />}
        active={
          active === "profile"
        }
        onClick={() =>
          onNav(
            "runner-profile"
          )
        }
      />
    </nav>
  );
}

function RunnerNavIcon({
  name,
}: {
  name: "home" | "event" | "friends" | "profile";
}) {
  if (name === "home") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M3.5 10.7 12 3.8l8.5 6.9v9.1a.9.9 0 0 1-.9.9h-5.1v-6.3h-5v6.3H4.4a.9.9 0 0 1-.9-.9v-9.1Z" />
      </svg>
    );
  }

  if (name === "event") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="3.5" y="5.5" width="17" height="15" rx="2.2" />
        <path d="M7.5 3.5v4M16.5 3.5v4M3.5 9.3h17" />
        <path d="M7.5 12.7h.01M12 12.7h.01M16.5 12.7h.01M7.5 16.6h.01M12 16.6h.01" />
      </svg>
    );
  }

  if (name === "friends") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="9" cy="8.2" r="3.2" />
        <path d="M3.8 19.5v-1.1c0-3 2.3-5.2 5.2-5.2s5.2 2.2 5.2 5.2v1.1" />
        <circle cx="17.1" cy="9.3" r="2.4" />
        <path d="M15.2 14.4c.6-.3 1.3-.5 2.1-.5 2.2 0 3.9 1.7 3.9 4v.8" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.2 20.2v-1.3c0-3.6 2.8-6.1 6.8-6.1s6.8 2.5 6.8 6.1v1.3" />
    </svg>
  );
}

function FounderNav({
  language,
  active,
  onNav,
}: {
  language: AppLanguage;
  active: string;
  onNav: (page: Page) => void;
}) {
  return (
    <nav
      className="bottom-nav founder-nav"
      data-no-translate="true"
    >
      <NavButton
        label={language === "th" ? "แดชบอร์ด" : "Dashboard"}
        icon="▦"
        active={
          active ===
          "dashboard"
        }
        onClick={() =>
          onNav(
            "founder-dashboard"
          )
        }
      />

      <NavButton
        label={language === "th" ? "คลับ" : "Club"}
        icon="◉"
        active={
          active === "club"
        }
        onClick={() =>
          onNav(
            "founder-club"
          )
        }
      />

      <NavButton
        label={language === "th" ? "กิจกรรม" : "Events"}
        icon="◇"
        active={
          active === "events"
        }
        onClick={() =>
          onNav(
            "founder-events"
          )
        }
      />

      <NavButton
        label={language === "th" ? "สมาชิก" : "Members"}
        icon="♙"
        active={
          active === "members"
        }
        onClick={() =>
          onNav(
            "founder-members"
          )
        }
      />

      <NavButton
        label={language === "th" ? "โปรไฟล์" : "Profile"}
        icon="○"
        active={
          active === "profile"
        }
        onClick={() =>
          onNav(
            "founder-profile"
          )
        }
      />
    </nav>
  );
}


/* =========================================================
   FOUNDER HELPER
========================================================= */

function NavButton({
  label,
  icon,
  active,
  onClick,
}: any) {
  return (
    <button
      className={
        active
          ? "nav-button active"
          : "nav-button"
      }
      onClick={onClick}
    >
      <span className="nav-icon">
        {icon}
      </span>

      <small>
        {label}
      </small>
    </button>
  );
}

export default App;