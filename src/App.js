import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import uuid from 'react-uuid';

// const EXCHANGE_RATES = gql`
//   query GetExchangeRates {
//     rates(currency: "INR") {
//       currency
//       rate
//     }
//   }
// `;

const USER_FIELDS = gql`
  fragment userFields on users {
    id
    name
    age @client
    rocket
    __typename
  }
`

const GET_USERS = gql`
  query getUsers {
    users {
      ...userFields
    }
  }
  ${USER_FIELDS}
`;
const INSERT_USER = gql`
  mutation insertUser($name: String!,$rocket: String!) {
    insert_users(objects: { name: $name, rocket: $rocket }) {
      returning {
        ...userFields
      }
    }
  }
  ${USER_FIELDS}
`;

function App() {
  // const { loading, error, data } = useQuery(EXCHANGE_RATES);
  const {
    data,
    loading,
    error,
    // refetch
  } = useQuery(GET_USERS);
  const [name, setName] = useState("");
  const [rocket, setRocket] = useState("");
  const [insertUser] = useMutation(INSERT_USER);
  const addUser = () => {
    insertUser({
      variables: {
        name: name,
        rocket: rocket
      },
      onCompleted: (data) => {
        setName("");
        setRocket("");
        // refetch();
        console.log(data)
      },
      update(cache, { data }) {
        const { users } = cache.readQuery({
          query: GET_USERS
        });

        cache.writeQuery({
          query: GET_USERS,
          data: {
            users: [
              ...data.insert_users.returning,
              ...users
            ]
          }
        })
      },
      optimisticResponse: {
        __typename: 'Mutation',
        insert_users: {
          returning: [
            {
              __typename: 'users',
              id: uuid(),
              name: "loading",
              rocket: "loading"
            }
          ]
        }
      }
    });
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error...</p>
  }
  return (
    <>
      <h1>Apollo Client Mutation Tutorial</h1>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" value={rocket} onChange={(e) => setRocket(e.target.value)} />
      <button onClick={addUser}>
        Add User
      </button>
      {
        data.users.map((user) => {
          console.log("id:",user.id,"age:",user.age);
          return (
            <div key={user.id}>
              {user.name} {user.rocket}
            </div>
          )
        })
      }
      {/* <h1>Apollo Client Tutorial</h1>
      <div>
        {
          data.rates.map(({ currency, rate }) => (
            <div key={currency}>
              <p>
                {currency}: {rate}
              </p>
            </div>
          ))
        }
      </div> */}
    </>
  );
}

export default App;
