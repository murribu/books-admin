import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../App";
import { getBook } from "../graphql/queries";
import { Book, DbBook } from "../contexts/bookContext";

interface GetBookReturn {
  data: {
    getBook: DbBook;
  };
}

const BookComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);

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

  return (
    <div>
      <h1>Book</h1>
      <p>ID: {id}</p>
      <p>Title: {book?.title}</p>
      <p>Author: {book?.author}</p>
      <p>Links: </p>
      {book?.links.map((link, i) => (
        <p>
          <a key={i} href={link} target="_blank" rel="noreferrer">
            {link}
          </a>
        </p>
      ))}
    </div>
  );
};

export default BookComponent;
