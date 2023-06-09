import React, { useState, useRef } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";

type IProps = {
  data: string[];
}

const Home: NextPage<IProps> = ({ data }) => {
  const [description, setDescription] = useState<string>(
    data[0]
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const suggestButtonRef = useRef<HTMLButtonElement>(null);
  const [wallpaper, setWallpaper] = useState<string | null>(null);

  /**
   * Generate Wallpaper
   *
   *
   */
  const generateWallpaper = async () => {
    buttonRef.current!.disabled = true;
    setWallpaper(null);
    try {
      buttonRef.current!.innerText = "Generating wallpaper...";
      const response = await axios.post("/api/generate", {
        description,
      });
      setWallpaper(response.data.data[0].url);
    } catch (err) {
      console.log(err);
      setWallpaper(null);
    } finally {
      buttonRef.current!.innerText = "Generate wallpaper";
      buttonRef.current!.disabled = false;
    }
  };

  const suggestWallpaper = async () => {
    buttonRef.current!.disabled = true;
    suggestButtonRef.current!.disabled = true;
    setWallpaper(null);

    // Get random word from data
    const index = Math.floor(Math.random() * data.length);
    const word = data[index];
    data.slice(index, 1);

    setDescription(word);

    try {
      suggestButtonRef.current!.innerText = "Suggesting wallpaper...";
      const response = await axios.post("/api/generate", {
        description: word,
      });
      setWallpaper(response.data.data[0].url);
    } catch (err) {
      console.log(err);
      setWallpaper(null);
    } finally {
      suggestButtonRef.current!.innerText = "Suggest wallpaper";
      buttonRef.current!.disabled = false;
      suggestButtonRef.current!.disabled = false;
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>WallAI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center md:px-20 text-center my-16">
        <h1 className="text-7xl font-bold font-sans text-[#0055d9]">WallAI</h1>
        <p className="mt-8 text-2xl md:w-2/5 text-[#081477] font-bold">
          Create unique and stunning wallpapers using API
        </p>

        <div className="mt-12 flex max-w-xl flex-col flex-wrap sm:w-full border border-gray-300 p-6 rounded-md shadow-sm">
          <div className="flex mt-4">
            <p className="flex items-center justify-center rounded-[99px] w-[30px] h-[30px] bg-[#ef386a] text-white">
              <span className="text-sm">1</span>
            </p>
            <p className="mt-1 ml-2">
              Please write description of your wallpaper
            </p>
          </div>
          <div className="w-full text-left ml-[38px]">
            <textarea
              className="w-5/6 h-[200px] mt-2 text-sm rounded-md border border-gray-300 shadow-sm p-2 focus:ring-black"
              placeholder="1000 characters max"
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mt-6 flex space-x-4 justify-center w-full">
            <button
              className="w-full py-2 md:text-sm bg-[#081477] rounded-md text-white"
              onClick={suggestWallpaper}
              ref={suggestButtonRef}
            >
              Suggest wallpaper
            </button>
            <button
              className="w-full py-2 md:text-sm bg-[#081477] rounded-md text-white"
              onClick={generateWallpaper}
              ref={buttonRef}
            >
              Generate wallpaper
            </button>
          </div>
        </div>
        {wallpaper && (
          <div className="mt-12">
            <h2 className="mb-12 font-bold">Here is your wallpaper ↓</h2>
            <a href={wallpaper!} title="wallpaper" download={true}>
              <Image
                src={wallpaper!}
                width={512}
                height={512}
                alt="wallpaper"
                className="rounded-lg"
              />
            </a>
          </div>
        )}
      </main>
      <div className="flex flex-col mt-10 justify-center">
        <p className="block mt-10 mb-10 text-center text-secondary text-xs uppercase font-bold">
          Made by{" "}
          <a href="https://rapidapi.com/?utm_source=github.com/RapidAPI&utm_medium=DevRel&utm_campaign=DevRel" className="underline">
            Rapid
          </a>{" "}
          DevRel Team • Powered by <a href="https://openai.com/" className="underline">OpenAI</a> and <a href="https://rapidapi.com/hub?utm_source=RapidAPI.com/examples&utm_medium=DevRel&utm_campaign=DevRel" className="underline">Rapid</a>
        </p>
      </div>
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
  const res = await axios.post("http://localhost:3000/api/list");
  const { data } = res;

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data,
    },
  };
}
