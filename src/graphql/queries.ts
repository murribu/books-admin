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
    tags
  }
}`;
