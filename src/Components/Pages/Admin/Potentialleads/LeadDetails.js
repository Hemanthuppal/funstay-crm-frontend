import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./LeadDetails.css";
import Navbar from "../../../Shared/Navbar/Navbar";
import { baseURL } from "../../../Apiservices/Api";
import { FaCopy, FaCheck } from "react-icons/fa";
import axios from "axios";
import { ThemeContext } from "../../../Shared/Themes/ThemeContext";

const LeadOppView = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [lead, setLead] = useState(null);
  const [message, setMessage] = useState("");
  const [newComment, setNewComment] = useState("");
  const [assignedSalesId, setAssignedSalesId] = useState(null);
  const { themeColor } = useContext(ThemeContext);
  const [managerid, setManagerId] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [tagChanged, setTagChanged] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { leadid: paramLeadId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();


  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setMessage("Copied to clipboard!");
        setTimeout(() => setMessage(""), 1000); // Optional: Show a message
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };


const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
    setTagChanged(true); // Set tag changed to true
  };

  const applyTag = async () => {
    if (!selectedTag) return;

    setIsUpdating(true);
    setMessage("");

    try {
      await axios.put(
        `${baseURL}/api/travel_opportunity/${lead.travelOpportunities[0].id}`,
        {
          tag: selectedTag,
        }
      );
      setMessage("Tag updated successfully!");
      setTagChanged(false); // Reset tag changed after successful update
    } catch (error) {
      console.error("Error updating tag:", error);
      setMessage("Failed to update tag.");
    } finally {
      setIsUpdating(false);
    }
  };




  // ✅ Ensure leadid is safely retrieved
  const leadid = paramLeadId || (location.state && location.state.leadid) || null;

  // 🔹 Redirect if leadid is missing
  useEffect(() => {
    if (!leadid) {
      console.error("Invalid Lead ID: Redirecting...");
      navigate("/not-found");
    }
  }, [leadid, navigate]);

  // 🔹 Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/tags`);
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  // 🔹 Fetch Lead Details
  useEffect(() => {
    if (!leadid) return; // Prevent API call if leadid is null

    const fetchLeadDetails = async () => {
      try {
        const response = await fetch(`${baseURL}/api/leadsoppcomment/${leadid}`);
        if (!response.ok) {
          console.error("Lead not found, status:", response.status);
          navigate("/not-found");
          return;
        }

        const data = await response.json();
        

        if (!data || !data.lead) {
          navigate("/not-found");
          return;
        }

        setLead(data);

        if (data.travelOpportunities && data.travelOpportunities.length > 0) {
          setSelectedTag(data.travelOpportunities[0].tag || "");
        }
      } catch (error) {
        console.error("Error fetching lead details:", error);
        navigate("/not-found");
      }
    };

    fetchLeadDetails();
  }, [leadid, navigate]);

  // 🔹 Prevent accessing lead.travelOpportunities if lead is null
  // const applyTag = async () => {
  //   if (!selectedTag || !lead || !lead.travelOpportunities?.length) return;

  //   setIsUpdating(true);
  //   setMessage("");

  //   try {
  //     await axios.put(
  //       `${baseURL}/api/travel_opportunity/${lead.travelOpportunities[0].id}`,
  //       { tag: selectedTag }
  //     );
  //     setMessage("Tag updated successfully!");
  //     setTagChanged(false);
  //   } catch (error) {
  //     console.error("Error updating tag:", error);
  //     setMessage("Failed to update tag.");
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  const addComment = async () => {
    if (!newComment.trim()) return;
    if (!leadid) {
      console.error("Cannot add comment: Lead ID is missing");
      return;
    }

    const trimmedComment = newComment.trim();
    const commentName = "Admin";

    const comment = {
      name: commentName,
      leadid: leadid,
      timestamp: new Date().toISOString(),
      text: trimmedComment,
      notificationmessage: `${commentName}: ${trimmedComment}`,
      managerId: managerid,
      userId: assignedSalesId,
      email: null,
    };

    try {
      const response = await fetch(`${baseURL}/comments/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const savedComment = await response.json();

      setLead((prevLead) => ({
        ...prevLead,
        comments: [...(prevLead?.comments || []), savedComment],
      }));

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEdit = (leadId) => {
    if (!leadId) {
      console.error("Lead ID is missing, cannot edit.");
      return;
    }
    navigate(`/a-edit-opportunity/${leadId}`, { state: { leadid: leadId } });
  };
  
  if (!lead) return <div>Loading...</div>;

  const sortedComments = lead.comments
    ? lead.comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    : [];

  return (
    <div className="salesViewLeadsContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
        <div className="lead-opportunity-view">
          <Card className="mb-4">
            <Card.Header
              className="s-LeadOppView-modal-header"
              style={{ "--theme-color": themeColor }}
            >
              <h2> Customer and Opportunity Details</h2>
            </Card.Header>
            <Card.Body>
              {message && <div className="alert alert-info">{message}</div>}
              <Row>
                <Col md={6}>
                  <h5>Customer Details</h5>
                  <p>
                    <strong>Opp Id:</strong> {lead.lead.leadid || "N/A"}
                  </p>

                  <p>
                    <strong>Name:</strong> {lead.lead.name || "N/A"}
                  </p>
                  <p>
                    <strong>Phone Number:</strong>
                    <a
                      href={`https://wa.me/${lead.lead.country_code}${lead.lead.phone_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "blue",
                        marginLeft: "5px",
                      }}
                    >
                      {lead.lead.country_code} {lead.lead.phone_number || "N/A"}
                    </a>
                    <FaCopy
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer",
                        color: "#ff9966",
                      }}
                      onClick={() =>
                        copyToClipboard(
                          `${lead.lead.country_code}${lead.lead.phone_number}`
                        )
                      }
                      title="Copy Phone Number"
                    />
                  </p>

                  <p>
                    <strong>Email ID:</strong> {lead.lead.email || "N/A"}
                    <FaCopy
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer",
                        color: "#ff9966",
                      }}
                      onClick={() => copyToClipboard(lead.lead.email)}
                      title="Copy Email"
                    />
                  </p>
                  <p>
                    <strong>Primary Source:</strong>{" "}
                    {lead.lead.primarySource || "N/A"}
                  </p>
                  <p>
                    <strong>Secondary Source:</strong>{" "}
                    {lead.lead.secondarysource || "N/A"}
                  </p>

                  <p>
                    <strong>Primary Status:</strong>{" "}
                    {lead.lead.opportunity_status1 || "N/A"}
                  </p>
                  <p>
                    <strong>Secondary Status:</strong>{" "}
                    {lead.lead.opportunity_status2 || "N/A"}
                  </p>
                  <p>
                    <strong>Travel Type:</strong>{" "}
                    {lead.lead.travel_type || "N/A"}
                  </p>
                  <p>
                    <strong>Channel:</strong> {lead.lead.channel || "N/A"}
                  </p>
                  <hr />

                  <h5>Opportunity Details</h5>
                  {lead.travelOpportunities &&
                    lead.travelOpportunities.length > 0 && (
                      <>
                        <p>
                          <strong>Origin City:</strong>{" "}
                          {lead.travelOpportunities[0].origincity || "N/A"}
                        </p>
                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <strong>Tag:</strong>
                          <select
                            value={selectedTag}
                            onChange={handleTagChange}
                            style={{ width: "50%", padding: "5px" }}
                          >
                            <option value="">Select a tag</option>
                            {tags.map((tag) => (
                              <option key={tag.id} value={tag.value}>
                                {tag.label}
                              </option>
                            ))}
                          </select>
                          {tagChanged && (
                            <FaCheck
                              onClick={applyTag}
                              style={{
                                cursor: "pointer",
                                color: "green",
                                fontSize: "20px",
                              }}
                              title="Apply Tag"
                            />
                          )}
                        </p>

                        <p>
                          <strong>Destination:</strong>{" "}
                          {lead.travelOpportunities[0].destination || "N/A"}
                        </p>
                        <p>
                          <strong>Start Date:</strong>{" "}
                          {lead.travelOpportunities[0].start_date
                            ? new Date(
                                lead.travelOpportunities[0].start_date
                              ).toLocaleDateString("en-IN", {
                                timeZone: "Asia/Kolkata",
                              })
                            : "N/A"}
                        </p>

                        <p>
                          <strong>End Date:</strong>{" "}
                          {lead.travelOpportunities[0].end_date
                            ? new Date(
                                lead.travelOpportunities[0].end_date
                              ).toLocaleDateString("en-IN", {
                                timeZone: "Asia/Kolkata",
                              })
                            : "N/A"}
                        </p>

                        <p>
                          <strong>Duration:</strong>{" "}
                          {lead.travelOpportunities[0].duration || "N/A"}
                        </p>
                        <p>
                          <strong>Number of Adults:</strong>{" "}
                          {lead.travelOpportunities[0].adults_count || "N/A"}
                        </p>
                        <p>
                          <strong>Number of Children:</strong>{" "}
                          {lead.travelOpportunities[0].children_count || "N/A"}
                        </p>
                        <p>
                          <strong>Child Age:</strong>{" "}
                          {lead.travelOpportunities[0].child_ages || "N/A"}
                        </p>
                        <p>
                          <strong>Approx Budget:</strong>&nbsp;Rs{" "}
                          {lead.travelOpportunities[0].approx_budget || "N/A"}
                        </p>

                        <p>
                          <strong>Reminder Setting:</strong>{" "}
                          {lead.travelOpportunities[0].reminder_setting
                            ? new Date(
                                lead.travelOpportunities[0].reminder_setting
                              ).toLocaleString()
                            : "N/A"}
                        </p>
                        <p>
                          <strong>Created Date:</strong>{" "}
                          {lead.travelOpportunities[0].created_at
                            ? new Date(
                                lead.travelOpportunities[0].created_at
                              ).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                              })
                            : "N/A"}
                        </p>
                      </>
                    )}
                </Col>

                <Col md={6}>
                  <h5>Additional Details</h5>
                  <p>
                    <strong>Description:</strong>
                  </p>
                  <div className="s-Opp-Commentsection">
                    {lead.travelOpportunities &&
                      lead.travelOpportunities.length > 0 && (
                        <>
                          <p style={{ whiteSpace: "pre-line" }}>
                            {lead.travelOpportunities[0].description || "N/A"}
                          </p>
                        </>
                      )}
                  </div>
                  <p>
                    <strong>Notes:</strong>
                  </p>
                  <div className="s-Opp-Commentsection">
                    {lead.travelOpportunities &&
                      lead.travelOpportunities.length > 0 && (
                        <>
                          <p style={{ whiteSpace: "pre-line" }}>
                            {lead.travelOpportunities[0].notes || "N/A"}
                          </p>
                        </>
                      )}
                  </div>

                  <div className="comment-section-container">
                    <p>
                      <strong>Comments:</strong>
                    </p>

                    {/* Comment Input Section */}
                    <div className="comment-input-container">
                      <Form.Group>
                        <Form.Label>
                          <strong>Add a New Comment</strong>
                        </Form.Label>
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

                    {/* Display Comments */}
                    <div
                      className="comment-list"
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        padding: "10px",
                        borderRadius: "5px",
                        marginTop: "15px",
                        backgroundColor: "#f1f7ff",
                      }}
                    >
                      {sortedComments.length > 0 ? (
                        sortedComments.map((comment) => (
                          <div key={comment.id} className="comment-item">
                            <p className="comment-timestamp">
                              {new Date(comment.timestamp).toLocaleString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </p>
                            <p className="comment-text">
                              <strong>{comment.name}</strong>:
                              <span style={{ whiteSpace: "pre-line" }}>
                                {comment.text}
                              </span>
                            </p>

                            <hr />
                          </div>
                        ))
                      ) : (
                        <p>No comments available.</p>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="s-LeadOppView-footer">
              <button
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleEdit(lead.lead.leadid)}
              >
                Edit
              </button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadOppView;
