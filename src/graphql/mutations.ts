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
