-- CreateEnum
CREATE TYPE "BodyPart" AS ENUM ('CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS');

-- CreateEnum
CREATE TYPE "Exercise" AS ENUM ('BENCH_PRESS', 'CHEST_PRESS', 'DUMBBELL_FLY', 'DUMBBELL_PRESS', 'INCLINE_DUMBBELL_PRESS', 'PEC_FLY', 'LAT_PULLDOWN', 'DEADLIFT', 'CHINNING', 'SQUAT', 'LEG_PRESS', 'LEG_EXTENSION', 'LEG_CURL', 'SIDE_RAISE', 'SHOULDER_PRESS', 'FRONT_RAISE', 'ARM_CURL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "auth_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT DEFAULT 'ゲスト',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseEntry" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "bodyPart" "BodyPart" NOT NULL,
    "exercise" "Exercise" NOT NULL,
    "weight" INTEGER NOT NULL,
    "repetitions" INTEGER NOT NULL,

    CONSTRAINT "ExerciseEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_auth_id_key" ON "User"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseEntry" ADD CONSTRAINT "ExerciseEntry_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
