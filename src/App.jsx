import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const MAX_LENGTH = 100;
  const MIN_LENGTH = 8;

  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [isNumberAllowed, setIsNumberAllowed] = useState(false);
  const [isCharacterAllowed, setIsCharacterAllowed] = useState(false);
  const [savedPasswords, setSavedPasswords] = useState([]);

  const passwordRef = useRef(null);

  const copyPasswordToClipboard = async () => {
    try {
      passwordRef.current?.select();
      passwordRef.current?.setSelectionRange(0, password.length);

      await navigator.clipboard.writeText(password);
      alert("Password copied!");
    } catch (err) {
      console.error("Failed to copy password:", err);
    }
  };

  const generatePassword = useCallback(() => {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_+=,./<>?`~";

    let availableCharacters = letters;
    let generatedPassword = [];

    // Add required character types
    if (isNumberAllowed) {
      availableCharacters += numbers;
      generatedPassword.push(
        numbers[Math.floor(Math.random() * numbers.length)],
      );
    }

    if (isCharacterAllowed) {
      availableCharacters += symbols;
      generatedPassword.push(
        symbols[Math.floor(Math.random() * symbols.length)],
      );
    }

    // Fill remaining characters
    while (generatedPassword.length < length) {
      const randomIndex = Math.floor(
        Math.random() * availableCharacters.length,
      );
      generatedPassword.push(availableCharacters[randomIndex]);
    }

    // Shuffle password
    for (let i = generatedPassword.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [generatedPassword[i], generatedPassword[j]] = [
        generatedPassword[j],
        generatedPassword[i],
      ];
    }

    setPassword(generatedPassword.join(""));
  }, [length, isNumberAllowed, isCharacterAllowed]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const savePassword = () => {
    if (!password) return;

    setSavedPasswords((prev) => {
      if (prev.includes(password)) {
        alert("Password already saved!");
        return prev;
      }

      return [...prev, password];
    });
  };

  const deletePassword = (index) => {
    setSavedPasswords((prev) => prev.filter((_, i) => i !== index));
  };

  const resetSettings = () => {
    setLength(12);
    setIsNumberAllowed(false);
    setIsCharacterAllowed(false);
    setSavedPasswords([]);
    setPassword('');
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 rounded-xl shadow-lg bg-white flex flex-col gap-5 text-black">
      <h1 className="text-3xl font-bold text-center">Password Generator</h1>

      <div className="flex gap-2">
        <input
          ref={passwordRef}
          type="text"
          value={password}
          readOnly
          className="flex-1 border rounded-lg px-3 py-2 bg-gray-100 outline-none"
        />

        <button
          onClick={copyPasswordToClipboard}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg"
        >
          Copy
        </button>
      </div>

      <button
        onClick={generatePassword}
        className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
      >
        Generate New Password
      </button>

      <div>
        <label className="font-semibold">Password Length: {length}</label>

        <input
          type="range"
          min={MIN_LENGTH}
          max={MAX_LENGTH}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isNumberAllowed}
          onChange={(e) => setIsNumberAllowed(e.target.checked)}
        />
        Include Numbers
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isCharacterAllowed}
          onChange={(e) => setIsCharacterAllowed(e.target.checked)}
        />
        Include Special Characters
      </label>

      <div className="flex gap-3">
        <button
          onClick={savePassword}
          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg"
        >
          Save Password
        </button>

        <button
          onClick={resetSettings}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          Reset
        </button>
      </div>

      {savedPasswords.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Saved Passwords ({savedPasswords.length})
          </h2>

          <div className="space-y-2">
            {savedPasswords.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border rounded-lg p-2"
              >
                <span className="break-all">{item}</span>

                <button
                  onClick={() => deletePassword(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
