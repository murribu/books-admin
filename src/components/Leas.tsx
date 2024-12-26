import { Button, Table } from "react-bootstrap";
import { useBookContext } from "../contexts/bookContext";
import { useState } from "react";

const Leas = () => {
  const { leas } = useBookContext();
  const [sortBy, setSortBy] = useState<string>("name");

  const sortLeas = (a: any, b: any) => {
    switch (sortBy) {
      case "score":
        return b.score - a.score;
      default:
        return a[sortBy].localeCompare(b[sortBy]);
    }
  };
  return (
    <div>
      <h1>LEAs</h1>
      <Table>
        <thead>
          <tr>
            <th>County</th>
            <th>ID</th>
            <th>
              <Button onClick={() => setSortBy("name")}>Name</Button>
            </th>
            <th>
              <Button onClick={() => setSortBy("score")}>Score</Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {leas.sort(sortLeas).map((lea) => (
            <tr key={lea.id}>
              <td>{lea.county}</td>
              <td>{lea.id}</td>
              <td>{lea.name}</td>
              <td>{lea.score}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Leas;
