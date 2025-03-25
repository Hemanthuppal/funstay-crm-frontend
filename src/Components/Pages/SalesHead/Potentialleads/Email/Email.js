import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../../../Apiservices/Api";

const Email = () => {
  const { leadId } = useParams(); // Get lead ID from URL params
  const [emailChat, setEmailChat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmailChat = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/quotations/email-chat/${leadId}`);
        setEmailChat(response.data || []); // Ensure it's always an array
      } catch (err) {
        setError("Failed to fetch email chat.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmailChat();
  }, [leadId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Email Chat for Lead ID: {leadId}</h2>
      {emailChat.length > 0 ? (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Quotation File</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {emailChat.map((chat) => (
              <tr key={chat.id}>
                <td>{chat.id}</td>
                <td>{chat.name}</td>
                <td>{chat.email}</td>
                <td>
                  <a href={`${baseURL}${chat.quotation_file}`} target="_blank" rel="noopener noreferrer">
                    View Quotation
                  </a>
                </td>
                <td>{new Date(chat.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No email chat data found.</p>
      )}
    </div>
  );
};

export default Email;
