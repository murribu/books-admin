export const createBan = `mutation CreateBan($createBanInput: CreateBanInput!) {
  createBan(createBanInput: $createBanInput) {
    PK
    SK
    GSI1PK
    GSI1SK
    title
    isbn
    author
    leaName
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

export const createBanType = `mutation CreateBanType($createBanTypeInput: CreateBanTypeInput!) {
  createBanType(createBanTypeInput: $createBanTypeInput) {
    PK
    SK
    banTypes {
      id
      name
      score
    }
  }
}`;
