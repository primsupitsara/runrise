import { useEffect, useMemo, useRef, useState } from "react";

import club6amImage from "./assets/6am.jpg";
import lumpiniRunningImage from "./assets/Lumpini Running.png";
import bangkokRunnersImage from "./assets/Runner Bangkok.jpg";
import antiRunClubImage from "./assets/Anti Run.png";
import sabaiRunClubImage from "./assets/Sabai.jpg";

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
  | "runner-home"
  | "discover"
  | "club"
  | "compare"
  | "event"
  | "myruns"
  | "runner-profile"
  | "notifications"
  | "founder-dashboard"
  | "founder-club"
  | "founder-events"
  | "founder-members"
  | "founder-profile";

type RunnerProfile = {
  name: string;
  level: string;
  pace: string;
  distance: string;
  location: string[];
  parks: string[];
  time: string;
  goal: string[];
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

const defaultProfile: RunnerProfile = {
  name: "",
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
];


const CLUB_IMAGES: Record<number, string> = {
  1: club6amImage,
  2: lumpiniRunningImage,
  3: bangkokRunnersImage,
  4: antiRunClubImage,
  5: sabaiRunClubImage,
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
  "runrise-clubs",
  "runrise-events",
  "runrise-saved",
  "runrise-joined",
];

const DISTANCE_PREFERENCES = [
  { label: "1–9 km", value: "1-9km" },
  { label: "10–20 km", value: "10-20km" },
  { label: "21–41 km", value: "21-41km" },
  { label: "42 km+", value: "42km+" },
];

const BANGKOK_DISTRICTS = [
  "Khlong Toei",
  "Watthana",
  "Pathum Wan",
  "Bang Rak",
  "Chatuchak",
  "Phra Nakhon",
  "Thon Buri",
  "Sathon",
];

const PARKS_BY_AREA: Record<string, string[]> = {
  "Khlong Toei": [
    "Benjakitti Park",
    "Benchasiri Park",
  ],
  Watthana: [
    "Benchasiri Park (Phrom Phong)",
  ],
  "Pathum Wan": [
    "Lumphini Park",
  ],
  "Bang Rak": [
    "Lumphini Park (Silom side)",
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
};

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

const LEVEL_OPTIONS = [
  {
    value: "Beginner",
    label: "Beginner",
    description: "Just getting started",
  },
  {
    value: "Casual",
    label: "Casual",
    description: "Run for fun",
  },
  {
    value: "Intermediate",
    label: "Intermediate",
    description: "Run regularly",
  },
  {
    value: "Advanced",
    label: "Advanced",
    description: "Train seriously",
  },
];

function normalizeGoal(goal: unknown): string[] {
  const source = Array.isArray(goal)
    ? goal.filter((item): item is string => typeof item === "string")
    : typeof goal === "string" && goal.trim()
      ? [goal]
      : [];

  const rename: Record<string, string> = {
    Health: "Health & Fitness",
    "Community / Social": "Social / Meet People",
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

  return {
    ...defaultProfile,
    ...raw,
    pace: normalizePace(raw.pace),
    distance: normalizeDistancePreference(raw.distance),
    location: normalizeAreas(raw.location),
    parks: normalizeParks((raw as { parks?: unknown }).parks),
    goal: normalizeGoal(raw.goal),
    vibe: normalizeVibe(raw.vibe),
  };
}

function isRunnerProfileComplete(profile: RunnerProfile) {
  return Boolean(
    profile.level.trim() &&
      profile.pace.trim() &&
      profile.distance.trim() &&
      profile.location.length > 0 &&
      profile.parks.length > 0 &&
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

function DistanceChoices({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="ut-choice-grid distance">
      {DISTANCE_PREFERENCES.map((option) => (
        <button
          type="button"
          key={option.value}
          className={
            value === option.value
              ? "ut-choice-card selected"
              : "ut-choice-card"
          }
          onClick={() => onChange(option.value)}
        >
          <strong>{option.label}</strong>
          {value === option.value && <span>✓</span>}
        </button>
      ))}
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


function AreaParkSelector({
  areas,
  parks,
  onChange,
}: {
  areas: string[];
  parks: string[];
  onChange: (areas: string[], parks: string[]) => void;
}) {
  const availableParks = Array.from(
    new Set(
      areas.flatMap((area) => PARKS_BY_AREA[area] || [])
    )
  );

  const toggleArea = (area: string) => {
    const nextAreas = areas.includes(area)
      ? areas.filter((item) => item !== area)
      : [...areas, area];

    const nextAvailableParks = new Set(
      nextAreas.flatMap((item) => PARKS_BY_AREA[item] || [])
    );

    const nextParks = parks.filter((park) =>
      nextAvailableParks.has(park)
    );

    onChange(nextAreas, nextParks);
  };

  const togglePark = (park: string) => {
    const nextParks = parks.includes(park)
      ? parks.filter((item) => item !== park)
      : [...parks, park];

    onChange(areas, nextParks);
  };

  return (
    <div className="ut-area-park-selector">
      <section className="ut-area-park-group">
        <div className="ut-subcategory-heading">
          <div>
            <span>AREA</span>
            <strong>Choose your running areas</strong>
          </div>

          <small>
            {areas.length > 0
              ? `${areas.length} selected`
              : "Select one or more"}
          </small>
        </div>

        <div className="ut-choice-grid area-park">
          {BANGKOK_DISTRICTS.map((area) => {
            const selected = areas.includes(area);

            return (
              <button
                type="button"
                key={area}
                className={
                  selected
                    ? "ut-choice-card area-park-choice selected"
                    : "ut-choice-card area-park-choice"
                }
                onClick={() => toggleArea(area)}
              >
                <strong>{area}</strong>
                {selected && <span>✓</span>}
              </button>
            );
          })}
        </div>
      </section>

      <section className="ut-area-park-group park-group">
        <div className="ut-subcategory-heading">
          <div>
            <span>PARK</span>
            <strong>Choose your preferred parks</strong>
          </div>

          <small>
            {parks.length > 0
              ? `${parks.length} selected`
              : "Select one or more"}
          </small>
        </div>

        {areas.length === 0 ? (
          <div className="ut-park-empty">
            Select at least one Area first to see park choices.
          </div>
        ) : (
          <div className="ut-choice-grid area-park park-choices">
            {availableParks.map((park) => {
              const selected = parks.includes(park);

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
  "Running experience": "ระดับประสบการณ์",
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

function LanguageSettings({
  language,
  onChange,
}: {
  language: AppLanguage;
  onChange: (language: AppLanguage) => void;
}) {
  const styles = {
    section: {
      margin: "28px 0 32px",
    } as React.CSSProperties,

    eyebrow: {
      margin: "0 0 10px",
      color: "#f56632",
      fontSize: "12px",
      fontWeight: 800,
      letterSpacing: "0.18em",
      lineHeight: 1.2,
    } as React.CSSProperties,

    title: {
      margin: 0,
      color: "#19191b",
      fontSize: "25px",
      fontWeight: 800,
      lineHeight: 1.15,
      letterSpacing: "-0.03em",
    } as React.CSSProperties,

    description: {
      margin: "10px 0 20px",
      color: "#929298",
      fontSize: "15px",
      fontWeight: 500,
      lineHeight: 1.45,
    } as React.CSSProperties,

    container: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
      width: "100%",
      padding: "6px",
      borderRadius: "22px",
      background: "#eeeeF2",
      boxSizing: "border-box",
    } as React.CSSProperties,

    button: {
      minWidth: 0,
      minHeight: "64px",

      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",

      padding: "10px 13px",

      border: "1.5px solid transparent",
      borderRadius: "17px",

      background: "transparent",
      color: "#86868d",

      fontFamily: "inherit",
      cursor: "pointer",

      boxSizing: "border-box",
    } as React.CSSProperties,

    activeButton: {
      background: "#ffffff",
      color: "#f56632",
      border: "1.5px solid #ffc8b3",
      boxShadow: "0 6px 18px rgba(245, 102, 50, 0.10)",
    } as React.CSSProperties,

    left: {
      display: "flex",
      alignItems: "center",
      gap: "9px",
      minWidth: 0,
    } as React.CSSProperties,

    code: {
      width: "36px",
      height: "36px",
      flexShrink: 0,

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      borderRadius: "12px",

      background: "#e2e2e7",
      color: "#77777e",

      fontSize: "11px",
      fontWeight: 800,
      letterSpacing: "0.04em",
    } as React.CSSProperties,

    activeCode: {
      background: "#ffe7dc",
      color: "#f56632",
    } as React.CSSProperties,

    languageName: {
      fontSize: "14px",
      fontWeight: 800,
      lineHeight: 1,
      whiteSpace: "nowrap",
    } as React.CSSProperties,

    check: {
      width: "23px",
      height: "23px",
      flexShrink: 0,

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      borderRadius: "50%",

      background: "#f56632",
      color: "#ffffff",

      fontSize: "12px",
      fontWeight: 900,
    } as React.CSSProperties,
  };

  return (
    <section style={styles.section}>
      <p style={styles.eyebrow}>LANGUAGE</p>

      <h2 style={styles.title}>App Language</h2>

      <p style={styles.description}>
        Choose the language used throughout Runrise.
      </p>

      <div
        style={styles.container}
        role="group"
        aria-label="App language"
        data-no-translate="true"
      >
        {/* ENGLISH */}
        <button
          type="button"
          onClick={() => onChange("en")}
          aria-pressed={language === "en"}
          style={{
            ...styles.button,
            ...(language === "en" ? styles.activeButton : {}),
          }}
        >
          <span style={styles.left}>
            <span
              style={{
                ...styles.code,
                ...(language === "en" ? styles.activeCode : {}),
              }}
            >
              EN
            </span>

            <span style={styles.languageName}>
              English
            </span>
          </span>

          {language === "en" && (
            <span style={styles.check}>
              ✓
            </span>
          )}
        </button>

        {/* THAI */}
        <button
          type="button"
          onClick={() => onChange("th")}
          aria-pressed={language === "th"}
          style={{
            ...styles.button,
            ...(language === "th" ? styles.activeButton : {}),
          }}
        >
          <span style={styles.left}>
            <span
              style={{
                ...styles.code,
                ...(language === "th" ? styles.activeCode : {}),
              }}
            >
              TH
            </span>

            <span style={styles.languageName}>
              ไทย
            </span>
          </span>

          {language === "th" && (
            <span style={styles.check}>
              ✓
            </span>
          )}
        </button>
      </div>
    </section>
  );
}

function App() {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem(RUNRISE_LANGUAGE_KEY);
    return saved === "th" ? "th" : "en";
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

  const [clubs, setClubs] = useState<Club[]>(() =>
    readStorage<Club[]>("runrise-clubs", initialClubs).map((club) => ({
      ...club,
      location: normalizeDistrict(club.location),
    }))
  );

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
  const [selectedEventId, setSelectedEventId] = useState(101);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [vibeFilter, setVibeFilter] = useState("All");

  const [distanceFilter, setDistanceFilter] = useState(
    profile.distance || "All"
  );

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
    if (profile.distance) {
      setDistanceFilter(profile.distance);
    }
  }, [profile.distance]);

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

  const filteredClubs = useMemo(() => {
    return matchedClubs.filter((club) => {
      const textMatch =
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        club.location.toLowerCase().includes(search.toLowerCase());

      const locationMatch =
        locationFilter === "All" ||
        club.location === locationFilter;

      const vibeMatch =
        vibeFilter === "All" ||
        club.vibe.some((vibe) =>
          vibe.toLowerCase().includes(vibeFilter.toLowerCase())
        );

      return textMatch && locationMatch && vibeMatch;
    });
  }, [
    matchedClubs,
    search,
    locationFilter,
    vibeFilter,
  ]);

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

    setPage("myruns");
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

    setPage("founder-dashboard");
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
    setSearch("");
    setLocationFilter("All");
    setVibeFilter("All");
    setDistanceFilter("All");
    setPage("welcome");
  };

  const registerUser = (account: UserAccount) => {
    setUser(account);
    setProfile({
      ...defaultProfile,
      name: account.name,
    });
    setDistanceFilter("All");
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
  }, [language]);


  return (
    <div className="app-shell">
      <div className="phone">
        {page === "welcome" && (
          <Welcome
            onStart={() => setPage("login")}
            onRegister={() => setPage("register")}
          />
        )}

        {page === "login" && (
          <Login
            storedUser={user}
            onLogin={loginUser}
            onRegister={() => setPage("register")}
            onBack={() => setPage("welcome")}
          />
        )}

        {page === "register" && (
          <Register
            onRegister={registerUser}
            onLogin={() => setPage("login")}
            onBack={() => setPage("welcome")}
          />
        )}

        {page === "role" && (
          <RoleSelect
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
              setPage("founder-dashboard");
            }}
          />
        )}

        {page === "runner-onboarding" && (
          <RunnerOnboarding
            profile={profile}
            setProfile={setProfile}
            onBack={() => setPage("role")}
            onFinish={() => {
              setDistanceFilter(profile.distance || "All");
              setPage("runner-home");
            }}
          />
        )}

        {page === "runner-home" && (
          <RunnerHome
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
              setPage("club");
            }}
            onDiscover={() => setPage("discover")}
            onNotifications={() => setPage("notifications")}
            onNav={setPage}
          />
        )}

        {page === "discover" && (
          <Discover
            clubs={filteredClubs}
            profile={profile}
            search={search}
            setSearch={setSearch}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            vibeFilter={vibeFilter}
            setVibeFilter={setVibeFilter}
            distanceFilter={distanceFilter}
            setDistanceFilter={setDistanceFilter}
            calculateMatch={calculateMatch}
            compareClubs={compareClubs}
            onCompare={toggleCompare}
            onOpen={(id: number) => {
              setSelectedClubId(id);
              setPage("club");
            }}
            onComparePage={() => setPage("compare")}
            onNav={setPage}
          />
        )}

        {page === "club" && (
          <ClubDetail
            club={selectedClub}
            score={calculateMatch(selectedClub)}
            saved={savedClubs.includes(selectedClub.id)}
            compared={compareClubs.includes(selectedClub.id)}
            events={events.filter(
              (event) => event.clubId === selectedClub.id
            )}
            onBack={() => setPage("discover")}
            onSave={() => toggleSave(selectedClub.id)}
            onCompare={() => toggleCompare(selectedClub.id)}
            onEvent={(id: number) => {
              setSelectedEventId(id);
              setPage("event");
            }}
          />
        )}

        {page === "compare" && (
          <Compare
            clubs={clubs.filter((club) =>
              compareClubs.includes(club.id)
            )}
            profile={profile}
            calculateMatch={calculateMatch}
            onBack={() => setPage("discover")}
          />
        )}

        {page === "event" && selectedEvent && (
          <EventDetail
            event={selectedEvent}
            club={
              clubs.find(
                (club) => club.id === selectedEvent.clubId
              ) || selectedClub
            }
            joined={joinedEvents.includes(selectedEvent.id)}
            onBack={() => setPage("club")}
            onJoin={() => joinEvent(selectedEvent.id)}
            onCancel={() => cancelJoinedEvent(selectedEvent.id)}
          />
        )}

        {page === "myruns" && (
          <MyRuns
            events={events.filter((event) =>
              joinedEvents.includes(event.id)
            )}
            clubs={clubs}
            savedClubs={clubs.filter((club) =>
              savedClubs.includes(club.id)
            )}
            onDiscover={() => setPage("discover")}
            onCancel={cancelJoinedEvent}
            onEvent={(event: RunEvent) => {
              setSelectedEventId(event.id);
              setSelectedClubId(event.clubId);
              setPage("event");
            }}
            onClub={(id: number) => {
              setSelectedClubId(id);
              setPage("club");
            }}
            onNav={setPage}
          />
        )}

        {page === "runner-profile" && (
          <RunnerProfile
            profile={profile}
            setProfile={setProfile}
            language={language}
            setLanguage={setLanguage}
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
            events={events.filter(
              (event) => event.clubId === 1
            )}
            setEvents={setEvents}
            onNav={setPage}
          />
        )}

        {page === "founder-members" && (
          <FounderMembers
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
  onStart,
  onRegister,
}: {
  onStart: () => void;
  onRegister: () => void;
}) {
  return (
    <main className="screen welcome">
      <div className="brand-symbol">R</div>

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
  storedUser,
  onLogin,
  onRegister,
  onBack,
}: {
  storedUser: UserAccount | null;
  onLogin: (account: UserAccount) => void;
  onRegister: () => void;
  onBack: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const canSubmit =
    email.trim() !== "" &&
    password.trim() !== "";

  const submit = () => {
    setError("");

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
      <button
        type="button"
        className="auth-back"
        onClick={onBack}
      >
        ← Back
      </button>

      <div className="auth-brand-mark">R</div>

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
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
          />
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
  onRegister,
  onLogin,
  onBack,
}: {
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

  const canSubmit =
    !errors.name &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword &&
    !errors.agreed;

  const submit = () => {
    setSubmitted(true);

    if (!canSubmit) return;

    onRegister({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  };

  return (
    <main className="screen auth-screen auth-register-screen">
      <button
        type="button"
        className="auth-back"
        onClick={onBack}
      >
        ← Back
      </button>

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
            onChange={(event) => setEmail(event.target.value)}
          />
          {submitted && errors.email && (
            <small className="auth-inline-error">{errors.email}</small>
          )}
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {submitted && errors.password && (
            <small className="auth-inline-error">{errors.password}</small>
          )}
        </label>

        <label className="auth-field">
          <span>Confirm Password</span>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          {submitted && errors.confirmPassword && (
            <small className="auth-inline-error">
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
  onRunner,
  onFounder,
  onBack,
}: {
  onRunner: () => void;
  onFounder: () => void;
  onBack: () => void;
}) {
  return (
    <main className="screen role-screen">
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
  profile,
  setProfile,
  onBack,
  onFinish,
}: {
  profile: RunnerProfile;
  setProfile: (profile: RunnerProfile) => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  const [step, setStep] = useState(0);

  const questions = [
    { title: "Running Level", subtitle: "Where are you in your running journey?" },
    { title: "Usual Pace", subtitle: "What’s your average running pace?" },
    { title: "Preferred Distance", subtitle: "How far do you usually run?" },
    { title: "Preferred Area", subtitle: "Which area do you prefer to run in?" },
    { title: "Running Time", subtitle: "When do you normally prefer to run?" },
    { title: "Running Goal", subtitle: "What are you hoping to get from running?" },
    { title: "Community Style", subtitle: "What kind of running community feels right for you?" },
  ];

  const currentComplete = [
    Boolean(profile.level),
    Boolean(profile.pace),
    Boolean(profile.distance),
    profile.location.length > 0 && profile.parks.length > 0,
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

  const goBack = () => {
    if (step === 0) {
      onBack();
      return;
    }
    setStep((previous) => previous - 1);
  };

  const goNext = () => {
    if (!currentComplete) return;

    if (step === questions.length - 1) {
      onFinish();
      return;
    }

    setStep((previous) => previous + 1);
  };

  return (
    <main className="ut-onboarding">
      <div className="ut-onboarding-scroll">
        <div className="ut-onboarding-top">
          <button type="button" className="ut-back" onClick={goBack}>
            ← Back
          </button>
          <span className="ut-step-counter">
            {step + 1} / {questions.length}
          </span>
        </div>

        <div className="ut-progress">
          <div
            className="ut-progress-fill"
            style={{
              width: `${((step + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <section className="ut-question-card">
          <p className="ut-question-number">
            {String(step + 1).padStart(2, "0")}
          </p>

          <h1>{questions[step].title}</h1>
          <p>{questions[step].subtitle}</p>

          <div className="ut-answer-area">
            {step === 0 && (
              <div className="ut-level-grid">
                {LEVEL_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={
                      profile.level === option.value
                        ? "ut-level-card selected"
                        : "ut-level-card"
                    }
                    onClick={() =>
                      updateProfile("level", option.value)
                    }
                  >
                    <div>
                      <strong>{option.label}</strong>
                      <span>{option.description}</span>
                    </div>
                    {profile.level === option.value && <b>✓</b>}
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
                <p className="ut-helper">
                  Swipe minutes and seconds separately. Selected pace:{" "}
                  <strong>{profile.pace} / km</strong>
                </p>
              </>
            )}

            {step === 2 && (
              <DistanceChoices
                value={profile.distance}
                onChange={(value) =>
                  updateProfile("distance", value)
                }
              />
            )}

            {step === 3 && (
              <AreaParkSelector
                areas={profile.location}
                parks={profile.parks}
                onChange={(location, parks) =>
                  setProfile({
                    ...profile,
                    location,
                    parks,
                  })
                }
              />
            )}

            {step === 4 && (
              <ChipChoices
                options={RUNNING_TIMES}
                value={profile.time}
                onChange={(value) =>
                  updateProfile("time", value as string)
                }
              />
            )}

            {step === 5 && (
              <>
                <ChipChoices
                  options={RUNNING_GOALS}
                  value={profile.goal}
                  multi
                  onChange={(value) =>
                    updateProfile("goal", value as string[])
                  }
                />
                <p className="ut-helper">
                  You can choose more than one goal.
                </p>
              </>
            )}

            {step === 6 && (
              <>
                <ChipChoices
                  options={COMMUNITY_STYLES}
                  value={profile.vibe}
                  multi
                  onChange={(value) =>
                    updateProfile("vibe", value as string[])
                  }
                />

                <p className="ut-helper">
                  Choose all styles that feel right for you.
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
          {step === questions.length - 1
            ? "Complete Your Profile"
            : "Continue"}
        </button>
      </div>
    </main>
  );
}

function RunnerHome({
  profile,
  clubs,
  calculateMatch,
  unread,
  onClub,
  onDiscover,
  onNotifications,
  onNav,
}: any) {
  return (
    <main className="screen with-nav">
      <div className="ut-home-header">
        <div className="ut-home-brand-row">
          <p className="eyebrow">RUNRISE</p>

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

        <h1 className="ut-home-greeting">
          Good morning, <strong>{profile.name || "Runner"}</strong>{" "}
          <span className="ut-wave">👋</span>
        </h1>

        <p className="ut-home-subtitle">
          Ready to find your next run?
        </p>
      </div>

      <div className="section-row">
        <div>
          <p className="eyebrow">SMART MATCHING</p>
          <h2>Recommended for you</h2>
        </div>

        <button className="link" onClick={onDiscover}>
          See all
        </button>
      </div>

      <div className="cards">
        {clubs.map((club: Club) => (
          <ClubCard
            key={club.id}
            club={club}
            score={calculateMatch(club)}
            onOpen={() => onClub(club.id)}
          />
        ))}
      </div>

      <RunnerNav active="home" onNav={onNav} />
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

function Discover({
  clubs,
  profile,
  search,
  setSearch,
  locationFilter,
  setLocationFilter,
  vibeFilter,
  setVibeFilter,
  distanceFilter,
  setDistanceFilter,
  calculateMatch,
  compareClubs,
  onCompare,
  onOpen,
  onComparePage,
  onNav,
}: any) {
  const locations = [
    "All",
    ...BANGKOK_DISTRICTS,
  ];

  const distances = [
    "All",
    ...DISTANCE_PREFERENCES.map((item) => item.value),
  ];

  const vibes = [
    "All",
    "Social",
    "Beginner Friendly",
    "Relaxed",
    "Networking",
  ];

  return (
    <main className="screen with-nav">
      <Header
        eyebrow="DISCOVER"
        title="Find your community"
        subtitle="Explore all clubs, ranked by how well they fit you."
      />

      {profile.distance && (
        <div className="personalized-filter">
          <div>
            <small>
              YOUR USUAL DISTANCE
            </small>

            <strong>
              {profile.distance}
            </strong>
          </div>

          <span>
            Used for Smart Matching,
            not to hide other clubs.
          </span>
        </div>
      )}

      <input
        className="search"
        placeholder="Search club or location"
        value={search}
        onChange={(event) =>
          setSearch(
            event.target.value
          )
        }
      />

      <p className="small-label">
        DISTANCE PREFERENCE
      </p>

      <div className="chips">
        {distances.map(
          (distance) => (
            <button
              key={distance}
              className={
                distanceFilter ===
                distance
                  ? "chip active"
                  : "chip"
              }
              onClick={() =>
                setDistanceFilter(
                  distance
                )
              }
            >
              {distance === "All"
                ? "All"
                : DISTANCE_PREFERENCES.find(
                    (item) => item.value === distance
                  )?.label || distance}
            </button>
          )
        )}
      </div>

      <p className="small-label">
        LOCATION
      </p>

      <div className="chips">
        {locations.map(
          (location) => (
            <button
              key={location}
              className={
                locationFilter ===
                location
                  ? "chip active"
                  : "chip"
              }
              onClick={() =>
                setLocationFilter(
                  location
                )
              }
            >
              {location}
            </button>
          )
        )}
      </div>

      <p className="small-label">
        COMMUNITY STYLE
      </p>

      <div className="chips">
        {vibes.map((vibe) => (
          <button
            key={vibe}
            className={
              vibeFilter === vibe
                ? "chip active"
                : "chip"
            }
            onClick={() =>
              setVibeFilter(vibe)
            }
          >
            {vibe}
          </button>
        ))}
      </div>

      {compareClubs.length >=
        2 && (
        <button
          className="compare-banner"
          onClick={
            onComparePage
          }
        >
          <span>
            Compare{" "}
            {compareClubs.length}{" "}
            Run Clubs
          </span>

          <strong>→</strong>
        </button>
      )}

      <p className="muted result-text">
        {clubs.length} communities
        found
      </p>

      <div className="cards">
        {clubs.map(
          (club: Club) => (
            <div key={club.id}>
              <ClubCard
                club={club}
                score={calculateMatch(
                  club
                )}
                onOpen={() =>
                  onOpen(club.id)
                }
              />

              <button
                className={`compare-toggle ${
                  compareClubs.includes(
                    club.id
                  )
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  onCompare(club.id)
                }
              >
                {compareClubs.includes(
                  club.id
                )
                  ? "✓ Selected for comparison"
                  : "+ Compare Club"}
              </button>
            </div>
          )
        )}
      </div>

      <RunnerNav
        active="discover"
        onNav={onNav}
      />
    </main>
  );
}

function ClubDetail({
  club,
  score,
  saved,
  compared,
  events,
  onBack,
  onSave,
  onCompare,
  onEvent,
}: any) {
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

      <section className="compare-section">
        <div>
          <p className="compare-label">
            NOT SURE YET?
          </p>

          <h3>
            Compare with another club
          </h3>

          <p>
            See pace, distance, schedule and community side by side.
          </p>
        </div>

        <button
          className={
            compared
              ? "compare-profile-button active"
              : "compare-profile-button"
          }
          onClick={onCompare}
        >
          {compared
            ? "✓ Added to Compare"
            : "⇆ Compare Club"}
        </button>
      </section>
    </main>
  );
}

function Compare({
  clubs,
  profile,
  calculateMatch,
  onBack,
}: {
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
          title="Choose at least 2 clubs"
          description="Select clubs from Discover to compare them."
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
  event,
  club,
  joined,
  onBack,
  onJoin,
  onCancel,
}: any) {
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
    </main>
  );
}

function MyRuns({
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
        active="myruns"
        onNav={onNav}
      />
    </main>
  );
}

function RunnerProfile({
  profile,
  setProfile,
  language,
  setLanguage,
  onSwitchRole,
  onReset,
  onNav,
}: any) {
  const [editing, setEditing] = useState(false);
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
    });
    setEditing(false);
  };

  return (
    <main className="screen with-nav ut-profile-page">
      <section className="ut-profile-header">
        <div className="profile-avatar">
          {profile.name?.[0] || "R"}
        </div>

        <div className="ut-profile-identity">
          <h1>{profile.name || "Runner"}</h1>
          <p>Runner</p>
        </div>

        <button
          className="ut-edit-profile"
          onClick={() => {
            if (editing) {
              cancelEdit();
            } else {
              setDraft({
                ...profile,
                goal: [...profile.goal],
                vibe: [...profile.vibe],
              });
              setEditing(true);
            }
          }}
        >
          {editing ? "Cancel" : "Edit Preferences"}
        </button>
      </section>

      {editing ? (
        <section className="ut-edit-preferences">
          <div className="ut-profile-section-head">
            <p className="eyebrow">EDIT PREFERENCES</p>
            <h2>Your running profile</h2>
          </div>

          <div className="ut-edit-block">
            <h3>Running Level</h3>
            <div className="ut-level-grid compact">
              {LEVEL_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={
                    draft.level === option.value
                      ? "ut-level-card selected"
                      : "ut-level-card"
                  }
                  onClick={() =>
                    setDraft({ ...draft, level: option.value })
                  }
                >
                  <div>
                    <strong>{option.label}</strong>
                    <span>{option.description}</span>
                  </div>
                  {draft.level === option.value && <b>✓</b>}
                </button>
              ))}
            </div>
          </div>

          <div className="ut-edit-block">
            <h3>Usual Pace</h3>
            <PaceWheelPicker
              value={draft.pace}
              onChange={(pace) => setDraft({ ...draft, pace })}
            />
          </div>

          <div className="ut-edit-block">
            <h3>Preferred Distance</h3>
            <DistanceChoices
              value={draft.distance}
              onChange={(distance) =>
                setDraft({ ...draft, distance })
              }
            />
          </div>

          <div className="ut-edit-block">
            <h3>Preferred Area & Park</h3>

            <AreaParkSelector
              areas={draft.location}
              parks={draft.parks}
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
            <h3>Preferred Running Time</h3>
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
            <h3>Running Goals</h3>
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
            <h3>Community Style</h3>
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

          <button
            type="button"
            className="ut-save-preferences"
            disabled={!isRunnerProfileComplete(draft)}
            onClick={savePreferences}
          >
            Save Preferences
          </button>
        </section>
      ) : (
        <>
          <section className="ut-profile-section">
            <div className="ut-profile-section-head">
              <p className="eyebrow">RUNNING PROFILE</p>
              <h2>Your preferences</h2>
            </div>

            <div className="ut-profile-row-grid">
              <ProfileInfo label="Running Level" value={profile.level || "—"} />
              <ProfileInfo label="Usual Pace" value={`${profile.pace} / km`} />
              <ProfileInfo
                label="Preferred Distance"
                value={
                  DISTANCE_PREFERENCES.find(
                    (item) => item.value === profile.distance
                  )?.label || profile.distance || "—"
                }
              />
              <ProfileInfo
                label="Preferred Area"
                value={
                  profile.location.length > 0
                    ? profile.location.join(", ")
                    : "—"
                }
              />

              <ProfileInfo
                label="Preferred Park"
                value={
                  profile.parks.length > 0
                    ? profile.parks.join(", ")
                    : "—"
                }
              />

              <ProfileInfo
                label="Preferred Running Time"
                value={profile.time || "—"}
              />
            </div>
          </section>

          <section className="ut-profile-section">
            <div className="ut-profile-section-head">
              <p className="eyebrow">RUNNING GOALS</p>
              <h2>What you’re running for</h2>
            </div>

            <div className="ut-display-chips">
              {profile.goal.map((goal: string) => (
                <span key={goal}>{goal}</span>
              ))}
            </div>
          </section>

          <section className="ut-profile-section">
            <div className="ut-profile-section-head">
              <p className="eyebrow">COMMUNITY PREFERENCE</p>
              <h2>Your preferred vibe</h2>
            </div>

            <div className="ut-display-chips">
              {profile.vibe.length > 0 ? (
                profile.vibe.map((vibe: string) => (
                  <span key={vibe}>{vibe}</span>
                ))
              ) : (
                <span>Not selected</span>
              )}
            </div>
          </section>
        </>
      )}

      <LanguageSettings
        language={language}
        onChange={setLanguage}
      />

      <section className="ut-profile-section">
        <div className="ut-profile-section-head">
          <p className="eyebrow">ACCOUNT & SETTINGS</p>
          <h2>Runrise settings</h2>
        </div>

        <div className="settings-card">
          <button className="settings-row" onClick={onSwitchRole}>
            Switch to Founder
            <span>›</span>
          </button>

          <button className="settings-row reset-row" onClick={requestReset}>
            Reset Prototype
            <span>↻</span>
          </button>
        </div>
      </section>

      <RunnerNav active="profile" onNav={onNav} />
    </main>
  );
}

function ProfileInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="ut-profile-info">
      <span>{label}</span>
      <strong>{value}</strong>
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
        active="dashboard"
        onNav={onNav}
      />
    </main>
  );
}

function FounderClub({
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
        active="club"
        onNav={onNav}
      />
    </main>
  );
}

function FounderEvents({
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
        active="events"
        onNav={onNav}
      />
    </main>
  );
}

function FounderMembers({
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
  active,
  onNav,
}: any) {
  return (
    <nav className="bottom-nav">
      <NavButton
        label="Home"
        icon="⌂"
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
        label="Discover"
        icon="⌕"
        active={
          active ===
          "discover"
        }
        onClick={() =>
          onNav("discover")
        }
      />

      <NavButton
        label="My Runs"
        icon="◎"
        active={
          active === "myruns"
        }
        onClick={() =>
          onNav("myruns")
        }
      />

      <NavButton
        label="Profile"
        icon="○"
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

function FounderNav({
  active,
  onNav,
}: any) {
  return (
    <nav className="bottom-nav founder-nav">
      <NavButton
        label="Dashboard"
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
        label="Club"
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
        label="Events"
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
        label="Members"
        icon="♙"
        active={
          active ===
          "members"
        }
        onClick={() =>
          onNav(
            "founder-members"
          )
        }
      />

      <NavButton
        label="Profile"
        icon="○"
        active={
          active ===
          "profile"
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