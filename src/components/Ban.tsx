import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Ban, Book, Lea, useBookContext } from "../contexts/bookContext";
import { Button, FormControl, Modal } from "react-bootstrap";
import { fetchAllBans, removeBan } from "./Bans";
import { client } from "../App";
import { updateBan } from "../graphql/mutations";

const BanComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { bans, setBans, books, leas } = useBookContext();
  const [ban, setBan] = useState<Ban | undefined>(undefined);
  const [book, setBook] = useState<Book | null>(null);
  const [lea, setLea] = useState<Lea | null>(null);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isbn = id?.split(":")[0];
    const leaId = id?.split(":")[1];
    const whenBanned = id?.split(":")[2];
    setBan(
      bans.find(
        (b) =>
          b.isbn === isbn && b.leaId === leaId && b.whenBanned === whenBanned
      )
    );
    setBook(books.find((b) => b.isbn === isbn) || null);
    setLea(leas.find((l) => l.id === leaId) || null);
    console.log("ban", ban, "bans", bans);
  }, [id, bans]);

  useEffect(() => {
    if (!bans || bans.length === 0) {
      fetchAllBans(setSaving, setBans);
    }
  }, []);

  const addLink = () => {
    if (ban) {
      if (!ban.links) {
        ban.links = [];
      }
      ban.links.push("");
      setBan({ ...ban });
    }
  };

  const saveBan = async () => {
    setSaving(true);
    try {
      const response = await client.graphql({
        query: updateBan,
        variables: {
          updateBanInput: {
            isbn: ban?.isbn,
            leaId: ban?.leaId,
            whenBanned: ban?.whenBanned,
            links: JSON.stringify(ban?.links),
          },
        },
      }); // as UpdateBanReturn;
      console.log("update ban response", response);
    } catch (e) {
      console.error("update ban error", e);
    }
    setSaving(false);
  };

  return (
    <div>
      <h1>Ban</h1>
      <p>ISBN: {id}</p>
      <p>
        Title: <Link to={`/books/${book?.isbn}`}>{book?.title}</Link>
      </p>
      <p>Author: {book?.author}</p>
      <p>LEA: {lea?.name}</p>
      <p>When Banned: {ban?.whenBanned}</p>
      Links:
      {ban?.links?.map((l, index) => (
        <p key={index}>
          <FormControl
            value={l}
            onChange={(e) => {
              if (ban) {
                ban.links[ban.links.indexOf(l)] = e.target.value;
                setBan({ ...ban });
              }
            }}
          />
        </p>
      ))}
      <Button onClick={addLink}>Add Link</Button>
      <p>
        {ban && (
          <>
            <Button disabled={saving} onClick={saveBan} className="mx-2">
              Save Ban
            </Button>
            <Button
              variant="danger"
              disabled={saving}
              onClick={() => setShowModal(true)}
            >
              Remove Ban
            </Button>
          </>
        )}
      </p>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this ban?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {ban && (
            <Button
              variant="danger"
              onClick={() =>
                removeBan(ban?.isbn, ban?.leaId, ban?.whenBanned, setSaving)
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

export default BanComponent;
