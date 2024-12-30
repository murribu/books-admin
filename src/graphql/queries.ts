export const getOmni = `query GetOmni {
  getOmni {
    PK
    SK
    books {
      author
      count
      id
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
    links
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

export const getBansByLea = `query GetBansByLea($getBansByLeaInput: GetBansByLeaInput!) {
  getBansByLea(getBansByLeaInput: $getBansByLeaInput) {
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

export const getBansByBookId = `query GetBansByBookId($getBansByBookIdInput: GetBansByBookIdInput!) {
  getBansByBookId(getBansByBookIdInput: $getBansByBookIdInput) {
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
