'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface PreferencesFormProps {
  userId: string; // Specify the type for userId
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ userId }) => {
  const [preferences, setPreferences] = useState({
    preferredGender: '',
    minAge: '',
    maxAge: '',
    minHeight: '',
    maxHeight: '',
    preferredReligion: '',
    preferredDiet: '',
  });

  useEffect(() => {
    // Fetch existing preferences if available
    const fetchPreferences = async () => {
      try {
        const response = await axios.get(`/api/preferences/${userId}`);
        if (response.data) {
          setPreferences(response.data);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };
    fetchPreferences();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/preferences`, {
        userId,
        ...preferences,
      });
      // Handle response (e.g., show success message or redirect)
      console.log("Preferences saved:", response.data);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Set Your Partner Preferences</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="preferredGender">
          Preferred Gender
        </label>
        <input
          type="text"
          id="preferredGender"
          name="preferredGender"
          value={preferences.preferredGender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="e.g., Male, Female, Any"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="minAge">
          Minimum Age
        </label>
        <input
          type="number"
          id="minAge"
          name="minAge"
          value={preferences.minAge}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="e.g., 20"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="maxAge">
          Maximum Age
        </label>
        <input
          type="number"
          id="maxAge"
          name="maxAge"
          value={preferences.maxAge}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="e.g., 30"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="minHeight">
          Minimum Height (cm)
        </label>
        <input
          type="number"
          id="minHeight"
          name="minHeight"
          value={preferences.minHeight}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="e.g., 150"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="maxHeight">
          Maximum Height (cm)
        </label>
        <input
          type="number"
          id="maxHeight"
          name="maxHeight"
          value={preferences.maxHeight}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="e.g., 180"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="preferredReligion">
          Preferred Religion
        </label>
        <input
          type="text"
          id="preferredReligion"
          name="preferredReligion"
          value={preferences.preferredReligion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="e.g., Hindu, Muslim"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="preferredDiet">
          Preferred Diet
        </label>
        <input
          type="text"
          id="preferredDiet"
          name="preferredDiet"
          value={preferences.preferredDiet}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="e.g., Vegetarian, Non-Vegetarian"
        />
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Save Preferences
      </button>
    </form>
  );
};

export default PreferencesForm;
