import { deleteBuild } from "../../services/adminApi";

export default function BuildsAdmin({ builds = [], refresh }) {
  return (
    <>
      <h2>Builds</h2>

      <table className="admin-table">
        <tbody>
          {builds.map((b) => (
            <tr key={b._id}>
              <td>{b.userId?.name}</td>
              <td>₹{b.totalPrice}</td>
              <td>
                <button className="delete-btn" onClick={()=>{
                  deleteBuild(b._id);
                  refresh();
                }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
