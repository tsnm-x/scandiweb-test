import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache(),
});

const getData = async (query) => {
    const data = await client.query({
        query: gql`${query}`,
    })

    return data;
}


export {client, getData};