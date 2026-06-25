import { useState, useEffect } from "react";

export default function Tech({ head, techProps, body }) {
  const [techList, setTechList] = useState("");

  useEffect(() => {
    try {
      const sortedTech = techProps.sort();
      sortedTech.splice(
        sortedTech.length - 1,
        1,
        `and ${sortedTech[sortedTech.length - 1]}`
      );
      setTechList(sortedTech.join(", "));
    } catch (err) {
      console.log(err);
    }
  }, [techProps]);

  console.log(techList);

  return (
    <div className="web-tech">
      <h3 className="less-flush web-edge">{head}</h3>
      {techProps ? (
        <p className="flush">{techList}</p>
      ) : (
        <p className="flush">{body}</p>
      )}
    </div>
  );
}
