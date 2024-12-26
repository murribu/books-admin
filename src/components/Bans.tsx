import { useEffect, useMemo, useState } from "react";
import { Button, Form, FormControl, Table } from "react-bootstrap";
import { Ban, useBookContext } from "../contexts/bookContext";
import { client } from "../App";
import { createBan, deleteBan } from "../graphql/mutations";
import { getAllBans } from "../graphql/queries";
import { Link } from "react-router-dom";

interface CreateBanReturn {
  data: { createBan: DbBan };
}

interface DbBan {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  title: string;
  author: string;
  banTypeId: string;
  leaName: string;
  links: string;
  createdAt: string;
  createdBy: string;
}

interface getAllBansReturn {
  data: { getAllBans: DbBan[] };
}

export const removeBan = async (
  isbn: string,
  leaId: string,
  whenBanned: string,
  setSaving: (saving: boolean) => void
) => {
  setSaving(true);
  try {
    const response = await client.graphql({
      query: deleteBan,
      variables: {
        deleteBanInput: {
          isbn,
          leaId,
          whenBanned,
        },
      },
    }); // as DeleteBanReturn;
    console.log("delete ban response", response);
  } catch (error) {
    console.error("delete ban error", error);
  } finally {
    setSaving(false);
  }
};

export const fetchAllBans = async (
  setFetching: (fetching: boolean) => void,
  setBans: (bans: Ban[]) => void
) => {
  setFetching(true);
  try {
    const response = (await client.graphql({
      query: getAllBans,
    })) as getAllBansReturn;
    setBans(
      response.data.getAllBans.map((b) => ({
        isbn: b.SK.split("#")[0],
        banTypeId: b.banTypeId,
        date: b.SK.split("#")[1],
        leaId: b.SK.split("#")[2],
        whenBanned: b.SK.split("#")[1],
        links: JSON.parse(b.links),
      }))
    );
    console.log("get all bans response", response);
  } catch (error) {
    console.error("get all bans error", error);
  } finally {
    setFetching(false);
  }
};

const Bans = () => {
  const { books, leas, banTypes, bans, setBans } = useBookContext();
  const [isbn, setIsbn] = useState("");
  const [lea, setLea] = useState("");
  const [date, setDate] = useState("");
  const [banType, setBanType] = useState("");
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [link, setLink] = useState("");

  useEffect(() => {
    fetchAllBans(setFetching, setBans);
  }, []);

  const orderedBooks = useMemo(
    () => books.sort((a, b) => a.title.localeCompare(b.title)),
    [books]
  );

  const addBan = async () => {
    setSaving(true);
    try {
      const response = (await client.graphql({
        query: createBan,
        variables: {
          createBanInput: {
            isbn,
            leaId: lea,
            whenBanned: date,
            leaName: leas.find((l) => l.id === lea)?.name,
            banTypeId: banType,
            links: JSON.stringify([link]),
          },
        },
      })) as CreateBanReturn;
      console.log("create ban response", response);
      setIsbn("");
      setLea("");
      setDate("");
      setBanType("");
      setLink("");
      fetchAllBans(setFetching, setBans);
    } catch (error) {
      console.error("create ban error", error);
    } finally {
      setSaving(false);
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
            <th>Links</th>
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
                {orderedBooks.map((book) => (
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
              <Form.Control
                type="date"
                placeholder="Date"
                className="mr-sm-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </td>
            <td>
              <FormControl
                placeholder="Link"
                className="mr-sm-2"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </td>
            <td>
              <Button variant="primary" onClick={addBan} disabled={saving}>
                Add
              </Button>
            </td>
          </tr>
          {fetching ? (
            <tr>
              <td colSpan={5}>Fetching...</td>
            </tr>
          ) : bans.length === 0 ? (
            <tr>
              <td colSpan={5}>No bans</td>
            </tr>
          ) : (
            bans.map((ban) => {
              const book = books.find((b) => b.isbn === ban.isbn);
              return (
                <tr key={ban.isbn + ban.leaId}>
                  <td>
                    <Link
                      to={`/bans/${ban.isbn}:${ban.leaId}:${ban.whenBanned}`}
                    >
                      {book?.title}
                    </Link>
                  </td>
                  <td>{leas.find((l) => l.id === ban.leaId)?.name}</td>
                  <td>{banTypes.find((b) => b.id === ban.banTypeId)?.name}</td>
                  <td>{ban.whenBanned}</td>
                  <td>
                    {ban.links?.map((link) => (
                      <a key={link} href={link}>
                        {link}
                      </a>
                    ))}
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() =>
                        removeBan(
                          ban.isbn,
                          ban.leaId,
                          ban.whenBanned,
                          setSaving
                        )
                      }
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Bans;
