import React, {useState, useEffect} from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import  { API, graphqlOperation } from 'aws-amplify';
import { createNote, deleteNote, updateNote } from './graphql/mutations';
import { listNotes } from './graphql/queries';

function App() {

  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({ note :""});

  const deleteNoteById = (id) => setNotes(notes.filter(note => note.id !== id ));
  
  const handleChange = (e) => {
    setNote({note: e.target.value});
  }

  const submitNote = async(e) => {
    e.preventDefault();
    const result = await API.graphql(graphqlOperation(createNote, { input: note}));
    setNotes([...notes, result.data.createNote]);
    setNote({ note :""});
  }

  const deleteItem = async (noteId) =>{
    const input = {id: noteId};
    const result = await API.graphql(graphqlOperation(deleteNote, {input}));
    let {data:{deleteNote:{id}}} = result;
    deleteNoteById(id)
  }

  const editNote = async({id, note}) => {
    setNote({note});
    if(notes.some(o => o.id === id)){
      deleteNoteById(id)
      // const result = await API.graphql(graphqlOperation(updateNote, { input: {id,note}}));
      // setNotes([...notes, result.data.updateNote]);
      // setNote({ note :""});
    }
  }

  useEffect(() => {
    const fetchNotes = async() => { 
      const result = await API.graphql(graphqlOperation(listNotes));  
      setNotes(result.data.listNotes.items);
    }
    fetchNotes();

  }, []);

    return (
      <div className="flex flex-column items-ceter justify-center pa3">
        <h1 className='f2-l'> Notes </h1> 
        <form className='mb3' onSubmit={submitNote}>
        <input classame='pa2 f4' placeholder='your note'  value={note.note}  onChange={handleChange} />
        <button classame='pa2 f4' type='submit'> Add </button>
        </form>
        <div>
          { notes.length > 0 &&

            <div>
            {
              notes.map( ({id, note}) => (
                <div key={id}  >
                <span onClick={() => {editNote({id,note})}}>{` -- ${note} -- `}</span>
                <button onClick={() => deleteItem(id)}> Delete </button>
                </div>
                )
              )}
            </div>
          }
    
        </div>
      </div>
    );

}

export default withAuthenticator(App, {includeGreetings: true});
