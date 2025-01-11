import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditContact = () => {
  const { id } = useParams();
  const [user, setUser] = useState({ name: "", email: "", contact: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/server/index.php?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setUser(data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/server/index.php?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            className="border border-gray-300 p-2 w-full"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="border border-gray-300 p-2 w-full"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contact</label>
          <input
            type="text"
            className="border border-gray-300 p-2 w-full"
            value={user.contact}
            onChange={(e) => setUser({ ...user, contact: e.target.value })}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditContact;
