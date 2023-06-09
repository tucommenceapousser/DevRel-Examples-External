import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [content, setContent] = useState(null);
  const [paraphrased, setParaphrased] = useState("");

  /**
   *
   *
   * Fetch the paraphrased content
   */
  const fetchParaPhrasedText = async () => {
    try {
      setParaphrased(`Generating paraphrased article...`);
      const res = await axios.get(`/api/paraphrase`, {
        params: { content },
      });
      const { data } = res;
      setParaphrased(data.rewrite);
    } catch (err) {
      setParaphrased(`Couldn't generate paraphrased content.`);
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center relative min-h-screen">
      <h2 className="font-raleway font-bold text-6xl text-primary pt-20 pb-6 md:text-3xl">
        <span className="text-secondary">Paraphrase</span> App
      </h2>
      <h3 className="text-danger text-2xl font-raleway font-bold uppercase tracking-wide mb-12 md:text-base md:px-4 md:text-center">
        Paraphrase any piece of content easily
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
            className="h-1/6 outline-none border border-secondary font-bold font-raleway mx-12 px-12 rounded-sm bg-secondary text-primary transition duration-300 hover:bg-bc hover:text-black md:h-16 md:my-12"
            onClick={fetchParaPhrasedText}
          >
            Paraphrase
          </button>
        </div>
        <textarea
          type="text"
          className="border border-primary outline-none w-2/5  px-4 py-2 rounded-sm font-raleway md:w-full"
          placeholder="Paraphrased content"
          value={paraphrased}
        />
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
