import React, { useState, useEffect } from "react";
import { Row, Col, Card } from 'react-bootstrap';
import { useLocation,useNavigate } from 'react-router-dom';
import './LeadDetails.css';
import Navbar from '../../../Shared/Sales-ExecutiveNavbar/Navbar';
import baseURL from "../../../Apiservices/Api";

const LeadOppView = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [lead, setLead] = useState(null);
    const location = useLocation();
    const { leadid } = location.state;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeadDetails = async () => {
            try {
                const response = await fetch(`${baseURL}/api/lead-opp-comment/${leadid}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLead(data);
            } catch (error) {
                console.error('Error fetching lead details:', error);
            }
        };

        fetchLeadDetails();
    }, [leadid]);

    if (!lead) {
        return <div>Loading...</div>; // Show a loading state while fetching data
    }

    // Sort comments by timestamp in descending order
    const sortedComments = lead.comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="salesViewLeadsContainer">
            <Navbar onToggleSidebar={setCollapsed} />
            <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
                <div className="lead-opportunity-view">
                    <Card className="mb-4">
                        <Card.Header className='s-LeadOppView-modal-header'>
                            <h2>Lead Details</h2>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {/* Customer Details Section */}
                                <Col md={6}>
                                    <h5>Customer Details</h5>
                                    <p><strong>Lead Type:</strong> {lead.lead_type}</p>
                                    <p><strong>Lead Id:</strong> {lead.leadcode}</p>
                                    <p><strong> Name:</strong> {lead.name}</p>
                                    <p><strong>Phone Number:</strong>{lead.country_code} {lead.phone_number}</p>
                                    <p><strong>Email ID:</strong> {lead.email}</p>
                                    <p><strong>PrimarySource:</strong> {lead.primarySource}</p>
                                    <p><strong>SecondarySource:</strong> {lead.secondarysource}</p>
                                    <p><strong>Primarystatus:</strong> {lead.primaryStatus}</p>
                                    <p><strong>Secondarystatus:</strong> {lead.secondaryStatus}</p>
                                    <p><strong>Travel Type:</strong> {lead.travel_type}</p>
                                    <p><strong>Channel:</strong> {lead.channel}</p>
                                    <hr />
                                    
                                    <h5>Opportunity Details</h5>
                                    <p><strong>Destination:</strong> {lead.destination}</p>
                                    <p><strong>Start Date:</strong> {new Date(lead.start_date).toLocaleDateString()}</p>
                                    <p><strong>End Date:</strong> {new Date(lead.end_date).toLocaleDateString()}</p>
                                    <p><strong>Duration:</strong> {lead.duration}</p>
                                    <p><strong>Number of Adults:</strong> {lead.adults_count}</p>
                                    <p><strong>Number of Children:</strong> {lead.children_count}</p>
                                    <p><strong>Child Age:</strong> {lead.child_ages}</p>
                                    <p><strong>Approx Budget:</strong> {lead.approx_budget}</p>
                                    <p><strong>Primarystatus:</strong> {lead.	opportunity_status1}</p>
                                    <p><strong>Secondarystatus:</strong> {lead.	opportunity_status2}</p>
                                    <p><strong>Remainder Setting:</strong> {new Date(lead.reminder_setting).toLocaleString()}</p>
                                </Col>

                                <Col md={6}>
    <h5>Additional Details</h5>
    <p><strong>Notes:</strong></p>
    <div className="s-Opp-Notesection">
        
        <p>{lead.notes}</p>
    </div>
    <hr />
    <p><strong>Comments:</strong></p>
    <div className="s-Opp-Commentsection">
        
        {sortedComments.map(comment => (
            <div key={comment.id}>
                <p>
                    <strong>{new Date(comment.timestamp).toLocaleString()}:</strong>
                </p>
                <p>{comment.text}</p>
                <hr /> {/* Optional: Add a horizontal line between comments */}
            </div>
        ))}
    </div>
</Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className='s-LeadOppView-footer'>
                        <button className="btn btn-secondary" onClick={() => navigate('/potential-leads')}>
                Back
              </button>
                           
                        </Card.Footer>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LeadOppView;