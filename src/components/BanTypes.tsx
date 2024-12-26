import { Button, FormControl, Table } from "react-bootstrap";
import { BanType, useBookContext } from "../contexts/bookContext";
import { useState } from "react";
import { createBanType } from "../graphql/mutations";
import { client } from "../App";

interface CreateBanTypeReturn {
  data: {
    createBanType: {
      PK: string;
      SK: string;
      banTypes: BanType[];
    };
  };
}

const BanTypes = () => {
  const { banTypes, setBanTypes } = useBookContext();
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [pending, setPending] = useState(false);

  const addBanType = async () => {
    setPending(true);
    try {
      const response = (await client.graphql({
        query: createBanType,
        variables: {
          createBanTypeInput: {
            name,
            id,
            score,
          },
        },
      })) as CreateBanTypeReturn;
      setBanTypes(response.data.createBanType.banTypes);
      console.log("create ban type response", response);
      setName("");
      setId("");
      setScore(null);
    } finally {
      setPending(false);
    }
  };

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
            <th>Actions</th>
          </tr>
          <tr>
            <th>
              <FormControl
                type="text"
                placeholder="Name"
                className="mr-sm-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </th>
            <th>
              <FormControl
                type="text"
                placeholder="Id"
                className="mr-sm-2"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </th>
            <th>
              <FormControl
                type="text"
                placeholder="Score"
                className="mr-sm-2"
                value={score?.toString() || ""}
                onChange={(e) => setScore(Number(e.target.value))}
              />
            </th>
            <th>
              <Button variant="primary" disabled={pending} onClick={addBanType}>
                Add
              </Button>
            </th>
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
