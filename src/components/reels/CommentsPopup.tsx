import CommentList from './CommentList';
import CommentSection from '../interactions/CommentSection';

interface CommentPopupProps {
    isOpen: boolean;
    comments: any[];
    onClose: () => void;
    onDelete: (id: number) => void;
    showPopup: any;
    setShowPopup: React.Dispatch<React.SetStateAction<any>>;
    createComment: any;
    loader: { addLoader: boolean; removeLoader: boolean };
    setLoader: React.Dispatch<React.SetStateAction<any>>;
}

export default function CommentPopup({
    isOpen,
    comments,
    onClose,
    onDelete,
    showPopup,
    setShowPopup,
    createComment,
    loader,
    setLoader,
}: CommentPopupProps) {
    return (
        <div
            className={`absolute z-50 overflow-y-scroll bottom-0 left-0 right-0 bg-gray-900 text-white p-4 rounded-t-lg transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
            style={{ height: '50%' }}
        >
            <div className="flex sticky top-0 bg-inherit z-40 justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Comments</h2>
                <button onClick={onClose} className="text-white hover:text-gray-400">
                    Close
                </button>
            </div>

            <CommentList
                comments={comments}
                onDelete={onDelete}
                showPopup={showPopup}
                setShowPopup={setShowPopup}
                loader={loader}
            />

            <div className="sticky bottom-14 bg-inherit top-0 w-full">
                <CommentSection postId={comments[0]?.postId} createComment={createComment} loader={loader} setLoader={setLoader} />
            </div>
        </div>
    );
}
