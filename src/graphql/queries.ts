export const getOmni = `query GetOmni {
  getOmni {
    PK
    SK
    books {
      author
      count
      isbn
      title
    }
    leas {
      county
      id
      name
      score
    }
    banTypes {
      id
      name
      score
    }
    tags
  }
}`;

export const getBook = `query GetBook($getBookInput: GetBookInput!) {
  getBook(getBookInput: $getBookInput) {
    PK
    SK
    author
    title
    link
    createdBy
    createdAt
  }
}`;
