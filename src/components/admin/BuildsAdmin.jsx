import { deleteBuild } from "../../services/endpoints";
import Pagination from "../Pagination";
import { useState } from "react";

export default function BuildsAdmin({ builds = [], refresh }) {
  const [currentPage, setCurrentPage] = useState(1);
  const buildsPerPage = 5;

  const totalPages = Math.ceil(builds.length / buildsPerPage);

  const paginatedBuilds = builds.slice(
    (currentPage - 1) * buildsPerPage,
    currentPage * buildsPerPage
  );

  return (
    <div className="admin-container">
      <h2>🖥 Builds</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>User</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedBuilds.map((b) => (
            <tr key={b._id}>
              <td>{builds.indexOf(b) + 1 + (buildsPage - 1) * buildsPerPage}</td>
              <td>{b.userId?.name}</td>
              <td>₹{b.totalPrice}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={async () => {
                    if (window.confirm("Delete this build?")) {
                      await deleteBuild(b._id);
                      refresh();
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}