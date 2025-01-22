export const chats = [
    {
        id: '1',
        username: 'johndoe',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
        lastMessage: 'Hey, how are you?',
        timestamp: '2m ago',
        unread: true
    },
    {
        id: '2',
        username: 'janedoe',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        lastMessage: 'The project looks great!',
        timestamp: '1h ago',
        unread: false
    },
    {
        id: '3',
        username: 'mike_smith',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop',
        lastMessage: 'See you tomorrow!',
        timestamp: '3h ago',
        unread: true
    }
];

export const messages: Record<string, Array<{
    id: string;
    content: string;
    timestamp: string;
    senderId: string;
}>> = {
    '1': [
        {
            id: '1',
            content: 'Hey, how are you?',
            timestamp: '2:30 PM',
            senderId: 'user1'
        },
        {
            id: '2',
            content: 'I\'m good, thanks! How about you?',
            timestamp: '2:31 PM',
            senderId: 'currentUser'
        },
        {
            id: '3',
            content: 'Pretty good! Working on some new projects.',
            timestamp: '2:32 PM',
            senderId: 'user1'
        }
    ]
};