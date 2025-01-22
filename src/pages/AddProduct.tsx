import { useState, useEffect } from 'react';
import { FileIcon, UploadIcon, XIcon } from 'lucide-react';
import useUploadFile from '../hooks/addPost/useUploadFile';
import useAddPost from '../hooks/addPost/useAddPost';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateMyPosts } from '../store/slices/authSlice';
import axios from 'axios';

interface ProductForm {
  productName: string;
  price: string;
  description: string;
  caption: string;
  category: string;
  file: {
    url: string;
    fileType: string;
    publicId: string;
  }
}

interface UploadProgressProps {
  progress: number;
}

function UploadProgress({ progress }: UploadProgressProps) {


  const user = useSelector(state => state?.auth?.user)
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/login', { replace: true });
    }
  }, [])

  if (progress <= 0 || progress >= 100) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 p-4 rounded-lg">
      <div className="h-3 w-full overflow-hidden rounded-lg bg-gray-200">
        <div
          className="h-full rounded-lg bg-green-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-center text-sm font-medium text-white">
        Uploading: {progress}%
      </p>
    </div>
  );
}

const AddProduct: React.FC = () => {

  const user = useSelector((state) => state?.auth?.user)

  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [])


  const dispatch = useDispatch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [file, setFile] = useState<File | null>(null);
  const [cities, setCities] = useState([])
  const [formData, setFormData] = useState<ProductForm>({
    productName: '',
    price: '',
    description: '',
    caption: '',
    category: '',
    file: {
      url: '',
      fileType: '',
      publicId: '',
    }
  });
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [filePreview, setFilePreview] = useState<string | undefined>(undefined);
  const { loading, error, uploadFile } = useUploadFile()
  const { loading: addProductLoading, error: addProducterror, addPost } = useAddPost()
  const [fileinp, setFileinp] = useState<File | null>(null);

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    // console.log('Selected file:', selectedFile);
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
        alert('Please upload a valid image or video file.');
        return;
      }

      const success = await uploadFile(selectedFile);
      if (success) {
        setFormData({
          ...formData,
          file: {
            url: success.url,
            fileType: success.fileType,
            publicId: success.publicId,
          }
        });
      }
      if (!success) {
        setUploadProgress(0);
        alert('Failed to upload the file. Please try again.');
        return;
      }
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      simulateUpload();
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(undefined);
    setFormData({
      ...formData,
      file: {
        url: '',
        fileType: '',
        publicId: '',
      }
    });
    setUploadProgress(0);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload an image or video file.');
      return;
    }

    const success = await addPost(formData);
    dispatch(updateMyPosts(success));

    // console.log("add product success: ", success);
    if (success) {
      alert('Product added successfully');
      setFormData({
        productName: '',
        price: '',
        description: '',
        caption: '',
        category: '',
        file: {
          url: '',
          fileType: '',
          publicId: '',
        }
      });
      setFile(null);
      setFilePreview(undefined);
    }
  };

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);
  const fetchcategory = async () => {
    const res = await axios.get(`${backendUrl}/post/getcategory`)
    // console.log(res.data.value, 'fetch category');
    setCities(res.data.value)
  }
  useEffect(() => {
    fetchcategory()
  }, [])
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/2 border rounded-md p-6 flex flex-col justify-center items-center relative min-h-[500px]">
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center gap-4 text-gray-600 border-dashed border-2 border-gray-300 p-6 rounded-md w-full h-full relative"
        >
          {file ? (
            <>
              {file.type.startsWith('image') ? (
                <img
                  src={filePreview}
                  alt="Uploaded Preview"
                  className="max-w-full max-h-[400px] object-contain rounded-lg"
                />
              ) : (
                <video
                  controls
                  className="w-full max-h-[400px] object-contain bg-gray-100 rounded-lg"
                  src={filePreview}
                />
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveFile();
                }}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <UploadIcon className="text-gray-500 w-12 h-12" />
              <span className="text-lg font-semibold">Upload Image or Video</span>
              <span className="text-sm">Click to select a file</span>
            </>
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <UploadProgress progress={uploadProgress} />
      </div>

      <div className="w-full md:w-1/2 border rounded-md p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium" htmlFor="fileName">
              File Name
            </label>
            <div className="relative">
              <FileIcon className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" />
              <input
                id="fileName"
                name="fileName"
                type="text"
                value={formData.file.url}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 pl-8 mt-1"
                placeholder="File Name"
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="productName">
              Product Name
            </label>
            <div className="relative">
              <input
                id="productName"
                name="productName"
                type="text"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 mt-1"
                placeholder="Product Name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="price">
              Price
            </label>
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 mt-1"
                placeholder="Price"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="description">
              Description
            </label>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 mt-1"
                placeholder="Description"
                rows={4}
                required
              ></textarea>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="caption">
              Caption
            </label>
            <div className="relative">
              <input
                id="caption"
                name="caption"
                type="text"
                value={formData.caption}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 mt-1"
                placeholder="Caption"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="category">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 mt-1"
                required
              >
                <option value="" disabled>Select a category</option>
                {cities.map((item) => (
                  <option key={item._id} value={item.Title}>{item.Title}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={addProductLoading}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            {addProductLoading ? "Loading..." : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;