import { FC, createContext, useContext, useState } from "react";

export interface Book {
  title: string;
  isbn: string;
  author: string;
  link?: string;
  index?: number;
}

export interface Ban {
  isbn: string;
  leaId: string;
  banTypeId: string;
  whenBanned: string;
  links: string[];
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

export interface Tag {
  name: string;
  index: number;
}

export interface BanType {
  id: string;
  name: string;
  score: number;
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
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  banTypes: BanType[];
  setBanTypes: (banTypes: BanType[]) => void;
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
  tags: [],
  setTags: notYetImplemented,
  banTypes: [],
  setBanTypes: notYetImplemented,
};

export const BookContext = createContext(defaultValue);

export const useBookContext = () => useContext(BookContext);

export const BookContextProvider: FC<BookProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [leas, setLeas] = useState<Lea[]>([]);
  const [bans, setBans] = useState<Ban[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [banTypes, setBanTypes] = useState<BanType[]>([]);
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
        tags,
        setTags,
        banTypes,
        setBanTypes,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
