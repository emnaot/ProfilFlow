import React, { useState } from "react";
import { render } from "react-dom";
import TextareaAutosize from "react-textarea-autosize";

const EncodeBase64 = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileBase64String, setFileBase64String] = useState("");

  const onFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const encodeFileBase64 = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        var Base64 = reader.result;
        setFileBase64String(Base64);
      };
      reader.onerror = (error) => {
        console.error("error: ", error);
      };
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "green",
          height: "60px",
          width: "100%",
          color: "#FFF",
          fontSize: "30px",
        }}
      >
        Files/Image Base64 Encoding
      </div>
      <br />
      <input type="file" id="input" onChange={onFileChange} />
      <button onClick={() => encodeFileBase64(selectedFile)}>
        Encode File
      </button>
      <TextareaAutosize
        maxRows={20}
        value={fileBase64String}
        style={{ width: "100%", fontSize: "16px", padding: "10px" }}
      />
    </div>
  );
};

render(<EncodeBase64 />, document.querySelector("#root"));
