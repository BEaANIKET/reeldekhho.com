// Simulated API service
export async function sendMessage(chatId: string, content: string): Promise<{
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: Date.now().toString(),
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    senderId: 'currentUser'
  };
}