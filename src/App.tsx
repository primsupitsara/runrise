import { useEffect, useMemo, useState } from "react";
import founderClubCover from "./assets/6am-run-club-bkk.png";

type Role = "runner" | "founder";

type Page =
  | "welcome"
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
  location: string;
  time: string;
  goal: string;
  vibe: string;
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
  name: "Mona",
  level: "",
  pace: "",
  distance: "",
  location: "",
  time: "",
  goal: "",
  vibe: "",
};

const initialClubs: Club[] = [
  {
    id: 1,
    name: "6am Run Club BKK",
    location: "Lumpini",
    pace: "6:00–8:00",
    distance: "3K",
    schedule: "Sat / Sun · Morning",
    level: "All Levels",
    vibe: ["Social", "Beginner Friendly"],
    description:
      "An early-morning social running community for runners who enjoy starting the day together.",
    members: 0,
    founder: "6am Run Club BKK",
    promoted: true,
  },
  {
    id: 2,
    name: "Lumpini Running Club Bangkok",
    location: "Lumpini",
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
    location: "Benjakitti",
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
    location: "Benjakitti",
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
    location: "Benjakitti",
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
    location: "Sukhumvit",
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

const initialEvents: RunEvent[] = [
  {
    id: 101,
    clubId: 1,
    name: "Weekend Morning Run",
    date: "17 Oct",
    time: "06:00",
    location: "Lumpini",
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
    location: "Lumpini",
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
    location: "Benjakitti",
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
    location: "Benjakitti",
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
    location: "Benjakitti",
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
    location: "Sukhumvit",
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

function distanceMatches(
  runnerDistance: string,
  clubDistance: string
) {
  const runner = parseInt(runnerDistance);

  if (isNaN(runner)) return false;

  const numbers = clubDistance.match(/\d+/g)?.map(Number);

  if (!numbers || numbers.length === 0) {
    return false;
  }

  if (numbers.length === 1) {
    return runner === numbers[0];
  }

  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  return runner >= min && runner <= max;
}

function App() {
  const [page, setPage] = useState<Page>("welcome");
  const [role, setRole] = useState<Role>("runner");

  const [profile, setProfile] = useState<RunnerProfile>({
    ...defaultProfile,
  });

  const [clubs, setClubs] = useState<Club[]>(() =>
    readStorage("runrise-clubs", initialClubs)
  );

  const [events, setEvents] = useState<RunEvent[]>(() =>
    readStorage("runrise-events", initialEvents)
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

    if (profile.location && club.location === profile.location) {
      score += 25;
    }

    if (profile.pace && club.pace === profile.pace) {
      score += 25;
    }

    const preferredSchedule =
      profile.time === "Morning"
        ? "Morning"
        : profile.time === "Evening"
        ? "Evening"
        : "";

    if (
      preferredSchedule &&
      club.schedule
        .toLowerCase()
        .includes(preferredSchedule.toLowerCase())
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
      profile.vibe &&
      club.vibe.some((vibe) =>
        vibe.toLowerCase().includes(profile.vibe.toLowerCase())
      )
    ) {
      score += 5;
    }

    if (!profile.level && !profile.location && !profile.distance) {
      return 70 + ((club.id * 7) % 25);
    }

    return Math.max(score, 20);
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
        alert("Compare ได้สูงสุด 3 Run Clubs");
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

  const cancelEvent = (eventId: number) => {
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
      role === "runner"
        ? "founder"
        : "runner";

    setRole(nextRole);

    setPage(
      nextRole === "runner"
        ? "runner-home"
        : "founder-dashboard"
    );
  };

  return (
    <div className="app-shell">
      <div className="phone">

        {page === "welcome" && (
          <Welcome onStart={() => setPage("role")} />
        )}

        {page === "role" && (
          <RoleSelect
            onRunner={() => {
              setRole("runner");
              setProfile({
                ...defaultProfile,
              });
              setDistanceFilter("All");
              setPage("runner-onboarding");
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
            onBack={() => {
              setProfile({
                ...defaultProfile,
              });
              setDistanceFilter("All");
              setPage("role");
            }}
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
            calculateMatch={calculateMatch}
            onBack={() => setPage("discover")}
          />
        )}

        {page === "event" && (
          <EventDetail
            event={selectedEvent}
            club={
              clubs.find(
                (club) =>
                  club.id === selectedEvent.clubId
              ) || selectedClub
            }
            joined={joinedEvents.includes(selectedEvent.id)}
            onBack={() => setPage("club")}
            onJoin={() => joinEvent(selectedEvent.id)}
            onCancel={() => cancelEvent(selectedEvent.id)}
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
            onCancel={cancelEvent}
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
            onSwitchRole={switchRole}
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
                  club.id === updated.id
                    ? updated
                    : club
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
            onNav={setPage}
          />
        )}

        {page === "founder-profile" && (
          <FounderProfile
            onSwitchRole={switchRole}
            onNav={setPage}
          />
        )}

      </div>
    </div>
  );
}

function Welcome({
  onStart,
}: {
  onStart: () => void;
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

      <button
        className="primary"
        onClick={onStart}
      >
        Get Started
      </button>
    </main>
  );
}

function RoleSelect({
  onRunner,
  onFounder,
}: {
  onRunner: () => void;
  onFounder: () => void;
}) {
  return (
    <main className="screen">
      <Header
        eyebrow="WELCOME"
        title="How will you use Runrise?"
        subtitle="You can switch roles later."
      />

      <button
        className="large-card"
        onClick={onRunner}
      >
        <div className="big-icon">🏃</div>
        <h2>Runner</h2>
        <p>
          Discover, compare and join running communities.
        </p>
      </button>

      <button
        className="large-card"
        onClick={onFounder}
      >
        <div className="big-icon">◎</div>
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
  const [areaOpen, setAreaOpen] = useState(false);

  const areas = [
    "Lumpini",
    "Benjakitti",
    "Sukhumvit",
    "Ari",
    "Sathorn",
    "Chatuchak",
  ];

  const levelOptions = [
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

  const distanceOptions = [
    "3K",
    "5K",
    "8K",
    "10K",
    "15K+",
  ];

  const timeOptions = [
    "Morning",
    "Evening",
    "Flexible",
  ];

  const goalOptions = [
    "Health",
    "Community / Social",
    "Race Training",
    "Improve Pace",
    "Just Getting Started",
  ];

  const updateProfile = (
    key: keyof RunnerProfile,
    value: string
  ) => {
    setProfile({
      ...profile,
      [key]: value,
    });
  };

  const completedCount = [
    profile.level,
    profile.pace,
    profile.distance,
    profile.location,
    profile.time,
    profile.goal,
  ].filter((value) => value.trim() !== "").length;

  const isComplete = completedCount === 6;

  return (
    <>
      <style>{`
        .rr-onboarding {
          --rr-orange: #f36b32;
          --rr-orange-dark: #e95a22;
          --rr-peach: #fff0e8;
          --rr-text: #19191b;
          --rr-muted: #929298;
          --rr-border: rgba(45, 45, 50, 0.08);

          width: 100%;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 22px 18px 125px;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(255, 183, 145, 0.28),
              transparent 30%
            ),
            radial-gradient(
              circle at 0% 40%,
              rgba(239, 133, 132, 0.12),
              transparent 28%
            ),
            #f7f7fa;

          scrollbar-width: none;
        }

        .rr-onboarding::-webkit-scrollbar {
          display: none;
        }

        .rr-back {
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 22px;
          padding: 0 13px;
          border: 1px solid rgba(243, 107, 50, 0.08);
          border-radius: 999px;
          background: rgba(255, 240, 233, 0.92);
          color: var(--rr-orange);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .rr-back-arrow {
          font-size: 18px;
          line-height: 1;
        }

        .rr-hero {
          position: relative;
          overflow: hidden;
          margin-bottom: 18px;
          padding: 22px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 28px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.96),
              rgba(255,248,244,0.95)
            );

          box-shadow:
            0 14px 40px rgba(35, 35, 40, 0.055);
        }

        .rr-hero::after {
          content: "";
          position: absolute;
          width: 120px;
          height: 120px;
          top: -45px;
          right: -35px;
          border-radius: 50%;

          background:
            linear-gradient(
              145deg,
              rgba(239, 133, 132, 0.22),
              rgba(243, 107, 50, 0.14)
            );
        }

        .rr-eyebrow {
          position: relative;
          z-index: 1;
          margin: 0 0 9px;
          color: var(--rr-orange);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .rr-hero h1 {
          position: relative;
          z-index: 1;
          margin: 0 0 11px;
          color: var(--rr-text);
          font-size: 29px;
          line-height: 1.06;
          letter-spacing: -1.25px;
        }

        .rr-hero-description {
          position: relative;
          z-index: 1;
          margin: 0;
          max-width: 95%;
          color: var(--rr-muted);
          font-size: 12px;
          line-height: 1.55;
        }

        .rr-progress-wrap {
          margin-top: 18px;
        }

        .rr-progress-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 7px;
          color: #77777e;
          font-size: 10px;
          font-weight: 750;
        }

        .rr-progress {
          height: 6px;
          overflow: hidden;
          border-radius: 999px;
          background: #ececf0;
        }

        .rr-progress-fill {
          height: 100%;
          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              #ef8584,
              #f36b32
            );

          transition: width 0.25s ease;
        }

        .rr-form {
          display: grid;
          gap: 13px;
        }

        .rr-card {
          padding: 17px;
          border: 1px solid rgba(255,255,255,0.85);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.92);

          box-shadow:
            0 8px 28px rgba(40, 40, 45, 0.045);

          backdrop-filter: blur(16px);
        }

        .rr-question-head {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          margin-bottom: 13px;
        }

        .rr-number {
          width: 29px;
          height: 29px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 10px;

          background:
            linear-gradient(
              145deg,
              #fff1ea,
              #ffe4d6
            );

          color: var(--rr-orange);
          font-size: 11px;
          font-weight: 900;
        }

        .rr-question-copy {
          flex: 1;
        }

        .rr-question-copy h2 {
          margin: 0 0 3px;
          color: var(--rr-text);
          font-size: 16px;
          line-height: 1.2;
          letter-spacing: -0.3px;
        }

        .rr-question-copy p {
          margin: 0;
          color: var(--rr-muted);
          font-size: 10px;
          line-height: 1.4;
        }

        .rr-level-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .rr-level-card {
          min-height: 67px;
          padding: 11px;
          border: 1px solid transparent;
          border-radius: 16px;
          background: #f6f6f8;
          color: var(--rr-text);
          text-align: left;
          cursor: pointer;

          transition:
            transform 0.16s ease,
            border-color 0.16s ease,
            background 0.16s ease;
        }

        .rr-level-card:hover {
          transform: translateY(-1px);
        }

        .rr-level-card.selected {
          border-color: rgba(243, 107, 50, 0.24);

          background:
            linear-gradient(
              145deg,
              #fff1ea,
              #fff8f4
            );
        }

        .rr-level-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .rr-level-label {
          font-size: 12px;
          font-weight: 800;
        }

        .rr-level-check {
          width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--rr-orange);
          color: white;
          font-size: 10px;
          font-weight: 900;
        }

        .rr-level-description {
          display: block;
          margin-top: 5px;
          color: var(--rr-muted);
          font-size: 9px;
        }

        .rr-input-wrap {
          position: relative;
        }

        .rr-pace-input {
          width: 100%;
          height: 52px;
          padding: 0 78px 0 15px;
          border: 1px solid var(--rr-border);
          border-radius: 16px;
          outline: none;
          background: #f6f6f8;
          color: var(--rr-text);
          font-size: 16px;
          font-weight: 800;

          transition:
            border-color 0.18s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;
        }

        .rr-pace-input::placeholder {
          color: #b0b0b6;
        }

        .rr-pace-input:focus {
          border-color: rgba(243, 107, 50, 0.4);
          background: white;

          box-shadow:
            0 0 0 4px rgba(243, 107, 50, 0.07);
        }

        .rr-unit {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          padding: 5px 8px;
          border-radius: 999px;
          background: #ececf0;
          color: #77777e;
          font-size: 9px;
          font-weight: 800;
          pointer-events: none;
        }

        .rr-helper {
          margin: 7px 0 0;
          color: #aaaab0;
          font-size: 9px;
        }

        .rr-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .rr-chip {
          position: relative;
          min-height: 39px;
          padding: 0 13px;
          border: 1px solid transparent;
          border-radius: 999px;
          background: #f4f4f7;
          color: #66666c;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;

          transition:
            transform 0.16s ease,
            background 0.16s ease,
            color 0.16s ease,
            border-color 0.16s ease;
        }

        .rr-chip:hover {
          transform: translateY(-1px);
        }

        .rr-chip.selected {
          border-color: rgba(243, 107, 50, 0.22);

          background:
            linear-gradient(
              145deg,
              #fff1ea,
              #ffe8dc
            );

          color: var(--rr-orange-dark);
        }

        .rr-check {
          margin-left: 5px;
          font-weight: 900;
        }

        .rr-dropdown {
          position: relative;
        }

        .rr-dropdown-trigger {
          width: 100%;
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 0 13px;
          border: 1px solid var(--rr-border);
          border-radius: 16px;
          background: #f6f6f8;
          color: var(--rr-text);
          text-align: left;
          cursor: pointer;

          transition:
            border-color 0.18s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;
        }

        .rr-dropdown-trigger.open {
          border-color: rgba(243,107,50,0.38);
          background: white;

          box-shadow:
            0 0 0 4px rgba(243,107,50,0.07);
        }

        .rr-dropdown-value {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .rr-location-icon {
          width: 31px;
          height: 31px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 10px;

          background:
            linear-gradient(
              145deg,
              #fff0e9,
              #ffe4d6
            );

          color: var(--rr-orange);
        }

        .rr-dropdown-text {
          overflow: hidden;
          color: var(--rr-text);
          font-size: 12px;
          font-weight: 800;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .rr-dropdown-text.placeholder {
          color: #77777e;
        }

        .rr-chevron {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          color: var(--rr-orange);
          transition: transform 0.18s ease;
        }

        .rr-chevron.open {
          transform: rotate(180deg);
        }

        .rr-dropdown-menu {
          position: relative;
          z-index: 10;

          margin-top: 8px;
          padding: 6px;

          border: 1px solid rgba(60,60,67,0.08);
          border-radius: 17px;

          background: rgba(255,255,255,0.99);

          box-shadow:
            0 12px 32px rgba(0,0,0,0.10);

          backdrop-filter: blur(20px);
          animation: rrDrop 0.16s ease;
        }

        @keyframes rrDrop {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rr-dropdown-item {
          width: 100%;
          min-height: 43px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          border: none;
          border-radius: 11px;
          background: transparent;
          color: var(--rr-text);
          font-size: 12px;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
        }

        .rr-dropdown-item:hover {
          background: #f6f6f8;
        }

        .rr-dropdown-item.selected {
          background: #fff0e9;
          color: var(--rr-orange);
        }

        .rr-dropdown-check {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #ffdccc;
          color: var(--rr-orange);
          font-size: 10px;
          font-weight: 900;
        }

        .rr-footer {
          position: sticky;
          bottom: -1px;
          z-index: 50;
          margin-top: 17px;
          padding: 13px;
          border: 1px solid rgba(255,255,255,0.9);
          border-radius: 22px;
          background: rgba(255,255,255,0.94);

          box-shadow:
            0 -8px 28px rgba(30,30,35,0.08);

          backdrop-filter: blur(22px);
        }

        .rr-footer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .rr-footer-copy strong {
          display: block;
          margin-bottom: 2px;
          font-size: 12px;
        }

        .rr-footer-copy span {
          color: var(--rr-muted);
          font-size: 9px;
        }

        .rr-count {
          flex-shrink: 0;
          padding: 6px 9px;
          border-radius: 999px;
          background: #f1f1f4;
          color: #73737a;
          font-size: 9px;
          font-weight: 900;
        }

        .rr-find-button {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 16px;

          background:
            linear-gradient(
              135deg,
              #ef8584,
              #f36b32
            );

          color: white;
          font-size: 14px;
          font-weight: 850;

          box-shadow:
            0 9px 22px rgba(243,107,50,0.2);

          cursor: pointer;

          transition:
            transform 0.15s ease,
            opacity 0.15s ease;
        }

        .rr-find-button:not(:disabled):active {
          transform: scale(0.99);
        }

        .rr-find-button:disabled {
          background: #f5c1ad;
          box-shadow: none;
          opacity: 0.72;
          cursor: not-allowed;
        }
      `}</style>

      <main
        className="rr-onboarding"
        onClick={() => {
          if (areaOpen) {
            setAreaOpen(false);
          }
        }}
      >
        <button
          type="button"
          className="rr-back"
          onClick={onBack}
        >
          <span className="rr-back-arrow">
            ←
          </span>
          Back
        </button>

        <section className="rr-hero">
          <p className="rr-eyebrow">
            PERSONALIZE YOUR RUN
          </p>

          <h1>
            Find a run that
            <br />
            feels like you.
          </h1>

          <p className="rr-hero-description">
            Tell us how you like to run and we'll match you with
            communities that fit your pace, place and goals.
          </p>

          <div className="rr-progress-wrap">
            <div className="rr-progress-head">
              <span>Your running profile</span>
              <span>{completedCount}/6</span>
            </div>

            <div className="rr-progress">
              <div
                className="rr-progress-fill"
                style={{
                  width: `${(completedCount / 6) * 100}%`,
                }}
              />
            </div>
          </div>
        </section>

        <div className="rr-form">
          <section className="rr-card">
            <div className="rr-question-head">
              <div className="rr-number">01</div>

              <div className="rr-question-copy">
                <h2>Running Level</h2>
                <p>
                  Where are you in your running journey?
                </p>
              </div>
            </div>

            <div className="rr-level-grid">
              {levelOptions.map((option) => {
                const selected =
                  profile.level === option.value;

                return (
                  <button
                    type="button"
                    key={option.value}
                    className={
                      selected
                        ? "rr-level-card selected"
                        : "rr-level-card"
                    }
                    onClick={() =>
                      updateProfile("level", option.value)
                    }
                  >
                    <div className="rr-level-top">
                      <span className="rr-level-label">
                        {option.label}
                      </span>

                      {selected && (
                        <span className="rr-level-check">
                          ✓
                        </span>
                      )}
                    </div>

                    <span className="rr-level-description">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rr-card">
            <div className="rr-question-head">
              <div className="rr-number">02</div>

              <div className="rr-question-copy">
                <h2>Usual Pace</h2>
                <p>
                  What's your average running pace?
                </p>
              </div>
            </div>

            <div className="rr-input-wrap">
              <input
                className="rr-pace-input"
                type="text"
                inputMode="decimal"
                placeholder="6:30"
                value={profile.pace}
                onChange={(event) =>
                  updateProfile("pace", event.target.value)
                }
              />

              <span className="rr-unit">
                MIN / KM
              </span>
            </div>

            <p className="rr-helper">
              Example: 6:30 means 6 minutes 30 seconds per kilometer.
            </p>
          </section>

          <section className="rr-card">
            <div className="rr-question-head">
              <div className="rr-number">03</div>

              <div className="rr-question-copy">
                <h2>Preferred Distance</h2>
                <p>
                  How far do you usually enjoy running?
                </p>
              </div>
            </div>

            <div className="rr-chips">
              {distanceOptions.map((distance) => (
                <button
                  type="button"
                  key={distance}
                  className={
                    profile.distance === distance
                      ? "rr-chip selected"
                      : "rr-chip"
                  }
                  onClick={() =>
                    updateProfile("distance", distance)
                  }
                >
                  {distance}

                  {profile.distance === distance && (
                    <span className="rr-check">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section
            className="rr-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="rr-question-head">
              <div className="rr-number">04</div>

              <div className="rr-question-copy">
                <h2>Preferred Area</h2>
                <p>
                  Where would you like to run most often?
                </p>
              </div>
            </div>

            <div className="rr-dropdown">
              <button
                type="button"
                className={
                  areaOpen
                    ? "rr-dropdown-trigger open"
                    : "rr-dropdown-trigger"
                }
                onClick={() =>
                  setAreaOpen(
                    (previous) => !previous
                  )
                }
              >
                <span className="rr-dropdown-value">
                  <span className="rr-location-icon">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle
                        cx="12"
                        cy="10"
                        r="2.5"
                      />
                    </svg>
                  </span>

                  <span
                    className={
                      profile.location
                        ? "rr-dropdown-text"
                        : "rr-dropdown-text placeholder"
                    }
                  >
                    {profile.location ||
                      "Select your preferred area"}
                  </span>
                </span>

                <span
                  className={
                    areaOpen
                      ? "rr-chevron open"
                      : "rr-chevron"
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="17"
                    height="17"
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

              {areaOpen && (
                <div className="rr-dropdown-menu">
                  {areas.map((area) => (
                    <button
                      type="button"
                      key={area}
                      className={
                        profile.location === area
                          ? "rr-dropdown-item selected"
                          : "rr-dropdown-item"
                      }
                      onClick={() => {
                        updateProfile(
                          "location",
                          area
                        );
                        setAreaOpen(false);
                      }}
                    >
                      <span>{area}</span>

                      {profile.location === area && (
                        <span className="rr-dropdown-check">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rr-card">
            <div className="rr-question-head">
              <div className="rr-number">05</div>

              <div className="rr-question-copy">
                <h2>Running Time</h2>
                <p>
                  When do you normally prefer to run?
                </p>
              </div>
            </div>

            <div className="rr-chips">
              {timeOptions.map((time) => (
                <button
                  type="button"
                  key={time}
                  className={
                    profile.time === time
                      ? "rr-chip selected"
                      : "rr-chip"
                  }
                  onClick={() =>
                    updateProfile("time", time)
                  }
                >
                  {time}

                  {profile.time === time && (
                    <span className="rr-check">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="rr-card">
            <div className="rr-question-head">
              <div className="rr-number">06</div>

              <div className="rr-question-copy">
                <h2>Running Goal</h2>
                <p>
                  What are you hoping to get from running?
                </p>
              </div>
            </div>

            <div className="rr-chips">
              {goalOptions.map((goal) => (
                <button
                  type="button"
                  key={goal}
                  className={
                    profile.goal === goal
                      ? "rr-chip selected"
                      : "rr-chip"
                  }
                  onClick={() =>
                    updateProfile("goal", goal)
                  }
                >
                  {goal}

                  {profile.goal === goal && (
                    <span className="rr-check">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="rr-footer">
          <div className="rr-footer-top">
            <div className="rr-footer-copy">
              <strong>
                {isComplete
                  ? "You're ready!"
                  : "Almost there"}
              </strong>

              <span>
                {isComplete
                  ? "Your Smart Match profile is complete."
                  : `${completedCount} of 6 preferences completed.`}
              </span>
            </div>

            <span className="rr-count">
              {completedCount}/6
            </span>
          </div>

          <button
            type="button"
            className="rr-find-button"
            disabled={!isComplete}
            onClick={onFinish}
          >
            {isComplete
              ? "Find My Clubs →"
              : "Complete Your Profile"}
          </button>
        </div>
      </main>
    </>
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
      <div className="home-top">
        <div>
          <p className="eyebrow">
            RUNRISE
          </p>

          <h1>
            Good morning,{" "}
            {profile.name ||
              "Runner"}{" "}
            👋
          </h1>

          <p className="muted">
            Ready to find your next run?
          </p>
        </div>

        <button
          className="notification"
          onClick={onNotifications}
        >
          🔔

          {unread > 0 && (
            <span>{unread}</span>
          )}
        </button>
      </div>

      <div className="section-row">
        <div>
          <p className="eyebrow">
            SMART MATCHING
          </p>

          <h2>
            Recommended for you
          </h2>
        </div>

        <button
          className="link"
          onClick={onDiscover}
        >
          See all
        </button>
      </div>

      <div className="cards">
        {clubs.map(
          (club: Club) => (
            <ClubCard
              key={club.id}
              club={club}
              score={calculateMatch(
                club
              )}
              onOpen={() =>
                onClub(club.id)
              }
            />
          )
        )}
      </div>

      <RunnerNav
        active="home"
        onNav={onNav}
      />
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
      <div
        className={`club-cover cover-${club.id}`}
      >
        <span className="match">
          {score}% Match
        </span>

        {club.promoted && (
          <span className="featured">
            Featured
          </span>
        )}
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
    "Lumpini",
    "Benjakitti",
    "Sukhumvit",
    "Ari",
    "Sathorn",
    "Chatuchak",
  ];

  const distances = [
    "All",
    "3K",
    "5K",
    "8K",
    "10K",
    "15K+",
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
              {distance}
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

      <div
        className={`club-cover large-cover cover-${club.id}`}
      >
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
  calculateMatch,
  onBack,
}: {
  clubs: Club[];
  calculateMatch: (
    club: Club
  ) => number;
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

  const bestClub = [
    ...clubs,
  ].sort(
    (a, b) =>
      calculateMatch(b) -
      calculateMatch(a)
  )[0];

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
        title="Which club fits you?"
        subtitle="Compare the things that matter most."
      />

      <div
        className="compare-club-heads"
        style={{
          gridTemplateColumns:
            `repeat(${clubs.length}, 1fr)`,
        }}
      >
        {clubs.map(
          (club) => (
            <div
              key={club.id}
              className="compare-club-head"
            >
              <div
                className={`compare-cover cover-${club.id}`}
              />

              <strong>
                {club.name}
              </strong>

              <span>
                {calculateMatch(
                  club
                )}
                % Match
              </span>
            </div>
          )
        )}
      </div>

      <div className="easy-compare">
        <EasyCompareRow
          label="LOCATION"
          values={clubs.map(
            (club) =>
              club.location
          )}
        />

        <EasyCompareRow
          label="DISTANCE"
          values={clubs.map(
            (club) =>
              club.distance
          )}
        />

        <EasyCompareRow
          label="PACE"
          values={clubs.map(
            (club) =>
              club.pace
          )}
        />

        <EasyCompareRow
          label="SCHEDULE"
          values={clubs.map(
            (club) =>
              club.schedule
          )}
        />

        <EasyCompareRow
          label="LEVEL"
          values={clubs.map(
            (club) =>
              club.level
          )}
        />

        <EasyCompareRow
          label="COMMUNITY"
          values={clubs.map(
            (club) =>
              club.vibe[0]
          )}
        />
      </div>

      <div className="best-match-card">
        <div className="best-match-icon">
          ✓
        </div>

        <div>
          <small>
            BEST MATCH FOR YOU
          </small>

          <h3>
            {bestClub.name}
          </h3>

          <p>
            {calculateMatch(
              bestClub
            )}
            % match based on your
            current running profile.
          </p>
        </div>
      </div>
    </main>
  );
}

function EasyCompareRow({
  label,
  values,
}: {
  label: string;
  values: string[];
}) {
  return (
    <div className="easy-compare-row">
      <small>{label}</small>

      <div
        className="easy-compare-values"
        style={{
          gridTemplateColumns:
            `repeat(${values.length}, 1fr)`,
        }}
      >
        {values.map(
          (value, index) => (
            <div
              key={`${value}-${index}`}
            >
              {value}
            </div>
          )
        )}
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
  onSwitchRole,
  onNav,
}: any) {
  const [
    editing,
    setEditing,
  ] = useState(false);

  return (
    <main className="screen with-nav">
      <div className="profile-head">
        <div className="profile-avatar">
          {profile.name?.[0] ||
            "R"}
        </div>

        <h1>
          {profile.name}
        </h1>

        <p className="muted">
          Runner
        </p>

        <button
          className="link"
          onClick={() =>
            setEditing(
              !editing
            )
          }
        >
          {editing
            ? "Done"
            : "Edit Preferences"}
        </button>
      </div>

      {editing ? (
        <div className="settings-card">
          <label>
            Usual Running Distance

            <select
              value={
                profile.distance
              }
              onChange={(event) =>
                setProfile({
                  ...profile,
                  distance:
                    event.target.value,
                })
              }
            >
              {[
                "3K",
                "5K",
                "8K",
                "10K",
                "15K+",
              ].map(
                (distance) => (
                  <option
                    key={
                      distance
                    }
                  >
                    {
                      distance
                    }
                  </option>
                )
              )}
            </select>
          </label>
        </div>
      ) : (
        <div className="stat-grid">
          <Stat
            label="LEVEL"
            value={
              profile.level ||
              "-"
            }
          />

          <Stat
            label="PACE"
            value={
              profile.pace ||
              "-"
            }
          />

          <Stat
            label="DISTANCE"
            value={
              profile.distance ||
              "-"
            }
          />
        </div>
      )}

      <div className="settings-card">
        <button
          className="settings-row"
          onClick={
            onSwitchRole
          }
        >
          Switch to Founder
          <span>›</span>
        </button>

        <button
          className="settings-row"
          onClick={() => {
            if (
              confirm(
                "Reset prototype data?"
              )
            ) {
              localStorage.clear();
              location.reload();
            }
          }}
        >
          Reset Prototype
          <span>↻</span>
        </button>
      </div>

      <RunnerNav
        active="profile"
        onNav={onNav}
      />
    </main>
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
          src={founderClubCover}
          alt={`${draft.name} cover`}
          className="fcm-cover-image"
        />

        <button
          type="button"
          className="fcm-change-cover"
        >
          Change Cover
        </button>
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
    location: "Lumpini",
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
  onNav,
}: any) {
  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<
      "All" | "New" | "Active"
    >("All");

  const filteredMembers =
    members.filter(
      (member: Member) => {
        const matchesSearch =
          member.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesFilter =
          filter === "All" ||
          member.status === filter;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  const newMembers =
    members.filter(
      (member: Member) =>
        member.status === "New"
    ).length;

  return (
    <main className="screen with-nav founder-screen">
      <Header
        eyebrow="MEMBER MANAGEMENT"
        title="Your community"
        subtitle="See who's joining and staying active."
      />

      <div className="member-summary">
        <div>
          <strong>
            {members.length}
          </strong>

          <span>
            Total Members
          </span>
        </div>

        <div>
          <strong>
            {newMembers}
          </strong>

          <span>
            New Members
          </span>
        </div>

        <div>
          <strong>
            {members.reduce(
              (
                total: number,
                member: Member
              ) =>
                total +
                member.events,
              0
            )}
          </strong>

          <span>
            Run Joins
          </span>
        </div>
      </div>

      <input
        className="search"
        placeholder="Search member"
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <div className="member-filter-tabs">
        {[
          "All",
          "New",
          "Active",
        ].map((item) => (
          <button
            key={item}
            className={
              filter === item
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter(
                item as
                  | "All"
                  | "New"
                  | "Active"
              )
            }
          >
            {item}
          </button>
        ))}
      </div>

      <p className="small-label">
        {filteredMembers.length} MEMBERS
      </p>

      <div className="founder-member-list">
        {filteredMembers.map(
          (member: Member) => (
            <article
              className="founder-member-card"
              key={member.id}
            >
              <div className="member-avatar large">
                {member.name[0]}
              </div>

              <div className="grow">
                <div className="member-name-row">
                  <strong>
                    {member.name}
                  </strong>

                  <span
                    className={`member-badge ${
                      member.status ===
                      "New"
                        ? "new"
                        : ""
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                <p>
                  Joined{" "}
                  {member.joined}
                </p>

                <small>
                  🏃 {member.events} runs joined
                </small>
              </div>
            </article>
          )
        )}
      </div>

      {filteredMembers.length ===
        0 && (
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


/* =========================================================
   FOUNDER PROFILE
========================================================= */

function FounderProfile({
  onSwitchRole,
  onNav,
}: any) {
  const [
    notificationsEnabled,
    setNotificationsEnabled,
  ] = useState(true);

  return (
    <main className="screen with-nav founder-screen">
      <div className="founder-profile-header">
        <div className="founder-profile-avatar">
          A
        </div>

        <h1>Alex</h1>

        <p className="muted">
          Founder · 6am Run Club BKK
        </p>

        <button className="founder-edit-profile">
          Edit Profile
        </button>
      </div>

      <div className="founder-profile-stats">
        <div>
          <strong>1</strong>
          <span>Run Club</span>
        </div>

        <div>
          <strong>28</strong>
          <span>New Members</span>
        </div>

        <div>
          <strong>12</strong>
          <span>Runs Hosted</span>
        </div>
      </div>

      <section className="founder-profile-section">
        <p className="small-label">
          ACCOUNT
        </p>

        <div className="settings-card">
          <button className="settings-row">
            <span>
              👤 Founder Information
            </span>

            <span>›</span>
          </button>

          <button className="settings-row">
            <span>
              ◉ Club Settings
            </span>

            <span>›</span>
          </button>
        </div>
      </section>

      <section className="founder-profile-section">
        <p className="small-label">
          PREFERENCES
        </p>

        <div className="settings-card">
          <div className="settings-row">
            <span>
              🔔 Notifications
            </span>

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
            <span>
              🏃 Switch to Runner
            </span>

            <span>›</span>
          </button>
        </div>
      </section>

      <FounderNav
        active="profile"
        onNav={onNav}
      />
    </main>
  );
}


/* =========================================================
   FOUNDER NAV
========================================================= */

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