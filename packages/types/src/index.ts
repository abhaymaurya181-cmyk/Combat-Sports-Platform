// ─── Enumerations ─────────────────────────────────────────────────────────────

export type Organization =
  | "UFC"
  | "PFL"
  | "ONE"
  | "Bellator"
  | "RIZIN"
  | "KSW"
  | "BKFC"
  | "LFA"
  | "Cage Warriors"
  | "Other";

export type WeightClass =
  | "Strawweight"       // 115 lbs
  | "Flyweight"         // 125 lbs
  | "Bantamweight"      // 135 lbs
  | "Featherweight"     // 145 lbs
  | "Lightweight"       // 155 lbs
  | "Welterweight"      // 170 lbs
  | "Middleweight"      // 185 lbs
  | "LightHeavyweight"  // 205 lbs
  | "Heavyweight"       // 265 lbs
  | "SuperHeavyweight"; // 265 lbs+

export type FightResult = "Win" | "Loss" | "Draw" | "NoContest";

export type FinishMethod =
  | "KO"
  | "TKO"
  | "Submission"
  | "Decision_Unanimous"
  | "Decision_Split"
  | "Decision_Majority"
  | "DQ"
  | "NC";

export type Stance = "Orthodox" | "Southpaw" | "Switch";

export type EventStatus = "Upcoming" | "Live" | "Completed" | "Cancelled";

// ─── Core Models ──────────────────────────────────────────────────────────────

export interface Fighter {
  id: string;
  name: string;
  nickname?: string;
  nationality: string;
  dateOfBirth?: string; // ISO 8601
  height?: number; // cm
  reach?: number;  // cm
  stance?: Stance;
  weightClass: WeightClass;
  organization: Organization;
  isChampion: boolean;
  record: FightRecord;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FightRecord {
  wins: number;
  losses: number;
  draws: number;
  noContests: number;
  koWins?: number;
  submissionWins?: number;
  decisionWins?: number;
}

export interface Fight {
  id: string;
  eventId: string;
  fighterAId: string;
  fighterBId: string;
  weightClass: WeightClass;
  scheduledRounds: number;
  result?: FightResult;
  winnerId?: string;
  method?: FinishMethod;
  round?: number;
  timeInRound?: string; // "MM:SS"
  isMainEvent: boolean;
  isTitleFight: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  name: string;
  organization: Organization;
  date: string; // ISO 8601
  venue: string;
  city: string;
  country: string;
  status: EventStatus;
  mainCardFights: Fight[];
  prelimFights: Fight[];
  createdAt: string;
  updatedAt: string;
}

export interface Ranking {
  id: string;
  fighterId: string;
  fighter?: Fighter;
  organization: Organization;
  weightClass: WeightClass;
  position: number;
  type: "official" | "ai" | "pound-for-pound";
  score?: number;
  reasoning?: string;
  generatedAt: string;
  createdAt: string;
}

// ─── API DTOs ─────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SearchResult {
  id: string;
  type: "fighter" | "event" | "fight";
  title: string;
  subtitle?: string;
  score: number;
  metadata: Record<string, unknown>;
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  clerkId: string;
  email: string;
  username?: string;
  avatarUrl?: string;
  favouriteFighters: string[];
  favouriteOrganizations: Organization[];
  createdAt: string;
  updatedAt: string;
}

// ─── Realtime Events ─────────────────────────────────────────────────────────

export interface DebateMessage {
  id: string;
  roomId: string;
  userId: string;
  message: string;
  timestamp: string;
}

export interface LiveFightUpdate {
  fightId: string;
  round: number;
  timeElapsed: string;
  significantStrikes: { fighterAId: number; fighterBId: number };
  takedowns: { fighterAId: number; fighterBId: number };
}
