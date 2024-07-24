import { BodyPart, Exercise } from "@prisma/client";

// ループ用 英語を日本語へ変換（部位）
export const bodyParts: { [key in BodyPart]: string } = {
  CHEST: "胸",
  BACK: "背中",
  LEGS: "脚",
  SHOULDERS: "肩",
  ARMS: "腕",
};

// ループ用 種目を各部位に分類
export const exercises: { [key in BodyPart]: Exercise[] } = {
  CHEST: [
    "BENCH_PRESS",
    "CHEST_PRESS",
    "DUMBBELL_FLY",
    "DUMBBELL_PRESS",
    "INCLINE_DUMBBELL_PRESS",
    "PEC_FLY",
  ],
  BACK: ["LAT_PULLDOWN", "DEADLIFT", "CHINNING"],
  LEGS: ["SQUAT", "LEG_PRESS", "LEG_EXTENSION", "LEG_CURL"],
  SHOULDERS: ["SIDE_RAISE", "SHOULDER_PRESS", "FRONT_RAISE"],
  ARMS: ["ARM_CURL"],
};

// ループ用 英語を日本語へ変換（種目）
export const exerciseNames: { [key in Exercise]: string } = {
  BENCH_PRESS: "ベンチプレス",
  CHEST_PRESS: "チェストプレス",
  DUMBBELL_FLY: "ダンベルフライ",
  DUMBBELL_PRESS: "ダンベルプレス",
  INCLINE_DUMBBELL_PRESS: "インクラインダンベルプレス",
  PEC_FLY: "ペクトラルフライ",
  LAT_PULLDOWN: "ラットプルダウン",
  DEADLIFT: "デッドリフト",
  CHINNING: "チンニング",
  SQUAT: "スクワット",
  LEG_PRESS: "レッグプレス",
  LEG_EXTENSION: "レッグエクステンション",
  LEG_CURL: "レッグカール",
  SIDE_RAISE: "サイドレイズ",
  SHOULDER_PRESS: "ショルダープレス",
  FRONT_RAISE: "フロントレイズ",
  ARM_CURL: "アームカール",
};
