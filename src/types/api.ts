// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Player types
export interface PlayerProfile {
  id: string;
  username: string;
  displayName: string;
  isGuest: boolean;
  totalRaces: number;
  totalWins: number;
  highestRank: number | null;
  createdAt: string;
}

export interface CreatePlayerRequest {
  username: string;
  displayName: string;
  email?: string;
  password?: string;
  isGuest?: boolean;
}

// Authentication types
export interface LoginRequest {
  username: string;
  password?: string;
}

export interface AuthResponse {
  player: PlayerProfile;
  token: string;
  expiresAt: string;
}

// Race result types
export interface RaceResultData {
  trackId: string;
  raceMode: 'time_trial' | 'ghost_race' | 'multiplayer';
  finishTime: number;
  lapTimes: number[];
  checkpointTimes: number[];
  gameVersion: string;
  platformType: 'ios' | 'android' | 'unity_editor';
}

export interface RaceResult extends RaceResultData {
  id: string;
  playerId: string;
  playerName: string;
  globalRank: number | null;
  dailyRank: number | null;
  createdAt: string;
}

export interface SubmitRaceResultRequest extends RaceResultData {
  includeGhostData?: boolean;
  replayData?: any;
}

// Ghost replay types
export interface GhostReplayData {
  id: string;
  playerId: string;
  playerName: string;
  trackId: string;
  finishTime: number;
  downloadCount: number;
  createdAt: string;
}

export interface GhostReplayFull extends GhostReplayData {
  replayData: any;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  finishTime: number;
  raceResultId: string;
  createdAt: string;
}

export interface LeaderboardRequest {
  trackId: string;
  type: 'global' | 'daily';
  limit?: number;
  offset?: number;
}

// Lobby types
export interface LobbyData {
  id: string;
  name: string;
  trackId: string;
  raceMode: string;
  maxPlayers: number;
  minPlayers: number;
  status: 'waiting' | 'ready' | 'racing' | 'finished';
  isPublic: boolean;
  hostPlayerId: string | null;
  currentPlayers: number;
  createdAt: string;
}

export interface CreateLobbyRequest {
  name: string;
  trackId: string;
  raceMode: string;
  maxPlayers?: number;
  minPlayers?: number;
  isPublic?: boolean;
  password?: string;
}

export interface JoinLobbyRequest {
  lobbyId: string;
  password?: string;
}

export interface LobbyMemberData {
  playerId: string;
  playerName: string;
  isReady: boolean;
  joinedAt: string;
}

export interface LobbyDetails extends LobbyData {
  members: LobbyMemberData[];
}

// Matchmaking types
export interface MatchmakingRequest {
  trackId?: string;
  raceMode?: string;
  skillLevel?: number;
}

export interface MatchmakingResult {
  lobbyId: string;
  lobby: LobbyDetails;
}
