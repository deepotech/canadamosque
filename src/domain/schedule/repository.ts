/**
 * Unified Schedule Repository
 * 
 * Provides access to verified mosque Iqamah and Jummah schedules.
 * Ensures:
 * - Only verified, non-conflicting, currently valid records are exposed publicly.
 * - Deterministic, server-side execution.
 * - Safe behavior when dataset is empty (0 records).
 */

import { IqamahSchedule } from "../iqamah/types";
import { JummahSchedule } from "../jummah/types";
import { isScheduleCurrent, isScheduleExpiringSoon } from "./expiration";
import { detectIqamahConflicts, detectJummahConflicts } from "./conflicts";
import { validateIqamahSchedule, validateJummahSchedule } from "./validation";
import { ScheduleQualityMetrics } from "./types";

export interface IScheduleRepository {
  // Iqamah
  getIqamahByMosqueId(mosqueId: string): Promise<IqamahSchedule[]>;
  getCurrentIqamahByMosqueId(mosqueId: string, targetDate?: string): Promise<IqamahSchedule | null>;
  getAllVerifiedIqamah(targetDate?: string): Promise<IqamahSchedule[]>;

  // Jummah
  getJummahByMosqueId(mosqueId: string): Promise<JummahSchedule[]>;
  getCurrentJummahByMosqueId(mosqueId: string, targetDate?: string): Promise<JummahSchedule | null>;
  getAllVerifiedJummah(targetDate?: string): Promise<JummahSchedule[]>;

  // Audits & Quality
  getQualityMetrics(targetDate?: string): Promise<ScheduleQualityMetrics>;
}

// In-memory cache
let cachedIqamah: IqamahSchedule[] | null = null;
let cachedJummah: JummahSchedule[] | null = null;

async function loadRawIqamah(): Promise<IqamahSchedule[]> {
  if (cachedIqamah) return cachedIqamah;
  try {
    const mod = await import("@/data/toronto/iqamah/verified.json");
    const raw = (mod.default || mod) as unknown as IqamahSchedule[];
    cachedIqamah = Array.isArray(raw) ? raw : [];
    return cachedIqamah;
  } catch {
    return [];
  }
}

async function loadRawJummah(): Promise<JummahSchedule[]> {
  if (cachedJummah) return cachedJummah;
  try {
    const mod = await import("@/data/toronto/jummah/verified.json");
    const raw = (mod.default || mod) as unknown as JummahSchedule[];
    cachedJummah = Array.isArray(raw) ? raw : [];
    return cachedJummah;
  } catch {
    return [];
  }
}

export class ScheduleRepository implements IScheduleRepository {
  private customIqamahRecords?: IqamahSchedule[];
  private customJummahRecords?: JummahSchedule[];

  constructor(customData?: {
    iqamah?: IqamahSchedule[];
    jummah?: JummahSchedule[];
  }) {
    if (customData?.iqamah) this.customIqamahRecords = customData.iqamah;
    if (customData?.jummah) this.customJummahRecords = customData.jummah;
  }

  private async getIqamahList(): Promise<IqamahSchedule[]> {
    if (this.customIqamahRecords) return this.customIqamahRecords;
    return loadRawIqamah();
  }

  private async getJummahList(): Promise<JummahSchedule[]> {
    if (this.customJummahRecords) return this.customJummahRecords;
    return loadRawJummah();
  }

  // -------------------------------------------------------------
  // Iqamah Methods
  // -------------------------------------------------------------

  async getIqamahByMosqueId(mosqueId: string): Promise<IqamahSchedule[]> {
    const list = await this.getIqamahList();
    return list.filter((r) => r.mosqueId === mosqueId);
  }

  async getCurrentIqamahByMosqueId(
    mosqueId: string,
    targetDate?: string
  ): Promise<IqamahSchedule | null> {
    const list = await this.getIqamahList();
    const mosqueRecords = list.filter((r) => r.mosqueId === mosqueId);

    // Check for conflicts
    const conflicts = detectIqamahConflicts(mosqueRecords, targetDate);
    if (conflicts.length > 0) {
      // Withhold conflicting schedules from public view
      return null;
    }

    const current = mosqueRecords.find((r) => {
      const valid = validateIqamahSchedule(r).isValid;
      return valid && isScheduleCurrent(r, targetDate);
    });

    return current || null;
  }

  async getAllVerifiedIqamah(targetDate?: string): Promise<IqamahSchedule[]> {
    const list = await this.getIqamahList();
    const conflicts = detectIqamahConflicts(list, targetDate);
    const conflictingMosqueIds = new Set(conflicts.map((c) => c.mosqueId));

    return list.filter((r) => {
      if (conflictingMosqueIds.has(r.mosqueId)) return false;
      const valid = validateIqamahSchedule(r).isValid;
      return valid && isScheduleCurrent(r, targetDate);
    });
  }

  // -------------------------------------------------------------
  // Jummah Methods
  // -------------------------------------------------------------

  async getJummahByMosqueId(mosqueId: string): Promise<JummahSchedule[]> {
    const list = await this.getJummahList();
    return list.filter((r) => r.mosqueId === mosqueId);
  }

  async getCurrentJummahByMosqueId(
    mosqueId: string,
    targetDate?: string
  ): Promise<JummahSchedule | null> {
    const list = await this.getJummahList();
    const mosqueRecords = list.filter((r) => r.mosqueId === mosqueId);

    // Check for conflicts
    const conflicts = detectJummahConflicts(mosqueRecords, targetDate);
    if (conflicts.length > 0) {
      // Withhold conflicting schedules from public view
      return null;
    }

    const current = mosqueRecords.find((r) => {
      const valid = validateJummahSchedule(r).isValid;
      return valid && isScheduleCurrent(r, targetDate);
    });

    return current || null;
  }

  async getAllVerifiedJummah(targetDate?: string): Promise<JummahSchedule[]> {
    const list = await this.getJummahList();
    const conflicts = detectJummahConflicts(list, targetDate);
    const conflictingMosqueIds = new Set(conflicts.map((c) => c.mosqueId));

    return list.filter((r) => {
      if (conflictingMosqueIds.has(r.mosqueId)) return false;
      const valid = validateJummahSchedule(r).isValid;
      return valid && isScheduleCurrent(r, targetDate);
    });
  }

  // -------------------------------------------------------------
  // Quality Metrics
  // -------------------------------------------------------------

  async getQualityMetrics(targetDate?: string): Promise<ScheduleQualityMetrics> {
    const iqamah = await this.getIqamahList();
    const jummah = await this.getJummahList();

    const iqamahConflicts = detectIqamahConflicts(iqamah, targetDate);
    const jummahConflicts = detectJummahConflicts(jummah, targetDate);

    const verifiedIqamah = iqamah.filter((r) => r.verification.status === "VERIFIED");
    const verifiedJummah = jummah.filter((r) => r.verification.status === "VERIFIED");

    const currentIqamah = iqamah.filter((r) => isScheduleCurrent(r, targetDate));
    const currentJummah = jummah.filter((r) => isScheduleCurrent(r, targetDate));

    const iqamahMosques = new Set(currentIqamah.map((r) => r.mosqueId));
    const jummahMosques = new Set(currentJummah.map((r) => r.mosqueId));

    return {
      totalIqamahRecords: iqamah.length,
      verifiedIqamahRecords: verifiedIqamah.length,
      pendingIqamahRecords: iqamah.filter((r) => r.verification.status === "PENDING_REVIEW").length,
      expiredIqamahRecords: iqamah.filter((r) => r.verification.status === "EXPIRED").length,
      revokedIqamahRecords: iqamah.filter((r) => r.verification.status === "REVOKED").length,
      currentIqamahRecords: currentIqamah.length,
      iqamahWithoutSource: iqamah.filter((r) => !r.source?.sourceName).length,
      iqamahExpiringSoon: iqamah.filter((r) => isScheduleExpiringSoon(r, targetDate)).length,

      totalJummahRecords: jummah.length,
      verifiedJummahRecords: verifiedJummah.length,
      pendingJummahRecords: jummah.filter((r) => r.verification.status === "PENDING_REVIEW").length,
      expiredJummahRecords: jummah.filter((r) => r.verification.status === "EXPIRED").length,
      revokedJummahRecords: jummah.filter((r) => r.verification.status === "REVOKED").length,
      currentJummahRecords: currentJummah.length,
      jummahWithoutSource: jummah.filter((r) => !r.source?.sourceName).length,
      jummahExpiringSoon: jummah.filter((r) => isScheduleExpiringSoon(r, targetDate)).length,

      conflictingSchedulesCount: iqamahConflicts.length + jummahConflicts.length,
      mosquesWithVerifiedIqamah: iqamahMosques.size,
      mosquesWithVerifiedJummah: jummahMosques.size,
      jummahLocationsWithVerifiedSchedule: 0,
    };
  }
}

export const defaultScheduleRepository = new ScheduleRepository();
