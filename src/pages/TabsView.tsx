import { DashboardLayout } from "@/components/Dashboard/DashboardLayout";
import { deleteFormSubmission, FormSubmission, getFormSubmissions } from "@/services/formService";
import { deleteInquiry, getInquiries, Inquiry } from "@/services/inquiryService";
import React, { useEffect, useState } from "react"; 

const TabsView = () => {
  // State variables
  const [activeTab, setActiveTab] = useState<"submissions" | "inquiries">("submissions");
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data based on the active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "submissions") {
          const data = await getFormSubmissions();
          setSubmissions(data);
        } else if (activeTab === "inquiries") {
          const data = await getInquiries();
          setInquiries(data);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load data. Please check your connection or API.");
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Handle deletion of a submission or inquiry
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      if (activeTab === "submissions") {
        await deleteFormSubmission(id);
        setSubmissions((prevSubmissions) =>
          prevSubmissions.filter((submission) => submission._id !== id)
        );
      } else if (activeTab === "inquiries") {
        await deleteInquiry(id);
        setInquiries((prevInquiries) =>
          prevInquiries.filter((inquiry) => inquiry._id !== id)
        );
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-700">Loading data...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-lg font-medium">{error}</p>
      </div>
    );
  }

  // Render empty state
  const isEmpty =
    (activeTab === "submissions" && submissions.length === 0) ||
    (activeTab === "inquiries" && inquiries.length === 0);

  if (isEmpty) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-700">No {activeTab} found. 🤷‍♂️</p>
          <p className="text-gray-500 mt-2">Start collecting feedback to improve your product!</p>
        </div>
      </div>
    );
  }

  // Get the current data based on the active tab
  const data = activeTab === "submissions" ? submissions : inquiries;

  return (
    <DashboardLayout>
      <div className="w-full bg-gray-100">
        <div className="max-w-fit mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <header className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Data Management</h1>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setActiveTab("submissions")}
                className={`px-4 py-2 rounded ${
                  activeTab === "submissions"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Form Submissions
              </button>
              <button
                onClick={() => setActiveTab("inquiries")}
                className={`px-4 py-2 rounded ${
                  activeTab === "inquiries"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Inquiries
              </button>
            </div>
          </header>
          {/* Table to display data */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {activeTab === "submissions" ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Program
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Best Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        College
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Program
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inquiry
                      </th>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline">
                      <a href={`mailto:${item.email}`}>{item.email}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.phone}</td>
                    {activeTab === "submissions" ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.subject || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.program || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.bestTime || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.message || "N/A"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.college || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.program || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.inquiry || "N/A"}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => alert(JSON.stringify(item, null, 2))}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TabsView;