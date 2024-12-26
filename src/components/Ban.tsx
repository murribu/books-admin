import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Ban, Book, Lea, useBookContext } from "../contexts/bookContext";
import { Button } from "react-bootstrap";
import { fetchAllBans, removeBan } from "./Bans";

const BanComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { bans, setBans, books, leas } = useBookContext();
  const [ban, setBan] = useState<Ban | undefined>(undefined);
  const [book, setBook] = useState<Book | null>(null);
  const [lea, setLea] = useState<Lea | null>(null);
  const [saving, setSaving] = useState(false);

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
      <p>Links: {ban?.links.join(", ")}</p>
      <p>
        {ban && (
          <Button
            variant="danger"
            onClick={() =>
              removeBan(ban.isbn, ban.leaId, ban.whenBanned, setSaving)
            }
          >
            Remove Ban
          </Button>
        )}
      </p>
    </div>
  );
};

export default BanComponent;
