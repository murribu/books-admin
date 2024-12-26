import { useEffect, useMemo, useState } from "react";
import { Button, Form, FormControl, Modal, Table } from "react-bootstrap";
import { Ban, useBookContext } from "../contexts/bookContext";
import { client } from "../App";
import { createBan, deleteBan } from "../graphql/mutations";
import { getAllBans, getBansByIsbn, getBansByLea } from "../graphql/queries";
import { Link, useLocation, useNavigate } from "react-router-dom";

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

interface GetAllBansReturn {
  data: { getAllBans: DbBan[] };
}

interface GetBansByIsbnReturn {
  data: { getBansByIsbn: DbBan[] };
}

interface GetBansByLeaReturn {
  data: { getBansByLea: DbBan[] };
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
    })) as GetAllBansReturn;
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
  const navigate = useNavigate();
  const { search } = useLocation();
  const [isbn, setIsbn] = useState("");
  const [lea, setLea] = useState("");
  const [date, setDate] = useState("");
  const [banType, setBanType] = useState("");
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [link, setLink] = useState("");
  const [filteredIsbn, setFilteredIsbn] = useState("");
  const [filteredLea, setFilteredLea] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [banToRemove, setBanToRemove] = useState<Ban | undefined>();

  const fetchBansByIsbn = async (isbn: string) => {
    setFetching(true);
    try {
      const response = (await client.graphql({
        query: getBansByIsbn,
        variables: {
          getBansByIsbnInput: {
            isbn,
          },
        },
      })) as GetBansByIsbnReturn;
      setBans(
        response.data.getBansByIsbn.map((b) => ({
          isbn: b.SK.split("#")[0],
          banTypeId: b.banTypeId,
          date: b.SK.split("#")[1],
          leaId: b.SK.split("#")[2],
          whenBanned: b.SK.split("#")[1],
          links: JSON.parse(b.links),
        }))
      );
      console.log("get bans by isbn response", response);
    } catch (error) {
      console.error("get bans by isbn error", error);
    } finally {
      setFetching(false);
    }
  };

  const fetchBansByLea = async (leaId: string) => {
    setFetching(true);
    try {
      const response = (await client.graphql({
        query: getBansByLea,
        variables: {
          getBansByLeaInput: {
            leaId,
          },
        },
      })) as GetBansByLeaReturn;
      console.log("get bans by lea response", response);
      setBans(
        response.data.getBansByLea.map((b) => ({
          isbn: b.SK.split("#")[0],
          banTypeId: b.banTypeId,
          date: b.SK.split("#")[1],
          leaId: b.SK.split("#")[2],
          whenBanned: b.SK.split("#")[1],
          links: JSON.parse(b.links),
        }))
      );
    } catch (error) {
      console.error("get bans by lea error", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(search);
    const isbnParam = params.get("isbn");
    const leaParam = params.get("lea");
    if (isbnParam) {
      fetchBansByIsbn(isbnParam);
      setFilteredIsbn(isbnParam);
      setFilteredLea("");
      return;
    }
    if (leaParam) {
      fetchBansByLea(leaParam);
      setFilteredLea(leaParam);
      setFilteredIsbn("");
      return;
    }
    fetchAllBans(setFetching, setBans);
    setFilteredIsbn("");
    setFilteredLea("");
  }, [search]);

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
            <th>Link</th>
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
        </tbody>
      </Table>
      <Table>
        <thead>
          <tr>
            <th>
              Filter by Book:{" "}
              <FormControl
                as="select"
                placeholder="Book"
                className="mr-sm-2"
                value={filteredIsbn}
                onChange={(e) => navigate(`/bans?isbn=${e.target.value}`)}
              >
                <option value="">Select a book</option>
                {orderedBooks.map((book) => (
                  <option key={book.isbn} value={book.isbn}>
                    {book.title}
                  </option>
                ))}
              </FormControl>
            </th>
            <th>
              Filter by LEA:{" "}
              <FormControl
                as="select"
                placeholder="LEA"
                className="mr-sm-2"
                value={filteredLea}
                onChange={(e) => navigate(`/bans?lea=${e.target.value}`)}
              >
                <option value="">Select a LEA</option>
                {leas.map((lea) => (
                  <option key={lea.id} value={lea.id}>
                    {lea.name}
                  </option>
                ))}
              </FormControl>
            </th>
          </tr>
          <tr>
            <th>Book</th>
            <th>LEA</th>
            <th>Ban Type</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
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
                    <Button
                      variant="danger"
                      onClick={() => {
                        setBanToRemove(ban);
                        setShowModal(true);
                      }}
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this ban?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {banToRemove && (
            <Button
              variant="danger"
              onClick={() =>
                removeBan(
                  banToRemove?.isbn,
                  banToRemove?.leaId,
                  banToRemove?.whenBanned,
                  setSaving
                )
              }
            >
              Confirm
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Bans;
