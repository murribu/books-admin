import { FC, createContext, useContext, useState } from "react";

export interface Book {
  title: string;
  id: string;
  author: string;
}

export interface Ban {
  bookId: string;
  leaId: string;
}

export interface Lea {
  name: string;
  id: string;
  county: string;
  score: number;
}

export interface County {
  name: string;
  id: string;
}

export interface BookContextInterface {
  books: Book[];
  setBooks: (books: Book[]) => void;
  leas: Lea[];
  setLeas: (leas: Lea[]) => void;
  bans: Ban[];
  setBans: (bans: Ban[]) => void;
  counties: County[];
  setCounties: (counties: County[]) => void;
}
interface BookProviderProps {
  children: React.ReactNode;
}

const notYetImplemented = () => {
  throw new Error("Not yet implemented");
};

const defaultValue: BookContextInterface = {
  books: [],
  setBooks: notYetImplemented,
  leas: [],
  setLeas: notYetImplemented,
  bans: [],
  setBans: notYetImplemented,
  counties: [],
  setCounties: notYetImplemented,
};

export const BookContext = createContext(defaultValue);

export const useBookContext = () => useContext(BookContext);

export const BookContextProvider: FC<BookProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [leas, setLeas] = useState<Lea[]>([]);
  const [bans, setBans] = useState<Ban[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  return (
    <BookContext.Provider
      value={{
        books,
        setBooks,
        leas,
        setLeas,
        bans,
        setBans,
        counties,
        setCounties,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
