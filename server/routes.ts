import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertDietPlanSchema,
  insertUserWorkoutSchema,
  insertUserProgressSchema,
  insertGoalSchema,
  insertChatMessageSchema,
  updateUserProfileSchema,
} from "@shared/schema";
import { nanoid } from "nanoid";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "sk-fake-key-for-testing"
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.patch('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = updateUserProfileSchema.parse(req.body);
      const updatedUser = await storage.updateUserProfile(userId, profileData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // AI Diet Plan Generation
  app.post('/api/diet/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { age, weight, fitnessGoal, allergies } = req.body;

      const prompt = `Create a personalized weekly meal plan for a ${age}-year-old person weighing ${weight}kg with a fitness goal of ${fitnessGoal}. ${allergies ? `They have the following allergies/restrictions: ${allergies}` : ''}

Please provide a JSON response with the following structure:
{
  "dailyCalories": number,
  "proteinGoal": number,
  "carbGoal": number,
  "fatGoal": number,
  "meals": [
    {
      "day": "Monday",
      "breakfast": "meal description",
      "lunch": "meal description",
      "dinner": "meal description",
      "snacks": ["snack1", "snack2"]
    },
    ... (for all 7 days)
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional nutritionist. Create personalized meal plans based on user goals and restrictions. Respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      const aiResponse = JSON.parse(response.choices[0].message.content || '{}');
      
      // Save diet plan to storage
      const dietPlan = await storage.createDietPlan({
        userId,
        weekNumber: 1,
        dailyCalories: aiResponse.dailyCalories,
        proteinGoal: aiResponse.proteinGoal,
        carbGoal: aiResponse.carbGoal,
        fatGoal: aiResponse.fatGoal,
        meals: aiResponse.meals,
        isActive: true,
      });

      res.json(dietPlan);
    } catch (error) {
      console.error("Error generating diet plan:", error);
      res.status(500).json({ message: "Failed to generate diet plan" });
    }
  });

  // Get user's diet plans
  app.get('/api/diet/plans', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const dietPlans = await storage.getUserDietPlans(userId);
      res.json(dietPlans);
    } catch (error) {
      console.error("Error fetching diet plans:", error);
      res.status(500).json({ message: "Failed to fetch diet plans" });
    }
  });

  // Get active diet plan
  app.get('/api/diet/active', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const activePlan = await storage.getActiveDietPlan(userId);
      res.json(activePlan);
    } catch (error) {
      console.error("Error fetching active diet plan:", error);
      res.status(500).json({ message: "Failed to fetch active diet plan" });
    }
  });

  // Workouts routes
  app.get('/api/workouts', async (req, res) => {
    try {
      const { category } = req.query;
      let workouts;
      
      if (category && category !== 'all') {
        workouts = await storage.getWorkoutsByCategory(category as string);
      } else {
        workouts = await storage.getAllWorkouts();
      }
      
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.get('/api/workouts/:id', async (req, res) => {
    try {
      const workout = await storage.getWorkout(req.params.id);
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.json(workout);
    } catch (error) {
      console.error("Error fetching workout:", error);
      res.status(500).json({ message: "Failed to fetch workout" });
    }
  });

  // Log workout completion
  app.post('/api/workouts/log', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workoutData = insertUserWorkoutSchema.parse(req.body);
      
      const userWorkout = await storage.logWorkout({
        ...workoutData,
        userId,
      });

      // Check for achievements based on workout completion
      const userWorkouts = await storage.getUserWorkouts(userId);
      const totalWorkouts = userWorkouts.length;
      
      // Award achievements for milestones
      if (totalWorkouts === 5) {
        await storage.createAchievement({
          userId,
          badgeId: "cardio_king",
          title: "Cardio King",
          description: "Complete 5 cardio sessions",
          icon: "🏃‍♀️"
        });
      } else if (totalWorkouts === 10) {
        await storage.createAchievement({
          userId,
          badgeId: "strength_warrior",
          title: "Strength Warrior",
          description: "Complete 10 strength workouts",
          icon: "💪"
        });
      }

      res.json(userWorkout);
    } catch (error) {
      console.error("Error logging workout:", error);
      res.status(500).json({ message: "Failed to log workout" });
    }
  });

  // Get user workout history
  app.get('/api/workouts/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workouts = await storage.getUserWorkouts(userId);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching workout history:", error);
      res.status(500).json({ message: "Failed to fetch workout history" });
    }
  });

  // Get user workout stats
  app.get('/api/workouts/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserWorkoutStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching workout stats:", error);
      res.status(500).json({ message: "Failed to fetch workout stats" });
    }
  });

  // Progress tracking
  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progressData = insertUserProgressSchema.parse(req.body);
      
      const progress = await storage.logProgress({
        ...progressData,
        userId,
      });

      res.json(progress);
    } catch (error) {
      console.error("Error logging progress:", error);
      res.status(500).json({ message: "Failed to log progress" });
    }
  });

  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { days } = req.query;
      const progress = await storage.getUserProgress(userId, days ? parseInt(days as string) : 30);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Goals management
  app.post('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goalData = insertGoalSchema.parse(req.body);
      
      const goal = await storage.createGoal({
        ...goalData,
        userId,
      });

      res.json(goal);
    } catch (error) {
      console.error("Error creating goal:", error);
      res.status(500).json({ message: "Failed to create goal" });
    }
  });

  app.get('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goals = await storage.getUserGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.patch('/api/goals/:id', isAuthenticated, async (req, res) => {
    try {
      const updates = req.body;
      const goal = await storage.updateGoal(req.params.id, updates);
      res.json(goal);
    } catch (error) {
      console.error("Error updating goal:", error);
      res.status(500).json({ message: "Failed to update goal" });
    }
  });

  // Achievements
  app.get('/api/achievements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // AI Chatbot
  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message } = insertChatMessageSchema.parse(req.body);

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are FitBot AI, a helpful fitness coach and nutritionist. Provide friendly, motivational, and accurate advice about fitness, nutrition, and mental health. Keep responses concise but informative. Use emojis appropriately to make the conversation engaging."
          },
          {
            role: "user",
            content: message
          }
        ],
      });

      const aiResponse = response.choices[0].message.content || "I'm sorry, I couldn't process that. Please try again.";

      // Save chat message to storage
      const chatMessage = await storage.saveChatMessage({
        userId,
        message,
        response: aiResponse,
      });

      res.json({ response: aiResponse, messageId: chatMessage.id });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get('/api/chat/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { limit } = req.query;
      const history = await storage.getUserChatHistory(userId, limit ? parseInt(limit as string) : 50);
      res.json(history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
