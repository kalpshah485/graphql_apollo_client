import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

// const EXCHANGE_RATES = gql`
//   query GetExchangeRates {
//     rates(currency: "INR") {
//       currency
//       rate
//     }
//   }
// `;
const GET_USERS = gql`
  query getUsers {
    users {
      id
      name
      rocket
    }
  }
`;
const INSERT_USER = gql`
  mutation insertUser($name: String!,$rocket: String!) {
    insert_users(objects: { name: $name, rocket: $rocket }) {
      returning {
        id
        name
        rocket
        timestamp
      }
    }
  }
`;

function App() {
  // const { loading, error, data } = useQuery(EXCHANGE_RATES);
  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const [name, setName] = useState("");
  const [rocket, setRocket] = useState("");
  console.log(data);
  const [insertUser] = useMutation(INSERT_USER);
  const addUser = () => {
    insertUser({
      variables: {
        name: name,
        rocket: rocket
      },
      onCompleted: (data) => {
        refetch();
        console.log(data)
      }
    }
    );
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
