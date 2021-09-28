import ProjectDetails from "./ProjectDetails";
import { useState } from "react";

export default function Project({
  i,
  name,
  group,
  tech,
  details,
  github,
  deployed,
  images,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [imagesLength, setImagesLength] = useState(false);
  const [gitLength, setGitLength] = useState(false);

  const getGit = () => {
    try {
      if (github.length < 2) {
        setGitLength(true);
      } else {
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getImages = () => {
    try {
      if (images.length < 2) {
        setImagesLength(true);
      } else {
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = () => {
    setShowDetails(!showDetails);
    getGit();
    getImages();
  };

  return (
    <div className="project-container" key={i}>
      <h3 className="less-flush">
        <a href={deployed} target="_blank">
          {name}
        </a>
        {group && <span className="group"> (Team Project)</span>}
      </h3>
      {name === "Chatterbox" && <p className="repo-login flush">See repo for login information</p>}
      <h4 className="italic flush">{tech}</h4>
      <div>
        {showDetails && (
          <ProjectDetails
            i={i}
            name={name}
            details={details}
            github={github}
            images={images}
            imagesLength={imagesLength}
            gitLength={gitLength}
          />
        )}
        <div className="details" onClick={handleClick}>
          {showDetails ? <a>Hide Details</a> : <a>Show Project Details</a>}
        </div>
      </div>
    </div>
  );
}
