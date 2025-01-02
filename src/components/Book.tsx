import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../App";
import { getBook } from "../graphql/queries";
import { Book, DbBook } from "../contexts/bookContext";
import { Button, FormControl } from "react-bootstrap";
import { updateBook } from "../graphql/mutations";

interface GetBookReturn {
  data: {
    getBook: DbBook;
  };
}

const BookComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchBook = async (bookId: string) => {
    const response = (await client.graphql({
      query: getBook,
      variables: { getBookInput: { id: bookId } },
    })) as GetBookReturn;
    setBook({
      title: response.data.getBook.title,
      author: response.data.getBook.author,
      links: JSON.parse(response.data.getBook.links) as string[],
      id: response.data.getBook.PK.split("#")[1],
    });
    console.log("get book response", response);
  };

  useEffect(() => {
    fetchBook(id || "");
  }, [id]);

  const addLink = () => {
    if (book) {
      if (!book.links) {
        book.links = [];
      }
      book.links.push("");
      setBook({ ...book });
    }
  };

  const saveBook = async () => {
    setSaving(true);
    try {
      const response = await client.graphql({
        query: updateBook,
        variables: {
          updateBookInput: {
            id: book?.id,
            title: book?.title,
            author: book?.author,
            links: JSON.stringify(book?.links),
          },
        },
      });
      console.log("update book response", response);
      // setBook({
      //   title: response.data.updateBook.title,
      //   author: response.data.updateBook.author,
      //   links: JSON.parse(response.data.updateBook.links),
      //   id: response.data.updateBook.PK.split("#")[1],
      // });
    } catch (error) {
      console.error("update book error", error);
    }
    setSaving(false);
  };

  return (
    <div>
      <h1>Book</h1>
      <p>ID: {id}</p>
      <p>
        Title:{" "}
        <FormControl
          value={book?.title}
          onChange={(e) => {
            if (book) {
              book.title = e.target.value;
              setBook({ ...book });
            }
          }}
        />
      </p>
      <p>
        Author:
        <FormControl
          value={book?.author}
          onChange={(e) => {
            if (book) {
              book.author = e.target.value;
              setBook({ ...book });
            }
          }}
        />
      </p>
      <p>Links: </p>
      {book?.links.map((link, i) => (
        <p>
          <FormControl
            key={i}
            value={link}
            onChange={(e) => {
              if (book) {
                book.links[i] = e.target.value;
                setBook({ ...book });
              }
            }}
          />
          <a key={i} href={link} target="_blank" rel="noreferrer">
            {link}
          </a>
        </p>
      ))}
      <Button onClick={addLink}>Add Link</Button>
      <p className="mt-4">
        <Button onClick={saveBook} disabled={saving}>
          Save Book
        </Button>
      </p>
    </div>
  );
};

export default BookComponent;
