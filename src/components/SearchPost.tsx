import { useEffect, useState } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useNavigate } from "react-router-dom";

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
                <div onClick={() => navigate(`/reels/${value._id}`)} key={value._id} className=" shadow-md overflow-hidden rounded-lg mb-2 relative h-fit cursor-pointer">
                    {value.file.fileType === 'mp4' ? (
                        <video
                            ref={observerRef}
                            muted
                            autoPlay={isPlay}
                            loop
                            className="w-full h-auto object-cover"
                        >
                            <source src={value.file.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img
                            src={value.file.url}
                            alt=""
                            className="w-full h-auto object-cover"
                        />
                    )}

                    <div className=" bg-white text-black  p-4 text-xs sm:text-sm  ">
                        <p className=" text-nowrap font-semibold "> Seller: {value?.user?.fullName}</p>
                        <p className=" text-nowrap "> captions: {value?.caption}</p>
                        <p className=" text-nowrap  "> category: {value?.category} </p>
                        <p className=" text-nowrap font-semibold "> price: ₹{(value?.price).toFixed(2)} </p>
                    </div>
                </div>
            ))}
        </>
    );
}

export default SearchPost;