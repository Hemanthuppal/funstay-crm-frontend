import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Shared/Navbar/Navbar";
import axios from "axios";
import DataTable from "../../../Layout/Table/TableLayout";
import { baseURL } from "../../../Apiservices/Api";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEdit, FaTrash, FaCopy } from "react-icons/fa";

const Tags = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [tag, setTag] = useState("");
  const [tagsList, setTagsList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/tags`);
      setTagsList(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleAddOrUpdateTag = async () => {
    if (tag.trim() === "") return;

    try {
      if (editingId) {
        await axios.put(`${baseURL}/api/tags/${editingId}`, {
          value: tag,
          label: tag,
        });
      } else {
        await axios.post(`${baseURL}/api/tags`, {
          value: tag,
          label: tag,
        });
      }
      fetchTags();
      setTag("");
      setEditingId(null);
    } catch (error) {
      console.error("Error saving tag:", error);
    }
  };

  const handleEditTag = (id, label) => {
    setTag(label);
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setTag("");
    setEditingId(null);
  };

  const handleDeleteTag = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/tags/${id}`);
      fetchTags();
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  // Define columns for DataTable
  const columns = [
    { Header: "S.No", accessor: "serial" },
    { Header: "Tag", accessor: "label" },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="btn-group">
          <FaTrash
            style={{ color: "#ff9966", cursor: "pointer", marginRight: "10px" }}
            onClick={() => handleDeleteTag(row.original.id)}
          />
          <FaEdit
            style={{ color: "#ff9966", cursor: "pointer" }}
            onClick={() => handleEditTag(row.original.id, row.original.label)}
          />
        </div>
      ),
    },
  ];

  // Format data for DataTable
  const data = tagsList.map((tag, index) => ({
    serial: index + 1,
    id: tag.id,
    label: tag.label,
  }));

  return (
    <div className="salesViewLeadsContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
        <h1>Tags</h1>

        <div className="container mt-3">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter New Tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
                <button className="btn btn-success px-3" onClick={handleAddOrUpdateTag}>
                  {editingId ? "Update" : "Add"}
                </button>
                {editingId && (
                  <button className="btn btn-secondary px-3" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Tags;
