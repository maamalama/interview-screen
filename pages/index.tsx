import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { Component } from "../src/types";
import useIsMountedRef from '../utils/useIsMountedRef';
import Create from '../components/create';

const Card: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div
      style={{
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {children}
    </div>
  );
};

const Text: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Card>
      <h1>Text</h1>
      <p>{text}</p>
    </Card>
  );
};

const Image: React.FC<{ src: string }> = ({ src }) => {
  return (
    <Card>
      <h1>Image</h1>
      <img
        src={src}
        alt="Image"
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          objectPosition: "center center",
        }}
      />
    </Card>
  );
};

const Home: NextPage = () => {
  const isMountedRef = useIsMountedRef();
  const [data, setData] = useState<Component[] | null>(null);
  const [showed, setShowed] = useState<boolean>(true);


  useEffect(() => {
    fetch("/api/component")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
      setInterval(() => {
        if(showed) {
            setShowed(!showed);
            return;
        }
        }, 5000)
  }, [isMountedRef, showed]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "12px",
        width: "400px",
        fontFamily: "Roboto, sans-serif",
        margin: "0 auto",
      }}
    >
      <Create/>
      {showed && <img key={'meme'} src={'/img/helpkitty.jpg'} />}
      {data.map((component) => {
        if (component.type === "text") {
          return <Text key={component.id} text={component.text} />;
        }
        if (component.type === "image") {
          return <Image key={component.id} src={component.src} />;
        }

        return null;
      })}
    </div>
  );
};

export default Home;
