import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../../Shared/Navbar/Navbar';
import axios from "axios";
import { baseURL } from "../../../Apiservices/Api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Destinations.css";

const Destinations = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [destination, setDestination] = useState("");
  const [destinationsList, setDestinationsList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/destinations`);
      setDestinationsList(response.data);
    } catch (error) {
      console.error("Error fetching destinations", error);
    }
  };

  const handleAddOrUpdateDestination = async () => {
    if (destination.trim() !== "") {
      try {
        if (editingId) {
          await axios.put(`${baseURL}/api/destinations/${editingId}`, { value: destination, label: destination });
        } else {
          await axios.post(`${baseURL}/api/destinations`, { value: destination, label: destination });
        }
        fetchDestinations(); // Refresh the list after adding/updating
        setDestination("");
        setEditingId(null);
      } catch (error) {
        console.error("Error saving destination", error);
      }
    }
  };

  const handleEditDestination = (id, label) => {
    setDestination(label);
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setDestination("");
    setEditingId(null);
  };

  const handleDeleteDestination = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/destinations/${id}`);
      fetchDestinations(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting destination", error);
    }
  };

  return (
    <div className="salesViewLeadsContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
        <h1>Destinations</h1>
        <div className="destination-input">
          <input
            type="text"
            placeholder="Enter Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <button onClick={handleAddOrUpdateDestination}>{editingId ? "Update" : "Add"}</button>
          {editingId && <button onClick={handleCancelEdit} className="btn btn-secondary">Cancel</button>}
        </div>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Destination</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinationsList.map((dest, index) => (
              <tr key={dest.id}>
                <td>{index + 1}</td>
                <td>{dest.label}</td>
                <td>
                  <button onClick={() => handleEditDestination(dest.id, dest.label)}>Edit</button>
                  <button onClick={() => handleDeleteDestination(dest.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Destinations;
