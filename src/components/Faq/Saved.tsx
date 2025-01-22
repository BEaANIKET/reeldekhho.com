import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const identifyMediaType = (fileName) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
  const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv"];
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  if (imageExtensions.includes(`.${fileExtension}`)) {
    return "image";
  } else if (videoExtensions.includes(`.${fileExtension}`)) {
    return "video";
  } else {
    return "unknown";
  }
};

const Saved = () => {
  const savedPost = useSelector((state) => state.savedPosts?.saved_Posts);
  const navigate = useNavigate();

  return (
    <div className="mt-8 md:mt-0 max-w-5xl mx-auto p-4">
      {savedPost && savedPost.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {savedPost.map((item) => {
            const mediaType = identifyMediaType(item.postId?.file?.url || "");
            return (
              <div
                onClick={() => navigate("/reels/" + item._id)}
                key={item._id}
                className="relative cursor-pointer group overflow-hidden rounded-lg shadow-md"
              >
                {mediaType === "video" ? (
                  <video
                    muted
                    loop
                    className="w-full h-[250px] object-cover rounded-lg"
                  >
                    <source src={item.postId?.file?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={item.postId?.file?.url || "placeholder-image-url"}
                    alt={item.postId?.caption || "Saved Post"}
                    className="w-full h-[250px] object-cover group-hover:scale-110 transition-transform duration-300 rounded-lg"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white text-sm font-semibold">
                      {item.postId?.caption || "No Caption"}
                    </p>
                    <p className="text-white text-lg font-bold">
                      ₹ {item.postId?.price?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No saved posts found
        </div>
      )}
    </div>
  );
};

export default Saved;
