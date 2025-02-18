import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api/axiosConfig";
import toast from "react-hot-toast";

const ReviewsSkeleton = () => {
    return (
        <div className="fixed px-4 py-6 w-[75vw] max-w-md max-h-[80vh] bg-white rounded-lg z-50 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 shadow-lg overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">User Reviews</h2>
            <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border-b border-gray-200">
                        <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse" />
                        <div className="flex-1">
                            <div className="w-3/5 h-4 bg-gray-300 rounded animate-pulse" />
                            <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, idx) => (
                                    <div key={idx} className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
                                ))}
                            </div>
                            <div className="w-4/5 h-3 bg-gray-300 rounded animate-pulse mt-2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ReviewPopupCard = ({ id }) => {

    const [reviews, setReviews] = useState([]);
    const [reviewLoading, setReviewLoading] = useState(true);
    const getReviewData = async () => {
        try {
            const response = await api.get(`/user/sellerReview?id=${id}`);
            setReviews(response.data.reviewerId);
        } catch (error) {
            //(error);
            toast.error('something went wrong!');
        } finally {
            setReviewLoading(false)
        }
    }
    useEffect(() => {
        getReviewData();
    }, []);

    if (reviewLoading) {
        return <ReviewsSkeleton />
    }

    return (
        <div className="fixed px-4 py-6 w-[75vw] max-w-md max-h-[80vh] bg-white rounded-lg z-50 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 shadow-lg overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">User Reviews</h2>
            {reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review?._id} className="flex items-start gap-3 p-3 border-b border-gray-200">
                            <img
                                src={review?.reviewerId?.profilePicture}
                                alt={review?.reviewerId?.fullName}
                                className="sm:w-12 sm:h-12 h-8 w-8 rounded-full object-cover bg-green-300"
                            />
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{review?.reviewerId?.fullName}</h3>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    {[...Array(review?.totalStars)].map((_, index) => (
                                        <Star key={index} size={16} fill="currentColor" strokeWidth={0} />
                                    ))}
                                </div>
                                {review?.reviewMessage && (
                                    <p className="text-xs sm:text-lg text-gray-700 mt-1">{review.reviewMessage}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-10">
                    <p>No reviews available</p>
                </div>
            )}
        </div>
    );
};

export default ReviewPopupCard;
