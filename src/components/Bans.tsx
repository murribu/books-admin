import { useState } from "react";
import { Button, Form, FormControl, Table } from "react-bootstrap";
import { useBookContext } from "../contexts/bookContext";
import { client } from "../App";
import { createBan } from "../graphql/mutations";
import DatePicker from "react-bootstrap-date-picker";

const Bans = () => {
  const { books, leas, banTypes } = useBookContext();
  const [isbn, setIsbn] = useState("");
  const [lea, setLea] = useState("");
  const [date, setDate] = useState("");
  const [banType, setBanType] = useState("");
  const [pending, setPending] = useState(false);

  const addBan = async () => {
    setPending(true);
    try {
      const response = await client.graphql({
        query: createBan,
        variables: {
          createBanInput: {
            isbn,
            lea,
            date,
            leaName: leas.find((l) => l.id === lea)?.name,
          },
        },
      }); // as CreateBanReturn;
      console.log("create ban response", response);
    } catch (error) {
      console.error("create ban error", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <h1>Bans</h1>
      <Table>
        <thead>
          <tr>
            <th>Book</th>
            <th>LEA</th>
            <th>Ban Type</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <FormControl
                as="select"
                placeholder="Book"
                className="mr-sm-2"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              >
                <option value="">Select a book</option>
                {books.map((book) => (
                  <option key={book.isbn} value={book.isbn}>
                    {book.title}
                  </option>
                ))}
              </FormControl>
            </td>
            <td>
              <FormControl
                as="select"
                placeholder="LEA"
                className="mr-sm-2"
                value={lea}
                onChange={(e) => setLea(e.target.value)}
              >
                <option value="">Select a LEA</option>
                {leas.map((lea) => (
                  <option key={lea.id} value={lea.id}>
                    {lea.name}
                  </option>
                ))}
              </FormControl>
            </td>
            <td>
              <FormControl
                as="select"
                placeholder="Ban Type"
                className="mr-sm-2"
                value={banType}
                onChange={(e) => setBanType(e.target.value)}
              >
                <option value="">Select a ban type</option>
                {banTypes.map((banType) => (
                  <option key={banType.id} value={banType.id}>
                    {banType.name}
                  </option>
                ))}
              </FormControl>
            </td>
            <td>
              {/*   <Form.Control
                type="date"
                placeholder="Date"
                className="mr-sm-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              /> */}
              <DatePicker
                onChange={(value: string) => setDate(value)}
                value={date}
              ></DatePicker>
            </td>
            <td>
              <Button variant="primary" onClick={addBan} disabled={pending}>
                Add
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Bans;
