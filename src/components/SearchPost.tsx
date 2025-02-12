import { useEffect, useState } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useNavigate } from "react-router-dom";
import api from "../services/api/axiosConfig";
import { identifyMediaType } from "./Post";

// interface PostProps {
//     post: {
//         id: number;
//         username: string;
//         avatar: string;
//         image: string;  // Image or video URL
//         caption: string;
//         likes: number;
//         comments: number;
//         timestamp: string;
//     };
// }

// const identifyMediaType = (fileName: string) => {

//     const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
//     const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv'];

//     const fileExtension = fileName.split('.').pop()?.toLowerCase();

//     if (imageExtensions.includes(`.${fileExtension}`)) {
//         return 'image';
//     } else if (videoExtensions.includes(`.${fileExtension}`)) {
//         return 'video';
//     } else {
//         return 'unknown';
//     }
// };

const Reelcard = ({ value, observerRef, isPlay }) => {

    const navigate = useNavigate()
    const [viewCount, setViewCount] = useState(0);
    const mediaType = identifyMediaType(value?.file?.fileType);


    useEffect(() => {
        const fetchViewCount = async () => {
            try {
                const response = await api.get(`/post/getview?postId=${value._id}`);
                setViewCount(response.data.viewCount);
            } catch (error) {
                console.error('Error fetching view count:', error.messages);
            }
        };

        if (value && value._id) {
            fetchViewCount();
        }

    }, [value, value?._id]);


    return (
        <>
            <div onClick={() => navigate(`/reels/${value._id}`)} key={value._id} className=" shadow-md overflow-hidden rounded-lg mb-2 relative h-fit cursor-pointer">
                {mediaType === 'image' ? (
                    <img
                        src={value.file.url}
                        alt=""
                        className="w-full h-auto object-cover"
                    />
                ) : (
                    <video
                        ref={observerRef}
                        muted
                        autoPlay={isPlay}
                        loop
                        src={value.file.url}
                        className="w-full h-auto object-cover"
                    >
                        <source src={value.file.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}

                <div className=" bg-white flex justify-between text-black  p-1 text-xs sm:text-sm  ">
                    {/* <p className=" text-nowrap font-semibold "> Seller: {value?.user?.fullName}</p> */}
                    <p className=" text-nowrap "> {value?.title ? value?.title : value?.caption}</p>
                    {/* <p className=" text-nowrap  "> category: {value?.category} </p> */}
                    {/* <p className=" text-nowrap font-semibold "> price: ₹{(value?.price).toFixed(2)} </p> */}

                    <div className="flex items-center gap-1 text-black text-xs ">
                        <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                        </svg>
                        <span className="font-semibold flex items-center justify-center">
                            {viewCount} {/* Show the view count here */}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

const SearchPost = (props) => {

    const [post, setPost] = useState(props.info)
    const [isPlay, setIsPlay] = useState(false);
    const observerRef = useIntersectionObserver(() => setIsPlay(true), () => setIsPlay(false), { threshold: 0.6 });
    const navigate = useNavigate()

    useEffect(() => {
        if (observerRef.current) {
            if (isPlay) {
                observerRef.current.play();
            }
            else {
                observerRef.current.pause();
            }
        }
    }, [isPlay]);

    return (
        <>
            {post.map(value => (
                <Reelcard value={value} observerRef={observerRef} isPlay={isPlay} />
            ))}
        </>
    );
}

export default SearchPost;