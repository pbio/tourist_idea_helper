import Head from "next/head";
import { useState } from "react";
import React from "react";
import styles from "./index.module.css";

export default function Home() {
  const [coordinateInput, setCoordinateInput] = useState(); // <{coords:{latitude: number, longitude: number}}>
  const [professionInput, setProfessionInput] = useState("");
  const [feelingInput, setFeelingInput] = useState("");
  const [result, setResult] = useState();
  const [ GPSError, setGPSError ] = useState();

  async function onSubmit(event) {
    
    const coordinateStr = `${coordinateInput.coords.latitude}, ${coordinateInput.coords.longitude}`;
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coordinate: coordinateStr, feeling:feelingInput, profession: professionInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch(error) {
      alert(error.message);
    }
  }


  const getGPS = async () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(setCoordinateInput, setGPSError);
      } else {
        setGPSError(true);
      }
  }
  React.useEffect(()=>{
      getGPS();
  }, [])
  if (GPSError) return <p>please enable your GPS on your device</p>
  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/earth.png" className={styles.icon} />
        <h3>Help!! I am at </h3>
        <h4>{ `Lat : ${coordinateInput?.coords.latitude}, Long : ${coordinateInput?.coords.longitude}` }</h4>
        <form onSubmit={onSubmit}>
          <h3>I am a</h3>
          <input
            type="text"
            name="profession"
            placeholder="student, plumber"
            value={professionInput}
            onChange={(e) => setProfessionInput(e.target.value)}
          />
          <h3>and I am a feeling </h3>
          <input
            type="text"
            name="feeling"
            placeholder="hungry, curious"
            value={feelingInput}
            onChange={(e) => setFeelingInput(e.target.value)}
          />
          <h3> What is there to do here? </h3>
          <input type="submit" value="Generate places!" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
