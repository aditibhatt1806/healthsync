// frontend/src/utils/xpHelpers.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  orderBy,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase/config";


/**
 * XP reward amounts for different actions
 */
export const XP_REWARDS = {
  MEDICATION_TAKEN: 10,
  MEDICATION_ADDED: 15,
  SYMPTOM_LOGGED: 5,
  PRESCRIPTION_UPLOADED: 15,
  PROFILE_COMPLETED: 50,
  DAILY_STREAK: 25,
  WEEKLY_STREAK: 100,
  MONTHLY_STREAK: 500,
  ACHIEVEMENT_UNLOCKED: 50,
  REPORT_VIEWED: 5,
  PERFECT_DAY: 50,
  PERFECT_WEEK: 200,
} as const;

/**
 * Level thresholds based on total XP
 */
export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 100 },
  { level: 3, xp: 250 },
  { level: 4, xp: 500 },
  { level: 5, xp: 1000 },
  { level: 6, xp: 1750 },
  { level: 7, xp: 2500 },
  { level: 8, xp: 3500 },
  { level: 9, xp: 5000 },
  { level: 10, xp: 7000 },
  { level: 11, xp: 10000 },
  { level: 12, xp: 15000 },
  { level: 13, xp: 20000 },
  { level: 14, xp: 30000 },
  { level: 15, xp: 50000 },
];

/**
 * Calculate user level based on XP
 */
export function calculateLevel(xp: number) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) return LEVEL_THRESHOLDS[i].level;
  }
  return 1;
}

/**
 * Award XP to a user
 */
export async function awardXP(userId: string, points: number, reason: string) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("User not found");

  const currentXP = userSnap.data()?.xp || 0;
  const newXP = currentXP + points;

  const previousLevel = calculateLevel(currentXP);
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > previousLevel;

  // Update user XP
  await updateDoc(userRef, {
    xp: newXP,
    updatedAt: Timestamp.now(),
  });

  // Log XP transaction
  await addDoc(collection(db, "xp_history"), {
    userId,
    points,
    reason,
    previousXP: currentXP,
    newXP,
    previousLevel,
    newLevel,
    timestamp: Timestamp.now(),
  });

  return { newXP, newLevel, leveledUp, previousLevel };
}

/**
 * XP for next level
 */
export function getXPForNextLevel(currentXP: number) {
  const currentLevel = calculateLevel(currentXP);
  const nextLevelThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel + 1);
  if (!nextLevelThreshold)
    return {
      currentLevel,
      nextLevel: currentLevel,
      xpNeeded: 0,
      xpProgress: 0,
      progressPercentage: 100,
    };

  const currentLevelThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel)!;
  const xpForThisLevel = currentXP - currentLevelThreshold.xp;
  const xpNeededForNextLevel = nextLevelThreshold.xp - currentLevelThreshold.xp;
  const progressPercentage = (xpForThisLevel / xpNeededForNextLevel) * 100;

  return {
    currentLevel,
    nextLevel: nextLevelThreshold.level,
    xpNeeded: nextLevelThreshold.xp - currentXP,
    xpProgress: xpForThisLevel,
    progressPercentage: Math.round(progressPercentage),
  };
}

/**
 * Get streak multiplier
 */
export function getStreakMultiplier(streakDays: number) {
  if (streakDays >= 30) return 2.0;
  if (streakDays >= 21) return 1.75;
  if (streakDays >= 14) return 1.5;
  if (streakDays >= 7) return 1.25;
  return 1.0;
}

/**
 * Award XP with streak multiplier
 */
export async function awardXPWithMultiplier(
  userId: string,
  basePoints: number,
  reason: string,
  streakDays: number
) {
  const multiplier = getStreakMultiplier(streakDays);
  const totalXP = Math.round(basePoints * multiplier);
  const result = await awardXP(userId, totalXP, reason);

  return {
    baseXP: basePoints,
    multiplier,
    totalXP,
    newXP: result.newXP,
    newLevel: result.newLevel,
    leveledUp: result.leveledUp,
  };
}

/**
 * Get XP breakdown for last N days
 */
export async function getXPBreakdown(userId: string, days: number = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const historyQuery = query(
    collection(db, "xp_history"),
    where("userId", "==", userId),
    where("timestamp", ">=", startDate),
    orderBy("timestamp", "asc")
  );

  const snapshot = await getDocs(historyQuery);
  const dailyXP = new Map<string, { xp: number; transactions: number }>();

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const timestamp = data.timestamp?.toDate();
    if (!timestamp) return;
    const dateKey = timestamp.toDateString();
    const current = dailyXP.get(dateKey) || { xp: 0, transactions: 0 };
    current.xp += data.points || 0;
    current.transactions++;
    dailyXP.set(dateKey, current);
  });

  const breakdown = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toDateString();
    const data = dailyXP.get(key) || { xp: 0, transactions: 0 };
    breakdown.push({ date: key, xp: data.xp, transactions: data.transactions });
  }

  return breakdown;
}
