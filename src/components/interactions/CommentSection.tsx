import { useState } from 'react';
import { Send } from 'lucide-react';

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId, createComment, loader, setLoader }: CommentSectionProps) {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(comment);
    setLoader((prev) => ({ ...prev, addLoader: true }));
    await createComment(comment)
    setComment('');
    setLoader((prev) => ({ ...prev, addLoader: false }));
  };

  return (
    <div className="mt-4 border-t dark:border-gray-700 pt-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 dark:text-white placeholder-gray-500"
        />
        <button
          disable={loader.addLoader}
          type="submit"
          disabled={!comment.trim()}
          className="text-blue-500 font-semibold disabled:opacity-50"
        >
          {
            loader.addLoader ? <div className=' relative bg-red-500 '>
              <div className="h-6 w-6 absolute right-[-10px] top-[-11px] rounded-full border-4 border-white border-t-transparent animate-spin"></div>
            </div> : <Send className="w-5 h-5" />
          }


        </button>
      </form>
    </div>
  );
}