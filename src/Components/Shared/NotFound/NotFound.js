import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100vh", 
            textAlign: "center", 
            backgroundColor: "#f8f9fa" 
        }}>
            <h1 style={{ fontSize: "3rem", color: "#dc3545", marginBottom: "10px" }}>
                404 - Page Not Found
            </h1>
            <p style={{ fontSize: "1.2rem", color: "#6c757d", maxWidth: "500px" }}>
                Oops! The page you're looking for doesn't exist or this lead is not belongs to you.
            </p>
            <button 
                onClick={() => navigate('/')} 
                className="btn btn-primary" 
                style={{ marginTop: "20px", padding: "10px 20px", fontSize: "1rem" }}
            >
                Go to Login
            </button>
        </div>
    );
};

export default NotFound;
