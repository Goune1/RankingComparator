"use client"

import { useState, FormEvent, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Définir les types pour les données de joueur et d'achievements
interface Player {
  id: string;
  playerName: string;
  club: string;
  playerImage: string;
}

interface Achievement {
  title: string;
  value: string;
}

export default function Home() {
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player1Achievements, setPlayer1Achievements] = useState<Achievement[]>([]);
  const [player1Query, setPlayer1Query] = useState<string>(''); 
  const [player1DataLoaded, setPlayer1DataLoaded] = useState<boolean>(false);
  const [player1SearchDone, setPlayer1SearchDone] = useState<boolean>(false);

  const [player2, setPlayer2] = useState<Player | null>(null);
  const [player2Achievements, setPlayer2Achievements] = useState<Achievement[]>([]);
  const [player2Query, setPlayer2Query] = useState<string>(''); 
  const [player2DataLoaded, setPlayer2DataLoaded] = useState<boolean>(false);
  const [player2SearchDone, setPlayer2SearchDone] = useState<boolean>(false);

  const [bestPlayer, setBestPlayer] = useState<string | null>(null);

  const fetchPlayerData = async (query: string, setPlayer: React.Dispatch<React.SetStateAction<Player | null>>, setPlayerAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>, setPlayerSearchDone: React.Dispatch<React.SetStateAction<boolean>>, setPlayerDataLoaded: React.Dispatch<React.SetStateAction<boolean>>) => {
    setPlayerDataLoaded(false);
    setPlayerSearchDone(false);

    const optionsSearch = {
      method: 'GET',
      url: 'https://transfermarket.p.rapidapi.com/search',
      params: { query, domain: 'com' },
      headers: {
        'x-rapidapi-key': '9d8caf93efmsh73fc3fcb1ffda12p10b0e8jsn8a2efeb59685',
        'x-rapidapi-host': 'transfermarket.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request<{ players: Player[] }>(optionsSearch);
      const player = response.data.players[0];
      setPlayer(player);
      setPlayerSearchDone(true);

      const optionsAchievements = {
        method: 'GET',
        url: 'https://transfermarket.p.rapidapi.com/players/get-achievements',
        params: { id: player.id, domain: 'com' },
        headers: {
          'x-rapidapi-key': '9d8caf93efmsh73fc3fcb1ffda12p10b0e8jsn8a2efeb59685',
          'x-rapidapi-host': 'transfermarket.p.rapidapi.com'
        }
      };

      const achievementsResponse = await axios.request<{ playerAchievements: Achievement[] }>(optionsAchievements);
      setPlayerAchievements(achievementsResponse.data.playerAchievements);
      setPlayerDataLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>, query: string, setPlayer: React.Dispatch<React.SetStateAction<Player | null>>, setPlayerAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>, setPlayerSearchDone: React.Dispatch<React.SetStateAction<boolean>>, setPlayerDataLoaded: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.preventDefault();
    fetchPlayerData(query, setPlayer, setPlayerAchievements, setPlayerSearchDone, setPlayerDataLoaded);
  }

  // Fonction pour formater les réalisations en texte brut
  const formatAchievements = (achievements: Achievement[]): string => {
    return achievements.map(({ title, value }) => `${title} - ${value}`).join('\n');
  };

  const handleValidate = async () => {
    if (player1 && player2) {
      try {
        const response = await axios.post('/api/compare', {
          player1: {
            name: player1.playerName,
            achievements: formatAchievements(player1Achievements)
          },
          player2: {
            name: player2.playerName,
            achievements: formatAchievements(player2Achievements)
          }
        });
        console.log(response.data);
        setBestPlayer(response.data.PlayerName);
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Utiliser useEffect pour déclencher handleValidate lorsque les deux joueurs sont prêts
  useEffect(() => {
    if (player1 && player2 && player1DataLoaded && player2DataLoaded) {
      handleValidate();
    }
  }, [player1, player2, player1DataLoaded, player2DataLoaded]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pt-36">
        <h1 className="text-center text-4xl lg:text-6xl tracking-tight font-bold p-4">Comparez le palmarès</h1>
        {bestPlayer && (
          <h1 className='text-center text-xl lg:text-2xl font-semibold tracking-tight px-8'>Le joueur avec le meilleur palmarès est : {bestPlayer}</h1>
        )}
        <div className='pt-12 pb-36'>
          <div className='flex flex-col md:flex-row items-center justify-center gap-x-16 lg:gap-x-36'>
            <form onSubmit={(e) => handleSubmit(e, player1Query, setPlayer1, setPlayer1Achievements, setPlayer1SearchDone, setPlayer1DataLoaded)} className="mb-4 flex gap-4">
              <Input className='border-black' type='text' value={player1Query} onChange={(e) => setPlayer1Query(e.target.value)} placeholder="Nom du premier joueur" />
              <Button type='submit'>Rechercher</Button>
            </form>
            <form onSubmit={(e) => handleSubmit(e, player2Query, setPlayer2, setPlayer2Achievements, setPlayer2SearchDone, setPlayer2DataLoaded)} className="mb-4 flex gap-4">
              <Input className='border-black' type='text' value={player2Query} onChange={(e) => setPlayer2Query(e.target.value)} placeholder="Nom du deuxième joueur" />
              <Button type='submit'>Rechercher</Button>
            </form>
          </div>
          
          <div className='flex flex-col md:flex-row items-stretch justify-center gap-8 p-4'>
            {player1SearchDone && player1DataLoaded && (
              <Card className='bg-gray-300 w-[350px] lg:w-[500px] min-h-[400px] flex flex-col'>
                <CardHeader>
                  <CardTitle>{player1?.playerName}</CardTitle>
                  <CardDescription className='flex flex-col gap-2'>
                    {player1?.club} 
                    <img src={player1?.playerImage} alt={player1?.playerName} className='w-24 h-30' />
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul>
                    {player1Achievements.map((achievement, index) => (
                      <li key={index}>{achievement.title} - {achievement.value}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {player2SearchDone && player2DataLoaded && (
              <Card className='bg-gray-300 w-[350px] lg:w-[500px] min-h-[400px] flex flex-col'>
                <CardHeader>
                  <CardTitle>{player2?.playerName}</CardTitle>
                  <CardDescription className='flex flex-col gap-2'>
                    {player2?.club} 
                    <img src={player2?.playerImage} alt={player2?.playerName} className='w-24 h-30' />
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul>
                    {player2Achievements.map((achievement, index) => (
                      <li key={index}>{achievement.title} - {achievement.value}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
