import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [content, setContent] = useState("");
  const [spellCheckData, setSpellCheckData] = useState([]);
  const [spellErr, setSpellErr] = useState(true);

  /**
   *
   *
   * Fetch Spell Errors and Suggestions
   */
  const fetchSpellErrSugg = async () => {
    try {
      const res = await axios.post(`/api/check`, {
        content,
      });
      const { data } = res;

      if (data.spellingErrorCount === 0) {
        setSpellErr(false);
      }
      {
        const { elements } = data;
        setSpellCheckData(elements[0].errors);
        setSpellErr(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center relative min-h-screen">
      <h2 className="font-raleway font-bold text-6xl text-primary pt-20 pb-6 md:text-3xl">
        Spell <span className="text-active">Checker</span> App
      </h2>
      <h3 className="text-danger text-2xl font-raleway font-bold uppercase tracking-wide mb-12 md:text-base md:px-4 md:text-center">
        Quickly See All Your Spelling Errors
      </h3>
      <div className="flex justify-between w-5/6 h-96 mt-8 md:flex-col md:items-center md:justify-start">
        <textarea
          type="text"
          className="border border-primary outline-none w-2/5 px-4 py-2 rounded-sm font-raleway md:w-full"
          placeholder="Write/paste any content..."
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center">
          <button
            className="h-1/6 outline-none border border-active font-bold font-raleway mx-12 px-12 rounded-sm bg-active text-primary transition duration-300 hover:bg-bc hover:text-black hover:border-primary md:h-16 md:my-12"
            onClick={fetchSpellErrSugg}
          >
            Check
          </button>
        </div>
        {spellErr ? (
          <div className="h-96 w-2/5 overflow-scroll md:w-full">
            <table className="bg-white w-full text-primary border-danger border md:text-sm md:mx-2">
              <thead className="font-raleway uppercase tracking-wide">
                <tr>
                  <th className="border-danger border text-left px-4 py-4">
                    Word
                  </th>
                  <th className="border-danger border text-left px-4 py-4">
                    Suggestions
                  </th>
                </tr>
              </thead>
              <tbody>
                {spellCheckData.map((obj) => {
                  return (
                    <tr key={spellCheckData.indexOf(obj)}>
                      <td className="border-danger border px-4 py-4">
                        {obj.word}
                      </td>
                      <td className="border-danger border px-4 py-4">
                        {`${obj.suggestions[0]}, ${obj.suggestions[1]}, ${obj.suggestions[2]}, ${obj.suggestions[3]}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <h2 className="font-raleway font-bold text-3xl text-secondary pt-20 pb-6 md:text-3xl">
            No Spelling Error.{" "}
          </h2>
        )}
      </div>
      <div className="absolute bottom-0 flex justify-center items-end h-52 md:h-44">
        <p className="text-primary pb-12 md:w-60 md:text-center">
          Made by RapidAPI DevRel Team –{" "}
          <a href="https://github.com/RapidAPI/DevRel-Examples-External">
            See Examples Like this
          </a>
        </p>
      </div>
    </div>
  );
}
