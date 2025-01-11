import React, { useEffect, useState } from "react";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", contact: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/server/index.php")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const deleteUser = (id) => {
    fetch(`http://localhost:8000/server/index.php?id=${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const editUser = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, contact: user.contact });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", contact: "" });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const method = editingUser ? "PUT" : "POST";
    const url = editingUser
      ? `http://localhost:8000/server/index.php?id=${editingUser.id}`
      : "http://localhost:8000/server/index.php";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        if (editingUser) {
          setUsers(
            users.map((user) =>
              user.id === editingUser.id ? { ...user, ...formData } : user
            )
          );
        } else {
          setUsers([...users, { ...formData, id: users.length + 1 }]);
        }
        closeModal();
      })
      .catch((error) => {
        console.error("Error saving user:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-400 p-4">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold">DATA ASISTEN LABTI INFORMATIKA</h1>
      </div>

      <button
        className="btn-green mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Add User
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  className="input-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="input-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Contact</label>
                <input
                  type="text"
                  className="input-none"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="input-submit"
                >
                  {editingUser ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="input-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 bg-gray-100">
          <thead>
            <tr className="bg-gray-300 sticky top-0 z-10">
              <th className="border border-gray-300 px-4 py-2 w-1/4 text-ellipsis overflow-hidden whitespace-nowrap">Name</th>
              <th className="border border-gray-300 px-4 py-2 w-1/4 text-ellipsis overflow-hidden whitespace-nowrap">Email</th>
              <th className="border border-gray-300 px-4 py-2 w-1/4 text-ellipsis overflow-hidden whitespace-nowrap">Contact</th>
              <th className="border border-gray-300 px-4 py-2 sticky right-0 bg-gray-300 z-20 w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-200">
                <td className="border border-gray-300 px-4 py-2 text-ellipsis overflow-hidden whitespace-nowrap">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-ellipsis overflow-hidden whitespace-nowrap">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2 text-ellipsis overflow-hidden whitespace-nowrap">{user.contact}</td>
                <td className="border border-gray-300 px-4 py-2 sticky right-0 bg-white">
                  <div className="flex justify-center space-x-2">
                    <button
                      className="btn-blue"
                      onClick={() => editUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-red"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
