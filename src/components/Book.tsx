import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../App";
import { getBook } from "../graphql/queries";
import { Book } from "../contexts/bookContext";

interface GetBookReturn {
  data: {
    getBook: {
      PK: string;
      SK: string;
      author: string;
      title: string;
      link: string;
      createdBy: string;
      createdAt: string;
    };
  };
}

const BookComponent = () => {
  const { isbn } = useParams<{ isbn: string }>();
  const [book, setBook] = useState<Book | null>(null);

  const fetchBook = async (isbn: string) => {
    const response = (await client.graphql({
      query: getBook,
      variables: { getBookInput: { isbn } },
    })) as GetBookReturn;
    setBook({
      title: response.data.getBook.title,
      author: response.data.getBook.author,
      link: response.data.getBook.link,
      isbn: response.data.getBook.PK.split("#")[1],
    });
    console.log("get book response", response);
  };

  useEffect(() => {
    fetchBook(isbn || "");
  }, [isbn]);

  return (
    <div>
      <h1>Book</h1>
      <p>ISBN: {isbn}</p>
      <p>Title: {book?.title}</p>
      <p>Author: {book?.author}</p>
      <p>
        Link:{" "}
        <a href={book?.link} target="_blank" rel="noreferrer">
          {book?.link}
        </a>
      </p>
    </div>
  );
};

export default BookComponent;
