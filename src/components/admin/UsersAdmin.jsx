import { deleteUser } from "../../services/endpoints";
import Pagination from "../Pagination";
import { useState } from "react";

export default function UsersAdmin({ users = [], refresh }) {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  return (
    <div className="admin-container">
      <h2>👥 Users</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedUsers.map((u) => (
            <tr key={u._id}>
              <td>{users.indexOf(u) + 1 + (currentPage - 1) * usersPerPage}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => {
                    deleteUser(u._id);
                    refresh();
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
