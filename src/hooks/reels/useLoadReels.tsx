import { useEffect, useState } from "react";
import api from "../../services/api/axiosConfig";
let page = 1;

const useLoadReels = () => {
    const [reels, setReels] = useState([]);
    const [fetchedReelIds, setFetchedReelIds] = useState<string[]>([]);
    const [hasmore, setHasmore] = useState(true)
    const [loader, setLoader] = useState(true)

    const fetchReels = async () => {
        try {
            const response = await api.get('/post/get');
            const newReels = response.data.posts;
            setReels(newReels);
            setFetchedReelIds(newReels.map((reel: any) => reel._id));
            // console.log(newReels);
        } catch (error) {
            console.error(error?.response?.data?.error);
        } finally {
            setLoader(false);
        }
    }

    const loadReels = async () => {

        try {
            const response = await api.get(`/post/get?&excludeIds=${fetchedReelIds.join(',')}`);
            const newReels = response.data.posts;

            setReels([...reels, ...newReels]);
            setFetchedReelIds([...fetchedReelIds, ...newReels.map((reel: any) => reel._id)]);
            if (newReels.length < 3) {
                setHasmore(false)
            }
        } catch (error) {
            console.error(error?.response?.data?.error);
        }
    }

    useEffect(() => {
        fetchReels();
    }, [])

    return { reels, loadReels, loader, hasmore };
}

export default useLoadReels;