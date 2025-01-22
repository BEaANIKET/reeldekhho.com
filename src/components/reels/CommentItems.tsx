import { BiDotsVertical } from 'react-icons/bi';

interface CommentItemProps {
    comment: any;
    onDelete: (id: number) => void;
    showPopup: any;
    setShowPopup: React.Dispatch<React.SetStateAction<any>>;
    loader: { removeLoader: boolean };
}

export default function CommentItem({ comment, onDelete, showPopup, setShowPopup, loader }: CommentItemProps) {
    return (
        <div className="flex items-start space-x-4 mb-2">
            <img
                src={comment.user.profilePicture}
                alt={comment.user.fullName}
                className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-grow flex flex-col">
                <p className="font-semibold dark:text-white">{comment.user.fullName}</p>
                <p className="dark:text-white">{comment.text}</p>
            </div>

            <div className="relative">
                <BiDotsVertical
                    className="dark:text-white text-black text-lg cursor-pointer"
                    onClick={() => setShowPopup((prev) => (prev === comment._id ? false : comment._id))}
                />
                {showPopup === comment._id && (
                    <div className="absolute top-full right-[21px] mt-[-24px] rounded-sm">
                        <p
                            className="text-white font-semibold rounded-sm cursor-pointer text-sm p-2 bg-red-500 hover:underline"
                            onClick={() => onDelete(comment._id)}
                        >
                            {loader.removeLoader ? 'Loading...' : 'Delete'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
