import { deleteUser } from "../../services/adminApi";

export default function UsersAdmin({ users = [], refresh }) {
  return (
    <>
      <h2>Users</h2>

      <table className="admin-table">
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button className="delete-btn" onClick={()=>{
                  deleteUser(u._id);
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
