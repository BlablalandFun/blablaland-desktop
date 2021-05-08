import React, { useState } from 'react';
import logo from './icon.png';
// import thunderbolt from './skate.png';

const API_URL = "http://localhost:12500/auth";

function App() {

  const [error, setError] = useState(null);

  const onSubmitForm = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    // @ts-ignore
    const { username: { value: username }, password: { value: password } } = evt.target;

    const req = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username, password,
      }),
      method: 'POST',
    });

    const response = await req.json();
    if (req.status === 200) {
      if (response.token) {
        if (/electron/i.test(navigator.userAgent)) {
          // c'est une application electron
        } else {
          window.location.replace("https://blablaland.fun/");
        }
        // window.loadUrl()
      }
      // console.log('connecté !')
    } else {
      setError(response.error);
      // console.log('il y a un problème')
    }
  };

  return (
    <div className="bg-gray-900 flex flex-col h-screen w-screen">
      <img src={logo} className="self-center my-8" alt="logo" height="196" width="196" />

      <h1 className="mx-auto mb-10 flex flex-col text-center">
        <span className="text-white text-md mb-1">Connectez-vous avec votre compte </span>

        <span className="bg-clip-text text-transparent text-2xl font-bold bg-gradient-to-br from-blue-500 to-indigo-500 text-center uppercase">Blablaland.fun</span>
      </h1>

      <main className="h-full self-center">

        <div className="p-1 rounded-lg bg-gradient-to-br from-blue-500 to-green-500">


          <form onSubmit={onSubmitForm} className="flex flex-col px-8 py-6 gap-y-4 bg-gray-900 rounded-lg">
            {
              error && (
                <div className="bg-red-200 text-center font-medium text-red-900 px-2 py-2 rounded flex flex-col">
                  <span>
                    {error}
                  </span>
                </div>
              )
            }
            <div className="flex flex-col">
              <label className="text-white text-base">Identifiant</label>
              <input name="username" type="text" className="mt-2 rounded-lg bg-gray-100 px-2 py-1" />
            </div>
            <div className="flex flex-col">
              <label className="text-white text-base">Mot de passe</label>
              <input name="password" type="password" className="mt-2 rounded-lg bg-gray-100 px-2 py-1" />
            </div>

            <button type="submit" className="mt-3 p-[2px] rounded-full bg-gradient-to-br from-yellow-400 hover:from-yellow-500 to-pink-400 hover:to-pink-500">
              <div className="px-3 py-2 uppercase font-bold text-sm rounded-full text-white bg-gray-900">
                Confirmer
              </div>
            </button>
          </form>


        </div>
      </main>

      <footer className="text-gray-300 text-center w-full py-8 flex flex-col gap-y-2 text-xs">
        <span>
          Blablaland.fun est un projet indépendant non lucratif
        </span>
        <span>
          Nous ne sommes en aucun cas affilié ou approuvé par NIVEAU99 ou SUPER BLABLALAND
        </span>
      </footer>
    </div>
  );
}

export default App;
