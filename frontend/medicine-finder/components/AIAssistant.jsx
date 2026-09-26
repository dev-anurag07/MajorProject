import React, { useState } from "react";
import API from "../services/api";
import ReactMarkdown from "react-markdown";

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!message.trim()) return;

    const selectedAddress = JSON.parse(
      localStorage.getItem("selectedAddress")
    );

    if (!selectedAddress) {
      setResponse("Please select an address first.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/user/ai", {
        message: message,
        lat: selectedAddress.location.coordinates[1],
        lang: selectedAddress.location.coordinates[0],
      });

      setResponse(res.data.message);
    } catch (error) {
      console.log(error);
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-5 mt-6">
      <h2 className="text-xl font-semibold mb-4">
        🤖 MediFinder AI
      </h2>

      <div className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something like: Find paracetamol near me"
          className="flex-1 border rounded-lg p-3"
        />

        <button
          onClick={askAI}
          disabled={loading}
          className="bg-green-600 text-white px-5 rounded-lg"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      {response && (
        <div className="mt-4 bg-gray-100 rounded-lg p-4">
          <ReactMarkdown>
  {response}
</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;