import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaQuestionCircle } from "react-icons/fa";
import axios from "axios";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [faqData, setFaqData] = useState([]);
  const fetchfaq = async () => {
    const res = await axios.get(`${backendUrl}/post/fetchfaq`);
    // console.log(res.data, "coming from faq");
    setFaqData(res.data);
  };
  useEffect(() => {
    fetchfaq();
  }, []);
  // const faqData = [
  //   {
  //     question: "How do I create an account?",
  //     answer: "To create an account, click on the 'Sign Up' button in the top right corner. Fill in your details including email, password, and other required information. Once submitted, you'll receive a confirmation email to activate your account."
  //   },
  //   {
  //     question: "What payment methods do you accept?",
  //     answer: "We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment gateway."
  //   },
  //   {
  //     question: "How can I reset my password?",
  //     answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you instructions to create a new password. For security reasons, password reset links expire after 24 hours."
  //   },
  //   {
  //     question: "What is your refund policy?",
  //     answer: "Our refund policy allows returns within 30 days of purchase. Items must be unused and in their original packaging. Once we receive the returned item, we'll process your refund within 5-7 business days."
  //   },
  //   {
  //     question: "How can I contact customer support?",
  //     answer: "Our customer support team is available 24/7. You can reach us through email at support@example.com, live chat on our website, or call us at 1-800-123-4567. We typically respond to inquiries within 24 hours."
  //   }
  // ];

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our services
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
            >
              <button
                className="w-full p-6 text-left flex items-center justify-between focus:outline-none hover:bg-gray-50"
                onClick={() => toggleAnswer(index)}
              >
                <div className="flex items-center space-x-3">
                  <FaQuestionCircle className="text-blue-500 text-xl flex-shrink-0" />
                  <span className="text-lg font-semibold text-gray-800">
                    {faq.Title}
                  </span>
                </div>
                {activeIndex === index ? (
                  <IoIosArrowUp className="text-gray-400 text-xl flex-shrink-0" />
                ) : (
                  <IoIosArrowDown className="text-gray-400 text-xl flex-shrink-0" />
                )}
              </button>
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${activeIndex === index ? "max-h-96 pb-6" : "max-h-0"
                  }`}
              >
                <p
                  className="text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(faq.About),
                  }}
                ></p>
                <span className="block text-sm text-gray-500 mb-8">
                  Published on {new Date(faq.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
