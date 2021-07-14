import React, { useState } from "react";
import logo from "./icon.png";
import "./index.css";
// import thunderbolt from './skate.png';

const AUTH_URL = "https://blablaland.fun/auth";
const API_URL = "https://api.blablaland.fun";

// const AUTH_URL = "http://blablaland.localhost/auth";
// const API_URL = "http://localhost:12500";

type BlablalandAuthAPI = {
  has2FA?: boolean;
  token?: string;
  error?: string;
};

function App() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [is2FaEnabled, set2FaEnabled] = useState(false);

  const onSubmitForm = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setLoading(true);
    setError(undefined);
    try {
      const formData = new FormData(evt.currentTarget);
      const req = await fetch(API_URL + "/auth", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
        method: "POST",
      });
      const response: BlablalandAuthAPI = await req.json();
      if (req.status === 200) {
        if (response.token) {
          window.localStorage.setItem("ACCESS_TOKEN", response.token);
          window.location.href = AUTH_URL + "?jwt=" + response.token;
        } else if (response.has2FA) {
          set2FaEnabled(response.has2FA!);
        }
      } else if (response.error) {
        setError(response.error);
      } else {
        setError("Une erreur inattendue est survenue.");
      }
      setLoading(false);
    } catch (err) {
      setError("Nos serveurs de connexion sont inactifs :(");
      setLoading(false);
    }
  };

  /** S'exécute au chargement de la page (une seule fois) */
  React.useEffect(() => {
    const localStorage = window.localStorage;
    if (localStorage) {
      const accessToken = localStorage.getItem("ACCESS_TOKEN");
      if (accessToken) {
        fetch(API_URL + "/check-auth", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessToken }),
          method: "POST",
        })
          .then((val) => val.json())
          .then((response) => {
            if (response.valid) {
              window.location.href = AUTH_URL + "?jwt=" + accessToken;
            } else {
              window.localStorage.removeItem("ACCESS_TOKEN");
            }
          });
      }
    }
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-900">
      <img
        src={logo}
        className="self-center mt-8 mb-12"
        alt="logo"
        height="196"
        width="196"
      />

      <main className="self-center h-full">
        <div className="p-1 rounded-lg bg-gradient-to-br from-blue-500 to-green-500">
          <form
            onSubmit={onSubmitForm}
            className="flex flex-col px-8 py-6 bg-gray-900 rounded-lg gap-y-4"
          >
            <h1 className="flex flex-col mx-auto text-center">
              <span className="mb-1 text-white text-md">
                Connectez-vous avec votre compte{" "}
              </span>

              <span className="text-2xl font-bold text-center text-transparent uppercase bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Blablaland.fun
              </span>
            </h1>
            {error && (
              <div className="flex flex-col px-2 py-2 text-sm font-medium text-center text-red-900 bg-red-200 rounded">
                <span>{error}</span>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row items-center gap-x-6">
                <label htmlFor="username" className="text-base text-white w-28">
                  Identifiant :
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="px-2 py-1 mt-2 bg-gray-100 rounded-lg"
                />
              </div>
              <div className="flex flex-row items-center gap-x-6">
                <label htmlFor="password" className="text-base text-white w-28">
                  Mot de passe :
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="px-2 py-1 mt-2 bg-gray-100 rounded-lg"
                />
              </div>
              {is2FaEnabled && (
                <div className="flex flex-row items-center gap-x-6">
                  <label
                    htmlFor="code2FA"
                    className="text-base text-white w-28"
                    title="Code indiqué sur votre application d'authentification à deux facteurs"
                  >
                    Code 2FA :
                  </label>
                  <input
                    id="code2FA"
                    name="code2FA"
                    type="text"
                    className="px-2 py-1 mt-2 bg-white rounded-lg"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="group mt-3 p-[2px] rounded-full bg-gradient-to-br from-yellow-400 hover:from-yellow-500 to-pink-400 hover:to-pink-500"
              disabled={isLoading}
            >
              <div className="relative inline-flex justify-center w-full px-3 py-2 text-sm font-bold text-white uppercase bg-gray-900 rounded-full group-hover:bg-gray-900 group-hover:bg-opacity-95">
                {!isLoading ? "Confirmer" : "Chargement en cours"}
                {isLoading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute w-5 h-5 ml-2 animate-pulse right-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          </form>
        </div>
      </main>

      <footer className="flex flex-col w-full py-8 text-xs text-center text-gray-300 gap-y-2">
        <span>Blablaland.fun est un projet indépendant non lucratif</span>
        <span>
          Nous ne sommes en aucun cas affilié ou approuvé par <b>NIVEAU99</b> ou{" "}
          <b>SUPER BLABLALAND</b>
        </span>
      </footer>
    </div>
  );
}

export default App;
