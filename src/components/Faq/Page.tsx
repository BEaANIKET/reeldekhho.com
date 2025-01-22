import axios from 'axios';
import DOMPurify from "dompurify";
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

const Page = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const params = useParams();
  const title = params.id;
  const [data, setData] = useState(null);

  const fetchpagenow = async () => {
    try {
      const res = await axios.get(`${backendUrl}/post/fetchpagenow/${title}`);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching page data:", error);
    }
  };

  useEffect(() => {
    fetchpagenow();
  }, [title]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 px-6">
      {/* Title Section */}
      <h1 className="text-4xl capitalize font-bold text-gray-800 mb-4">{data.Title}</h1>
      
      {/* Meta Section */}
      <span className="block text-sm text-gray-500 mb-8">
        Published on {new Date(data.createdAt).toLocaleDateString()}
      </span>
      
      {/* Content Section */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.About) }}
      />
    </div>
  );
};

export default Page;
