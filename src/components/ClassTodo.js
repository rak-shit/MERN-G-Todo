import React, { Component } from 'react'
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo'

const GET_TODOS = gql`
  {
    todos {
      text
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    addTodo(text: $text) {
      text,
      _id
    }
  }
`;

const DELETE_TODO = gql`
  mutation removeTodo($text: String!) {
    removeTodo(text: $text) {
      text
    }
  }
`;

export class ClassTodo extends Component {
    handleChange = (event) => {
        this.setState({
            item: event.target.value
        })
    }
    
    render() {
        let input
        return (
            <div>
                <Mutation mutation={ADD_TODO}
                    update={(cache, { data: { addTodo } }) => {
                        const { todos } = cache.readQuery({ query: GET_TODOS });
                        cache.writeQuery({
                          query: GET_TODOS,
                          data: { todos: todos.concat([addTodo]) },
                        });
                    }}
                >
                    {addTodo => (
                        <div>
                            <form onSubmit={
                                e => {
                                    e.preventDefault();
                                    addTodo({
                                        variables: {text: input.value}
                                    });
                                    input.value = '';
                                }
                            }>
                                <input
                                    ref={node => {
                                        input = node;
                                    }}
                                />
                                <button type="submit">Add Todo</button>
                            </form>
                        </div>
                    )}
                </Mutation>
                <Query query={GET_TODOS}>
                    {({ loading, error, data }) => {
                        if (loading) return <div>Fetching</div>
                        if (error) return <div>Error</div>
    
                        const todos = data.todos
    
                        return (
                            <div>
                                <ul>
                                    {todos.map((todo) => <div>
                                                            <li key={todo.id}>{todo.text}</li>
                                                            <Mutation mutation={DELETE_TODO}
                                                                update={(cache, { data: { deleteTodo }}) => {
                                                                    const { todos } = cache.readQuery({ query: GET_TODOS });
                                                                    cache.writeQuery({
                                                                        query: GET_TODOS,
                                                                        data: { todos: todos.filter(el => el.text != todo.text) },
                                                                    });
                                                                }}
                                                            >
                                                                {deleteTodo => (
                                                                    <button type="button" onClick={
                                                                        e => {
                                                                            console.log(todo.text)
                                                                            deleteTodo({variables: {text: todo.text}});
                                                                        }
                                                                    }>Delete</button>
                                                                )}
                                                            </Mutation>
                                                        </div>)}
                                </ul>
                            </div>
                        )
                    }}
                </Query>
            </div>
        )
    }
}

export default ClassTodo
