import { useMemo, useState } from "react";
import { Button, FormControl, Table } from "react-bootstrap";
import { Book, useBookContext } from "../contexts/bookContext";
import { client } from "../App";
import { createBook } from "../graphql/mutations";
import { Link } from "react-router-dom";

interface CreateBookReturn {
  data: {
    createBook: {
      PK: string;
      SK: string;
      GSI1PK: string;
      GSI1SK: string;
      author: string;
      createdAt: string;
      createdBy: string;
      title: string;
      link: string;
    };
  };
}

const Books = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [link, setLink] = useState("");
  const [pending, setPending] = useState(false);

  const { books, setBooks } = useBookContext();

  const orderedBooks = useMemo(() => {
    return books.sort((a, b) => a.title.localeCompare(b.title));
  }, [books]);

  const addBook = async () => {
    setPending(true);
    try {
      const response = (await client.graphql({
        query: createBook,
        variables: {
          createBookInput: {
            title,
            author,
            link,
            isbn,
          },
        },
      })) as CreateBookReturn;
      const newBook: Book = {
        author: response.data.createBook.author,
        title: response.data.createBook.title,
        link: response.data.createBook.link,
        isbn: response.data.createBook.PK.split("#")[1],
      };
      setBooks([...books, newBook]);
      console.log("create book response", response);
    } catch (error) {
      console.error("create book error", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <h1>Books</h1>
      <Table>
        <thead>
          <tr>
            <th colSpan={5}>Add a Book</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              <FormControl
                type="text"
                placeholder="Title"
                className="mr-sm-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </th>
            <th>
              <FormControl
                type="text"
                placeholder="Author"
                className="mr-sm-2"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </th>
            <th>
              <FormControl
                type="text"
                placeholder="ISBN"
                className="mr-sm-2"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
            </th>
            <th>
              <FormControl
                type="text"
                placeholder="Link"
                className="mr-sm-2"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </th>
            <th>
              <Button variant="primary" disabled={pending} onClick={addBook}>
                Add
              </Button>
            </th>
          </tr>
        </tbody>
      </Table>
      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orderedBooks.map((book) => (
            <tr key={book.isbn}>
              <td>
                <Link to={`/books/${book.isbn}`}>{book.title}</Link>
              </td>
              <td>{book.author}</td>
              <td>{book.isbn}</td>
              <td>
                <Button variant="danger" disabled={pending}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Books;
