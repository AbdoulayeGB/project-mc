// Exemple React pour modifier la date d'une mission
import React, { useState } from 'react';

function MissionDateEditor({ mission, onDateChange }) {
  const [date, setDate] = useState(mission.date);

  const handleChange = (e) => {
    setDate(e.target.value);
  };

  const handleSave = () => {
    onDateChange(mission.id, date);
  };

  return (
    <div>
      <input type="date" value={date} onChange={handleChange} />
      <button onClick={handleSave}>Enregistrer</button>
    </div>
  );
}

export default MissionDateEditor;