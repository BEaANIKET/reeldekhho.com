import { Loader2Icon, Star } from "lucide-react";
import { useState } from "react";
import api from "../../services/api/axiosConfig";
import { useDispatch } from "react-redux";
import { updateReviews } from "../../store/slices/reviewSlice";

interface ProfileRatingProps {
  setIsRateBottomSheetOpen: (value: boolean) => void;
  sellerId: string | undefined
  setProfile: (value: boolean) => void
}

export default function ProfileRating({ setIsRateBottomSheetOpen, sellerId, setProfile }: ProfileRatingProps) {
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const handleRating = (value: number) => {
    setRating(value);
  };

  const dispatch = useDispatch();

  const handleClick = async () => {
    try {
      setLoading(true)
      const response = await api.post(`/user/review?id=${sellerId}`, { star: rating, message: reviewMessage })
      //(response.data )
      setProfile(response.data.user)

      dispatch(updateReviews({
        reviewedId: response.data.reviwedId.reviewedId,
        reviewMessage: response.data.reviwedId.reviewMessage,
        totalStars: response.data.reviwedId.totalStars
      }));
      alert(`Thank you for rating us ${rating} stars!`);
    } catch (error) {
      // //(error);
      alert(`Something went wrong!`);
    } finally {
      setIsRateBottomSheetOpen(false)
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
        <div className="w-full bg-white rounded-t-lg p-4">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
          </div>

          <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
            Rate us
          </h2>

          <div className="flex justify-center items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => handleRating(star)}
                className={`w-8 h-8 cursor-pointer ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                  }`}
              />
            ))}
          </div>

          {/* Display Rating */}
          {rating > 0 && (
            <p className="text-center text-sm text-gray-500 mb-4">
              You selected {rating} star{rating > 1 ? "s" : ""}!
            </p>
          )}

          <textarea
            value={reviewMessage}
            onChange={(e) => {
              const { value } = e.currentTarget;
              setReviewMessage(value)
            }}
            placeholder="Give Us Your Feedback"
            rows={2}
            className=" w-full shadow-md bg-[#00000028] outline-none p-1 mb-2"
          >

          </textarea>

          {/* Buttons */}
          <button
            onClick={handleClick}
            disabled={rating === 0} // Disable submit if no rating is selected
            className={`block w-full ${loading && 'flex items-center justify-center'} px-4 py-2 mb-2 rounded-md font-semibold ${rating > 0
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {
              loading ?
                <Loader2Icon className="animate-spin" /> :
                <span>Submit</span>
            }
          </button>
          <button
            onClick={() => setIsRateBottomSheetOpen(false)}
            className="block w-full text-center px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
