export const createBan = `mutation CreateBan($input: CreateBanInput!) {
  createBan(input: $input) {
    PK
    SK
    GSI1PK
    GSI1SK
    title
    isbn
    author
    createdBy
    createdAt
  }
}`;

export const createBook = `mutation CreateBook($createBookInput: CreateBookInput!) {
  createBook(createBookInput: $createBookInput) {
    PK
    SK
    GSI1PK
    GSI1SK
    title
    link
    author
    createdBy
    createdAt
  }
}`;
