import { useBookContext } from "../contexts/bookContext";

const Leas = () => {
  const { leas } = useBookContext();
  return (
    <div>
      <h1>LEAs</h1>
      <table>
        <thead>
          <tr>
            <th>County</th>
            <th>ID</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leas.map((lea) => (
            <tr key={lea.id}>
              <td>{lea.county}</td>
              <td>{lea.id}</td>
              <td>{lea.name}</td>
              <td>{lea.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leas;
