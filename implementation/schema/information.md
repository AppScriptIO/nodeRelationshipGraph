API Schema
(While the database models are separate in their own functions or could be exposed through a clas module)

- Resolver function = a function that returns data.
- Data loader = module that aggregates duplicate calls. Solving the n+1 problem, where each query has a subsequent query, linear graph. To nodejs it uses nextTick function to analyse the promises before their execution and prevent multiple round trips to the server for the same data.
- Mapping - through rosolver functions.
- Schema = is the structure & relationships of the api data. i.e. defines how a client can fetch and update data.
    each schema has api entrypoints. Each field corresponds to a resolver function.
Data fetching complexity and data structuring is handled by server side rather than client.

3 types of possible api actions: 
- Query
- Mutation
- Subscription - creates a steady connection with the server.

Fetching approaches: 
• Imperative fetching: 
    - constructs & sends HTTP request, e.g. using js fetch.
    - receive & parse server response.
    - store data locally, e.g. in memory or persistent. 
    - display UI.
• Declarative fetching e.g. using GraphQL clients: 
    - Describe data requirements.
    - Display information in the UI.

Request: 
{
    action: query,
    entrypoint: {
        key: "Article"
    },
    function: {
        name: "single",
        args: {
            key: "article1"
        }
    },
    field: [
        {
            keyname: "title"
        },
        {
            keyname: "paragraph"
        },
        {
            keyname: "authors"
        },
    ]
}

Response :
{
    data: {
        title: "...",
        paragraph: '...',
        author: {
            name: '...',
            age: 20
        }
    }
}


Nested Unit execution steps:  
• 