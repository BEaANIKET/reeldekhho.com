import { User } from 'lucide-react';

// const suggestions = [
//   {
//     id: 1,
//     username: 'photography_lover',
//     avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
//     relation: 'Followed by user1 + 3 more'
//   },
//   {
//     id: 2,
//     username: 'travel_adventures',
//     avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop',
//     relation: 'Followed by user2 + 1 more'
//   },
//   {
//     id: 3,
//     username: 'foodie_chronicles',
//     avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
//     relation: 'New to Instagram'
//   }
// ];

export default function Suggestions() {
  return (
    <div className="p-4 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <User className="w-8 h-8 dark:text-white" />
          <div>
            <h2 className="font-semibold dark:text-white">Welcome to Reeldekho</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Discover people to follow</p>
          </div>
        </div>
      </div>

      {/* <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={suggestion.avatar}
                alt={suggestion.username}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-semibold text-sm dark:text-white">{suggestion.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.relation}</p>
              </div>
            </div>
            <button className="text-blue-500 text-sm font-semibold hover:text-blue-700">
              Follow
            </button>
          </div>
        ))}
      </div> */}
      
    </div>
  );
}