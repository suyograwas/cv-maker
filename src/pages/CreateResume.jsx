import React from "react";
import { templatesData } from "../utils/helpers";
import { Routes, Route } from "react-router-dom";

const CreateResume = () => {
  return (
    <div className="w-full flex flex-col items-center justify-start py-4">
      <Routes>
        {templatesData.map((template) => (
          <Route
            key={template?.id}
            path={`/${template.name}`}
            Component={template.component}
          />
        ))}
      </Routes>
    </div>
  );
};

export default CreateResume;
