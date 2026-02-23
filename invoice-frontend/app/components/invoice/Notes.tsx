"use client";

import { useState, useEffect } from "react";

interface Props {
  notes: string;
  setNotes: (value: string) => void;
}

export const Notes = ({ notes, setNotes }: Props) => {
  const [textNotes, setTextNotes] = useState(notes);

  // Sincroniza cambios del padre
  useEffect(() => {
    setTextNotes(notes);
  }, [notes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextNotes(e.target.value);
    setNotes(e.target.value); // Actualiza el estado del padre
  };

  return (
    <>
      <p className="text-xs text-gray-600 font-light mb-1">Notes</p>
      <textarea
        value={textNotes}
        onChange={handleChange}
        className="w-full text-xs text-gray-800 hover:border border-dashed border-gray-300 rounded-md px-1 py-1 focus:outline-none focus:border-gray-400"
        name="previewNotes"
        id="previewNotes"
        rows={1}
        placeholder="This is a note..."
      />
    </>
  );
};