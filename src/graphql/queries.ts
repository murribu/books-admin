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

export const getAllBans = `query GetAllBans {
  getAllBans {
    PK
    SK
    GSI1PK
    GSI1SK
    title
    author
    banTypeId
    leaName
    links
    createdAt
    createdBy
  }
}`;
