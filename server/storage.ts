import {
  users,
  dietPlans,
  workouts,
  userWorkouts,
  userProgress,
  goals,
  achievements,
  chatMessages,
  type User,
  type UpsertUser,
  type DietPlan,
  type InsertDietPlan,
  type Workout,
  type InsertWorkout,
  type UserWorkout,
  type InsertUserWorkout,
  type UserProgress,
  type InsertUserProgress,
  type Goal,
  type InsertGoal,
  type Achievement,
  type InsertAchievement,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { nanoid } from "nanoid";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(userId: string, profile: Partial<User>): Promise<User>;
  
  // Diet plan operations
  createDietPlan(dietPlan: Omit<InsertDietPlan, 'id'>): Promise<DietPlan>;
  getUserDietPlans(userId: string): Promise<DietPlan[]>;
  getActiveDietPlan(userId: string): Promise<DietPlan | undefined>;
  
  // Workout operations
  getAllWorkouts(): Promise<Workout[]>;
  getWorkoutsByCategory(category: string): Promise<Workout[]>;
  getWorkout(id: string): Promise<Workout | undefined>;
  
  // User workout tracking
  logWorkout(userWorkout: Omit<InsertUserWorkout, 'id'>): Promise<UserWorkout>;
  getUserWorkouts(userId: string): Promise<UserWorkout[]>;
  getUserWorkoutStats(userId: string): Promise<any>;
  
  // Progress tracking
  logProgress(progress: Omit<InsertUserProgress, 'id'>): Promise<UserProgress>;
  getUserProgress(userId: string, days?: number): Promise<UserProgress[]>;
  
  // Goals
  createGoal(goal: Omit<InsertGoal, 'id'>): Promise<Goal>;
  getUserGoals(userId: string): Promise<Goal[]>;
  updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal>;
  
  // Achievements
  createAchievement(achievement: Omit<InsertAchievement, 'id'>): Promise<Achievement>;
  getUserAchievements(userId: string): Promise<Achievement[]>;
  
  // Chat messages
  saveChatMessage(message: Omit<InsertChatMessage, 'id'>): Promise<ChatMessage>;
  getUserChatHistory(userId: string, limit?: number): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private dietPlans: Map<string, DietPlan> = new Map();
  private workouts: Map<string, Workout> = new Map();
  private userWorkouts: Map<string, UserWorkout> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private goals: Map<string, Goal> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private chatMessages: Map<string, ChatMessage> = new Map();

  constructor() {
    this.initializeDefaultWorkouts();
  }

  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      id: userData.id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      age: userData.age || null,
      weight: userData.weight || null,
      height: userData.height || null,
      fitnessGoal: userData.fitnessGoal || null,
      activityLevel: userData.activityLevel || null,
      allergies: userData.allergies || null,
      dietaryRestrictions: userData.dietaryRestrictions || null,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async updateUserProfile(userId: string, profile: Partial<User>): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, ...profile, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Diet plan operations
  async createDietPlan(dietPlanData: Omit<InsertDietPlan, 'id'>): Promise<DietPlan> {
    const id = nanoid();
    const dietPlan: DietPlan = {
      id,
      createdAt: new Date(),
      userId: dietPlanData.userId,
      weekNumber: dietPlanData.weekNumber,
      dailyCalories: dietPlanData.dailyCalories || null,
      proteinGoal: dietPlanData.proteinGoal || null,
      carbGoal: dietPlanData.carbGoal || null,
      fatGoal: dietPlanData.fatGoal || null,
      meals: dietPlanData.meals || [],
      isActive: dietPlanData.isActive ?? null,
    };
    this.dietPlans.set(id, dietPlan);
    return dietPlan;
  }

  async getUserDietPlans(userId: string): Promise<DietPlan[]> {
    return Array.from(this.dietPlans.values()).filter(plan => plan.userId === userId);
  }

  async getActiveDietPlan(userId: string): Promise<DietPlan | undefined> {
    return Array.from(this.dietPlans.values()).find(
      plan => plan.userId === userId && plan.isActive
    );
  }

  // Workout operations
  async getAllWorkouts(): Promise<Workout[]> {
    return Array.from(this.workouts.values());
  }

  async getWorkoutsByCategory(category: string): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(workout => workout.category === category);
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  // User workout tracking
  async logWorkout(userWorkoutData: Omit<InsertUserWorkout, 'id'>): Promise<UserWorkout> {
    const id = nanoid();
    const userWorkout: UserWorkout = {
      id,
      userId: userWorkoutData.userId,
      workoutId: userWorkoutData.workoutId,
      duration: userWorkoutData.duration || null,
      caloriesBurned: userWorkoutData.caloriesBurned || null,
      completedAt: new Date(),
      mood: userWorkoutData.mood || null,
      notes: userWorkoutData.notes || null,
    };
    this.userWorkouts.set(id, userWorkout);
    return userWorkout;
  }

  async getUserWorkouts(userId: string): Promise<UserWorkout[]> {
    return Array.from(this.userWorkouts.values()).filter(workout => workout.userId === userId);
  }

  async getUserWorkoutStats(userId: string): Promise<any> {
    const userWorkouts = await this.getUserWorkouts(userId);
    const totalWorkouts = userWorkouts.length;
    const totalCalories = userWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const totalMinutes = userWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    
    return {
      totalWorkouts,
      totalCalories,
      totalMinutes,
      avgCaloriesPerWorkout: totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0,
    };
  }

  // Progress tracking
  async logProgress(progressData: Omit<InsertUserProgress, 'id'>): Promise<UserProgress> {
    const id = nanoid();
    const progress: UserProgress = {
      id,
      userId: progressData.userId,
      date: new Date(),
      weight: progressData.weight || null,
      caloriesBurned: progressData.caloriesBurned || null,
      caloriesConsumed: progressData.caloriesConsumed || null,
      waterIntake: progressData.waterIntake || null,
      mood: progressData.mood || null,
      energyLevel: progressData.energyLevel || null,
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async getUserProgress(userId: string, days: number = 30): Promise<UserProgress[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.userProgress.values())
      .filter(progress => 
        progress.userId === userId && 
        new Date(progress.date!) >= cutoffDate
      )
      .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
  }

  // Goals
  async createGoal(goalData: Omit<InsertGoal, 'id'>): Promise<Goal> {
    const id = nanoid();
    const goal: Goal = {
      id,
      userId: goalData.userId,
      type: goalData.type,
      title: goalData.title,
      description: goalData.description || null,
      targetValue: goalData.targetValue || null,
      currentValue: 0,
      targetDate: goalData.targetDate || null,
      isCompleted: false,
      createdAt: new Date(),
    };
    this.goals.set(id, goal);
    return goal;
  }

  async getUserGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<Goal> {
    const goal = this.goals.get(goalId);
    if (!goal) throw new Error('Goal not found');
    
    const updatedGoal = { ...goal, ...updates };
    this.goals.set(goalId, updatedGoal);
    return updatedGoal;
  }

  // Achievements
  async createAchievement(achievementData: Omit<InsertAchievement, 'id'>): Promise<Achievement> {
    const id = nanoid();
    const achievement: Achievement = {
      id,
      userId: achievementData.userId,
      badgeId: achievementData.badgeId,
      title: achievementData.title,
      description: achievementData.description || null,
      icon: achievementData.icon || null,
      earnedAt: new Date(),
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(achievement => achievement.userId === userId);
  }

  // Chat messages
  async saveChatMessage(messageData: Omit<InsertChatMessage, 'id'>): Promise<ChatMessage> {
    const id = nanoid();
    const message: ChatMessage = {
      id,
      userId: messageData.userId,
      message: messageData.message,
      response: messageData.response ?? null,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getUserChatHistory(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
      .slice(0, limit);
  }

  // Initialize default workouts
  private initializeDefaultWorkouts() {
    const defaultWorkouts: Omit<Workout, 'id' | 'createdAt'>[] = [
      {
        name: "Full Body Cardio Blast",
        description: "Get your heart pumping with this energizing cardio session",
        category: "beginner",
        type: "cardio",
        duration: 20,
        caloriesBurned: 250,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        exercises: [
          { name: "Jumping Jacks", duration: 60, reps: null },
          { name: "High Knees", duration: 45, reps: null },
          { name: "Burpees", duration: 30, reps: 10 },
          { name: "Mountain Climbers", duration: 45, reps: null }
        ]
      },
      {
        name: "Upper Body Strength",
        description: "Build lean muscle with targeted resistance exercises",
        category: "intermediate",
        type: "strength",
        duration: 35,
        caloriesBurned: 180,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        exercises: [
          { name: "Push-ups", duration: null, reps: 15 },
          { name: "Dumbbell Rows", duration: null, reps: 12 },
          { name: "Shoulder Press", duration: null, reps: 10 },
          { name: "Tricep Dips", duration: null, reps: 12 }
        ]
      },
      {
        name: "Extreme HIIT Challenge",
        description: "Push your limits with high-intensity intervals",
        category: "advanced",
        type: "hiit",
        duration: 45,
        caloriesBurned: 400,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        exercises: [
          { name: "Sprint Intervals", duration: 30, reps: null },
          { name: "Burpee Box Jumps", duration: 45, reps: null },
          { name: "Battle Ropes", duration: 60, reps: null },
          { name: "Kettlebell Swings", duration: 40, reps: null }
        ]
      },
      {
        name: "Yoga & Flexibility",
        description: "Improve flexibility and find inner peace",
        category: "beginner",
        type: "yoga",
        duration: 25,
        caloriesBurned: 120,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        imageUrl: "https://pixabay.com/get/g56936fcb87974afbb6df0bb5b904bd5dc40fbe3f5789329ac727c5fca1c93b1fb1110bd02a9e779daccfceb94d05a6942d2a6c151fda280fad86486c657d69cc_1280.jpg",
        exercises: [
          { name: "Sun Salutation", duration: 300, reps: null },
          { name: "Warrior Poses", duration: 180, reps: null },
          { name: "Tree Pose", duration: 60, reps: null },
          { name: "Savasana", duration: 240, reps: null }
        ]
      },
      {
        name: "Core Destroyer",
        description: "Strengthen your core with targeted exercises",
        category: "intermediate",
        type: "strength",
        duration: 30,
        caloriesBurned: 200,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        exercises: [
          { name: "Plank", duration: 60, reps: null },
          { name: "Russian Twists", duration: null, reps: 20 },
          { name: "Dead Bug", duration: null, reps: 15 },
          { name: "Bicycle Crunches", duration: null, reps: 25 }
        ]
      },
      {
        name: "CrossFit Mayhem",
        description: "Ultimate functional fitness challenge",
        category: "advanced",
        type: "crossfit",
        duration: 50,
        caloriesBurned: 450,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
        exercises: [
          { name: "Thrusters", duration: null, reps: 21 },
          { name: "Pull-ups", duration: null, reps: 15 },
          { name: "Box Jumps", duration: null, reps: 9 },
          { name: "Deadlifts", duration: null, reps: 12 }
        ]
      }
    ];

    defaultWorkouts.forEach(workout => {
      const id = nanoid();
      this.workouts.set(id, {
        ...workout,
        id,
        createdAt: new Date(),
      });
    });
  }
}

export const storage = new MemStorage();
