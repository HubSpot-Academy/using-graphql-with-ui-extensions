// Requirements
const axios = require('axios');

exports.main = async (context = {}) => {

  const { hs_object_id } = context.parameters;
  const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;

  try {
    const { data } = await fetchAssociatedBooks(
      query,
      PRIVATE_APP_TOKEN,
      hs_object_id
    );

    return data;
  } catch (e) {
    return e;
  }
};

// Declaring our function
const fetchAssociatedBooks = (query, token, hs_object_id) => {
  // Set our body for the axios call
  const body = {
    operationName: 'favoriteBook',
    query,
    variables: { hs_object_id }
  };
  // return the axios post
  return axios.post(
    'https://api.hubapi.com/collector/graphql',
    JSON.stringify(body),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// GraphQL query to fetch book associations.
const query = `
query favoriteBook($hs_object_id: String!) {
  CRM {
    contact(uniqueIdentifier: "hs_object_id", uniqueIdentifierValue: $hs_object_id) {
      associations {
        p_books_collection__books_to_contact {
          items {
            hs_object_id
            book_title
            author
            publisher
          }
        }
      }
    }
  }
}
`