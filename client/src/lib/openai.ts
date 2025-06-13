// OpenAI integration utilities for client-side API calls

export async function generateDietPlan(userProfile: {
  age: number;
  weight: number;
  fitnessGoal: string;
  allergies?: string;
}) {
  const response = await fetch('/api/diet/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userProfile),
  });

  if (!response.ok) {
    throw new Error(`Diet plan generation failed: ${response.statusText}`);
  }

  return response.json();
}

export async function sendChatMessage(message: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`Chat message failed: ${response.statusText}`);
  }

  return response.json();
}

export async function getChatHistory(limit?: number) {
  const url = limit ? `/api/chat/history?limit=${limit}` : '/api/chat/history';
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chat history: ${response.statusText}`);
  }

  return response.json();
}
