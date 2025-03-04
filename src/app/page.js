"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Загрузка...");

  useEffect(() => {
    fetch("http://localhost:5000/") // Запрос к FastAPI
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((error) => setMessage("Ошибка соединения с сервером"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Приложение с FastAPI + Next.js + Electron</h1>
      <p>Ответ от FastAPI: {message}</p>
    </div>
  );
}
