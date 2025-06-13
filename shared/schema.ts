import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique(),
  password: varchar("password"),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Fitness profile
  age: integer("age"),
  weight: varchar("weight"),
  height: varchar("height"),
  fitnessGoal: varchar("fitness_goal"), // weight_loss, muscle_gain, maintenance, athletic_performance
  activityLevel: varchar("activity_level"), // sedentary, lightly_active, moderately_active, very_active
  allergies: text("allergies"),
  dietaryRestrictions: text("dietary_restrictions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dietPlans = pgTable("diet_plans", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  weekNumber: integer("week_number").notNull(),
  dailyCalories: integer("daily_calories"),
  proteinGoal: integer("protein_goal"),
  carbGoal: integer("carb_goal"),
  fatGoal: integer("fat_goal"),
  meals: jsonb("meals").notNull(), // Array of meal objects
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // beginner, intermediate, advanced
  type: varchar("type").notNull(), // cardio, strength, yoga, hiit, etc.
  duration: integer("duration").notNull(), // in minutes
  caloriesBurned: integer("calories_burned"),
  videoUrl: varchar("video_url"),
  imageUrl: varchar("image_url"),
  exercises: jsonb("exercises").notNull(), // Array of exercise objects
  createdAt: timestamp("created_at").defaultNow(),
});

export const userWorkouts = pgTable("user_workouts", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  workoutId: varchar("workout_id").references(() => workouts.id).notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
  duration: integer("duration"), // actual duration in minutes
  caloriesBurned: integer("calories_burned"),
  mood: varchar("mood"), // energetic, happy, motivated, tired
  notes: text("notes"),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow(),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  caloriesConsumed: integer("calories_consumed"),
  caloriesBurned: integer("calories_burned"),
  waterIntake: decimal("water_intake", { precision: 4, scale: 1 }), // in liters
  mood: varchar("mood"),
  energyLevel: integer("energy_level"), // 1-10 scale
});

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // workout_count, calories_burned, weight_loss, etc.
  title: varchar("title").notNull(),
  description: text("description"),
  targetValue: integer("target_value"),
  currentValue: integer("current_value").default(0),
  targetDate: timestamp("target_date"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  badgeId: varchar("badge_id").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  response: text("response"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertDietPlan = typeof dietPlans.$inferInsert;
export type DietPlan = typeof dietPlans.$inferSelect;

export type InsertWorkout = typeof workouts.$inferInsert;
export type Workout = typeof workouts.$inferSelect;

export type InsertUserWorkout = typeof userWorkouts.$inferInsert;
export type UserWorkout = typeof userWorkouts.$inferSelect;

export type InsertUserProgress = typeof userProgress.$inferInsert;
export type UserProgress = typeof userProgress.$inferSelect;

export type InsertGoal = typeof goals.$inferInsert;
export type Goal = typeof goals.$inferSelect;

export type InsertAchievement = typeof achievements.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;

export type InsertChatMessage = typeof chatMessages.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Zod schemas for validation
export const insertDietPlanSchema = createInsertSchema(dietPlans).omit({
  id: true,
  createdAt: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
});

export const insertUserWorkoutSchema = createInsertSchema(userWorkouts).omit({
  id: true,
  completedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  date: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
  currentValue: true,
  isCompleted: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
  response: true,
});

export const updateUserProfileSchema = z.object({
  age: z.number().min(13).max(120).optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  fitnessGoal: z.enum(['weight_loss', 'muscle_gain', 'maintenance', 'athletic_performance']).optional(),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active']).optional(),
  allergies: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
});
