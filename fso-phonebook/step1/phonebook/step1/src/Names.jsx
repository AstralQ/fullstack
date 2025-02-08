export const Names = ({ persons, deleteName }) => {
  return (
    <div>
      {persons.name} {persons.number}
      <button onClick={() => deleteName(persons.id)}>Delete</button>
    </div>
  );
};

  