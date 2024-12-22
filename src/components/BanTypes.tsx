import { Table } from "react-bootstrap";
import { useBookContext } from "../contexts/bookContext";

const BanTypes = () => {
  const { banTypes } = useBookContext();
  return (
    <div>
      <h1>Ban Types</h1>
      <p>Here you can view the ban types.</p>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Id</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {banTypes?.map((banType) => (
            <tr key={banType.name}>
              <td>{banType.name}</td>
              <td>{banType.id}</td>
              <td>{banType.score}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BanTypes;
