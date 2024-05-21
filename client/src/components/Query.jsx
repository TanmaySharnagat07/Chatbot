import React, { useState } from "react";
import { Client } from "@gradio/client";

const sanitizeString = (inputString) => {
  let sanitizedString = inputString
  .replace(/'/g, '"')
  .replace(/(\w+)=/g, '"$1":')
  .replace(/"\s*(.*?)\s*"/g, '"$1"') 
  .replace(/"([^\\"]*)"/g, '$1') 
  .replace(/\\{4}/g, '\\\\'); 


sanitizedString = sanitizedString.replace(/Document\((.*?)\)/g, '{$1}');
sanitizedString = sanitizedString.replace(/}\)/g, '}}');
  console.log(sanitizedString);
  return sanitizedString;
};

// Convert the sanitized string to a JSON object
const convertStringToObject = (inputString) => {
  try {
    const sanitizedString = sanitizeString(inputString);
    const jsonObject = JSON.parse(sanitizedString);
    console.log(JSON.stringify(jsonObject));
    return jsonObject;
  } catch (error) {
    console.error("Error parsing string to object:", error);
    return null;
  }
};
export const Query = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [time, setTime] = useState(null);
  const [dataObject, setDataObject] = useState(null);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };
  

  const predict = async () => {
    try {
      const client = await Client.connect("TusharsinghBaghel/MECL_RAG");
      const predictionResult = await client.predict("/predict", {
        query: query,
      });
      
      setResult(predictionResult);
      setTime(new Date(predictionResult.time));
      const parsedDataObject = convertStringToObject(predictionResult.data[0]);
      setDataObject(parsedDataObject);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  return (
    <div className="h-[100vh] w-full text-black bg-white">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter a query"
      />
      <button onClick={predict} className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Predict
      </button>

      {/* Display input and output */}
      {query && (
        <div>
          <h2>Input:</h2>
          <p>{query}</p>
        </div>
      )}
      {result && (
        <div>
          <h2>Output:</h2>
          <div>
            <p>Endpoint: {result.endpoint}</p>
            <p>Type: {result.type}</p>
            <p>Time: {time ? time.toString() : ""}</p>
            {dataObject && (
              <div>
                <h3>Data Object:</h3>
                <p>Input: {dataObject.input}</p>
                <h4>Context:</h4>
                <ul>
                  {dataObject.context.map((item, index) => (
                    <li key={index}>
                      <p>Page Content: {item.page_content}</p>
                      <p>Metadata: {JSON.stringify(item.metadata, null, 2)}</p>
                    </li>
                  ))}
                </ul>
                <p>Answer: {dataObject.answer}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
