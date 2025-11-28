// frontend/src/utils/calculateStreak.ts
import { collection, doc, getDoc, updateDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase/config";


/**
 * Calculate and update user's medication adherence streak
 */
export async function calculateStreak(userId: string) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) throw new Error("User not found");

  const userData = userSnap.data();
  let currentStreak = userData.streak || 0;
  let bestStreak = userData.bestStreak || 0;
  const lastActive = userData.lastActive?.toDate?.() || null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  let streakContinued = false;
  let streakBroken = false;

  if (lastActive) {
    const lastStr = lastActive.toDateString();
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();

    if (lastStr === todayStr) return { currentStreak, bestStreak, streakContinued: false, streakBroken: false };

    if (lastStr === yesterdayStr) {
      currentStreak += 1;
      streakContinued = true;
      if (currentStreak > bestStreak) bestStreak = currentStreak;
    } else {
      currentStreak = 1;
      streakBroken = true;
    }
  } else {
    currentStreak = 1;
  }

  await updateDoc(userRef, {
    streak: currentStreak,
    bestStreak,
    lastActive: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return { currentStreak, bestStreak, streakContinued, streakBroken };
}

/**
 * Check today's adherence
 */
export async function checkTodayAdherence(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const medsQuery = query(
    collection(db, "medications"),
    where("userId", "==", userId),
    where("frequency", "in", ["daily", "asNeeded"])
  );

  const medsSnapshot = await getDocs(medsQuery);

  let takenMedications = 0;

  medsSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const lastTaken: Timestamp = data.lastTaken;
    if (lastTaken?.toDate() >= today && lastTaken?.toDate() < tomorrow) {
      takenMedications++;
    }
  });

  const totalMedications = medsSnapshot.size;
  const adherenceRate = totalMedications ? Math.round((takenMedications / totalMedications) * 100) : 100;

  return {
    allMedicationsTaken: takenMedications === totalMedications && totalMedications > 0,
    totalMedications,
    takenMedications,
    adherenceRate,
  };
}

/**
 * Streak milestones
 */
export function getStreakMilestone(streak: number) {
  const milestones = [7, 14, 21, 30, 50, 100, 365];
  const isMilestone = milestones.includes(streak);
  const nextMilestone = milestones.find((m) => m > streak) || 999;
  const milestone = milestones.find((m) => m <= streak) || 0;

  const achievementNames: { [key: number]: string } = {
    7: "🔥 Week Warrior",
    14: "💪 Two Week Champion",
    21: "🌟 Three Week Hero",
    30: "🏆 Monthly Master",
    50: "🎖️ Dedication Medal",
    100: "👑 Century Champion",
    365: "🥇 Year-Long Legend",
  };

  return { milestone, nextMilestone, isMilestone, achievementName: isMilestone ? achievementNames[streak] : null };
}

/**
 * Reset streak
 */
export async function resetStreak(userId: string) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    streak: 0,
    lastActive: null,
    updatedAt: Timestamp.now(),
  });
}
