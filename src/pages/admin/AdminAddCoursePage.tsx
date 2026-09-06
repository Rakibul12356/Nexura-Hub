import React from "react";
import { Navigate } from "react-router-dom";

export const AdminAddCoursePage: React.FC = () => {
  return <Navigate to="/admin/courses" replace />;
};

export default AdminAddCoursePage;

