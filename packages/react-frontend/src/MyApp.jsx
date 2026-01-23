import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([]);
    function removeOneCharacter(index) {
        const characterToDelete = characters[index];
        deleteUser(characterToDelete.id)
        .then((res) => {
            if (res.status === 204) {
                const updated = characters.filter((character, i) => {
                    return i !== index;
                });
                setCharacters(updated);
            }
            else if (res.status === 404) {
                console.log("Resource not found");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    function updateList(person) {
    postUser(person)
        .then((res) => {if (res.status === 201) return res.json()})
        .then((newUser) => {setCharacters([...characters, newUser])})
        .catch((error) => {
            console.log(error);
        });
    }
    useEffect(() => {
    fetchUsers()
        .then((res) => res.json())
        .then((json) => setCharacters(json["users_list"]))
        .catch((error) => {
            console.log(error);
        });
    }, []);
    return (
        <div className="container">
            <Table 
            characterData={characters} 
            removeCharacter={removeOneCharacter}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}

function fetchUsers() {
  const promise = fetch("http://localhost:8000/users");
  return promise;
}

function postUser(person) {
  const promise = fetch("Http://localhost:8000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(person),
  });

  return promise;
}

function deleteUser(id) {
    const promise = fetch(`Http://localhost:8000/users/${id}`, {
        method: "DELETE"
    });
    return promise;
}

export default MyApp;
