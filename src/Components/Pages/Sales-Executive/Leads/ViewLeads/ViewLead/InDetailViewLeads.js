import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from "../../../../../Shared/Sales-ExecutiveNavbar/Navbar";
import "./InDetailViewLeads.css";
import axios from "axios"; // Import axios
import { baseURL } from "../../../../../Apiservices/Api";
import { FaCopy } from "react-icons/fa";
import { AuthContext } from '../../../../../AuthContext/AuthContext';
import { adminMail } from '../../../../../Apiservices/Api';
import { ThemeContext } from "../../../../../Shared/Themes/ThemeContext";

const InDetailViewLeads = () => {
  const { authToken, userRole, userId, userName, assignManager, managerId } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  // const { leadid } = location.state; // Get leadid from location state
  const { leadid } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const { themeColor } = useContext(ThemeContext);
  const [message, setMessage] = useState("");
  const [newComment, setNewComment] = useState('');
  const [lead, setLead] = useState({ comments: [] });
  const [formData, setFormData] = useState({
    lead_type: "",
    name: "",
    email: "",
    country_code: "",
    phone_number: "",
    sources: "",
    origincity: "",
    destination: "",
    description: "",
    another_name: "",
    another_email: "",
    another_phone_number: "",
    corporate_id: "",
    primaryStatus: "",
    secondaryStatus: "",
    primarySource: "",
    secondarysource: "",
    channel: "",
    created_at: "",
  });
  const [error, setError] = useState(null); // State for error handling
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage("Copied to clipboard!");
      setTimeout(() => setMessage(""), 1000); // Optional: Show a message
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  useEffect(() => {
    const checkDataExists = async () => {
      try {
        const response = await fetch(`${baseURL}/api/sales-leadid/leads/${leadid}/${userId}`);
        const data = await response.json();

        if (response.ok) {
          console.log(data.message); // Should print "Exists"
        } else {
          console.error(data.error);
          navigate('/not-found');
        }
      } catch (error) {
        console.error("Error checking data:", error);
      }
    };

    if (leadid && userId) { // Ensure values are defined before making the request
      checkDataExists();
    }
  }, [leadid, userId]);
  
  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/leads/${leadid}`);
        const leadData = response.data;

        setFormData((prev) => ({
          ...prev,
          leadid: leadData.leadid,
          lead_type: leadData.lead_type || "",
          leadcode: leadData.leadcode || "",
          name: leadData.name || "",
          email: leadData.email || "",
          country_code: leadData.country_code || "",
          phone_number: leadData.phone_number || "",
          origincity: leadData.origincity || "",
          destination: leadData.destination || "",
          description: leadData.description || "",
          another_name: leadData.another_name || "",
          another_email: leadData.another_email || "",
          another_phone_number: leadData.another_phone_number || "",
          corporate_id: leadData.corporate_id || "",
          primaryStatus: leadData.primaryStatus || "",
          secondaryStatus: leadData.secondaryStatus || "",
          primarySource: leadData.primarySource || "",
          secondarysource: leadData.secondarysource || "",
          channel: leadData.channel || "",
          created_at: leadData.created_at || "",
        }));
      } catch (err) {
        console.error("Error fetching lead data:", err);
        setError("Failed to fetch lead data.");
      }
    };

    if (leadid) {
      fetchLeadData();
    }
  }, [leadid]);


  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        const response = await fetch(`${baseURL}/api/leadsoppcomment/${leadid}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setLead(data || { comments: [] }); // Ensure lead is an object with comments
      } catch (error) {
        console.error('Error fetching lead details:', error);
      }
    };

    fetchLeadDetails();
  }, [leadid]);

  // const handleAddComment = async () => {
  //   if (!newComment.trim()) return;
  //   const trimmedComment = newComment.trim();
  //   const commentName = `${userName} (Sales)`;
    
  //   const comment = {
  //     name: commentName,
  //     leadid: leadid,
  //     timestamp: new Date().toISOString(),
  //     text: trimmedComment,
  //     notificationmessage: `${commentName} :${trimmedComment}  `,
  //     // notificationmessage: `${commentName} :${trimmedComment}  ${leadid}`,
  //     // userId, // Uncomment if needed
  //     managerId: managerId,
  //     email: `${adminMail}`
  //   };
    
  //   // const comment = {
  //   //   name: `${userName} (Sales)`,
  //   //   leadid: leadid,
  //   //   timestamp: new Date().toISOString(),
  //   //   text: newComment.trim(),
  //   //   // userId,
  //   //   managerId,
  //   //   email:`${adminMail}`
  //   // };
  //   console.log(JSON.stringify(comment, null, 2));
  //   try {
  //     const commenturl = `${baseURL}/comments/add`;
  //     const response = await fetch(commenturl, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(comment),
  //     });

  //     if (response.ok) {
  //       const addedComment = await response.json();
  //       setComments((prevComments) => [...prevComments, addedComment]);
  //       setNewComment("");
  //     } else {
  //       console.error("Failed to add comment");
  //     }
  //   } catch (error) {
  //     console.error("Error adding comment:", error);
  //   }
  // };

  const addComment = async () => {
    if (!newComment.trim()) return;
    const trimmedComment = newComment.trim();
    const commentName = `${userName} (Sales)`;
    
    const comment = {
      name: commentName,
      leadid: leadid,
      timestamp: new Date().toISOString(),
      text: trimmedComment,
      notificationmessage: `${commentName} :${trimmedComment}  `,
      // notificationmessage: `${commentName} :${trimmedComment}  ${leadid}`,
      // userId, // Uncomment if needed
      managerId: managerId,
      email: `${adminMail}`
    };
    console.log(JSON.stringify(comment, null, 2));
    try {
      const response = await fetch(`${baseURL}/comments/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const savedComment = await response.json();

      // Update the state to display the new comment
      setLead((prevLead) => ({
        ...prevLead,
        comments: [...prevLead.comments, savedComment]
      }));

      setNewComment(''); // Clear input after submission
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const sortedComments = lead.comments ? lead.comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) : [];


  return (
    <div className="indeatilleadcontainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`indeatilleadcontent ${collapsed ? "collapsed" : ""}`}>
        <div className="indetail-container">
          <div className="card mt-4">
            <div className="card-body">
              <h2 className="lead-details-header" style={{ "--theme-color": themeColor }}>Lead Details</h2>
              {message && <div className="alert alert-info">{message}</div>}
              {leadid ? (
                <div className="row">
                  <div className="col-md-6">
                    {/* <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Lead Type:
                      </span>
                      <span>{formData.lead_type}</span>
                    </div> */}
                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Lead ID:
                      </span>
                      <span>{formData.leadid}</span>
                    </div>
                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Name:
                      </span>
                      <span>{formData.name}</span>
                    </div>
                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Email:
                      </span>
                      <span>{formData.email}</span>
                      <FaCopy
                        style={{ marginLeft: "8px", cursor: "pointer", color: "#ff9966" }}
                        onClick={() => copyToClipboard(formData.email)}
                        title="Copy Email"
                      />
                    </div>

                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Phone Number:
                      </span>
                      <a
                        href={`https://wa.me/${formData.country_code}${formData.phone_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "blue" }}
                      >
                        {formData.country_code}{formData.phone_number}
                      </a>
                      <FaCopy
                        style={{ marginLeft: "8px", cursor: "pointer", color: "#ff9966" }}
                        onClick={() => copyToClipboard(`${formData.country_code}${formData.phone_number}`)}
                        title="Copy Phone Number"
                      />
                    </div>
                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Primary Source:
                      </span>
                      <span>{formData.primarySource}</span>
                    </div>
                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Secondary Source:
                      </span>
                      <span>{formData.secondarysource}</span>
                    </div>
                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Origin City:
                      </span>
                      <span>{formData.origincity}</span>
                    </div>
                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Destination:
                      </span>
                      <span>{formData.destination}</span>
                    </div>
                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Secondary Email:
                      </span>
                      <span>{formData.another_email}</span>
                    </div>
                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Secondary Phone Number:
                      </span>
                      <span>{formData.another_phone_number}</span>
                    </div>
                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Primary Status:
                      </span>
                      <span>{formData.primaryStatus}</span>
                    </div>
                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Secondary Status:
                      </span>
                      <span>{formData.secondaryStatus}</span>
                    </div>
                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        channel:
                      </span>
                      <span>{formData.channel}</span>
                    </div>
                    <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Created Date:
                      </span>
                      <span>{new Date(formData.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    
                    {/* <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Another Name:
                      </span>
                      <span>{formData.another_name}</span>
                    </div> */}
                    
                    {/* <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Corporate Id:
                      </span>
                      <span>{formData.corporate_id}</span>
                    </div> */}
                    
                    <div className="comment-section-container">
            <p><strong>Comments:</strong></p>
            <div className="comment-input-container">
              <Form.Group>
                <Form.Label><strong>Add a New Comment</strong></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Write your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  autoFocus
                />
                <Button
                  className="mt-2 btn-warning text-white"
                  onClick={addComment}
                  disabled={!newComment.trim()}
                >
                  Add Comment
                </Button>
              </Form.Group>
            </div>
            <div className="comment-list" style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ddd", padding: "10px", borderRadius: "5px", marginTop: "15px",backgroundColor:"#f1f7ff" }}>
              {sortedComments.length > 0 ? (
                sortedComments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <p className="comment-timestamp">
                      {new Date(comment.timestamp).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p className="comment-text">
  <strong>{comment.name}</strong>:  
  <span style={{ whiteSpace: "pre-line" }}>{comment.text}</span>
</p>

                    <hr />
                  </div>
                ))
              ) : (
                <p>No comments available.</p>
              )}
            </div>
          </div>
                  </div>
                  <div className="mb-3 d-flex flex-wrap">
                      <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                        Description:
                      </span>
                      <span style={{ whiteSpace: "pre-line" }}>{formData.description}</span>
                    </div>
                </div>
              ) : (
                !error && <p>Loading lead details...</p>
              )}
            </div>
          </div>
          <div className="back-button mt-3">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InDetailViewLeads;