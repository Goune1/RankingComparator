"use client"

import { useState, FormEvent, useEffect } from 'react'
import axios from 'axios'
import Nav from '@/components/nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Définir les types pour les données de club et d'achievements
interface Club {
  id: string;
  name: string;
  logoImage: string;
}

interface ClubAchievement {
  number: string;
  name: string;
}

export default function CompareClubs() {
  const [club1, setClub1] = useState<Club | null>(null);
  const [club1Achievements, setClub1Achievements] = useState<ClubAchievement[]>([]);
  const [club1Query, setClub1Query] = useState<string>(''); 
  const [club1DataLoaded, setClub1DataLoaded] = useState<boolean>(false);
  const [club1SearchDone, setClub1SearchDone] = useState<boolean>(false);

  const [club2, setClub2] = useState<Club | null>(null);
  const [club2Achievements, setClub2Achievements] = useState<ClubAchievement[]>([]);
  const [club2Query, setClub2Query] = useState<string>(''); 
  const [club2DataLoaded, setClub2DataLoaded] = useState<boolean>(false);
  const [club2SearchDone, setClub2SearchDone] = useState<boolean>(false);

  const [bestClub, setBestClub] = useState<string | null>(null);

  // Fonction pour récupérer les données d'un club
  const fetchClubData = async (query: string, setClub: React.Dispatch<React.SetStateAction<Club | null>>, setClubAchievements: React.Dispatch<React.SetStateAction<ClubAchievement[]>>, setClubSearchDone: React.Dispatch<React.SetStateAction<boolean>>, setClubDataLoaded: React.Dispatch<React.SetStateAction<boolean>>) => {
    setClubDataLoaded(false);
    setClubSearchDone(false);

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
      const response = await axios.request<{ clubs: Club[] }>(optionsSearch);
      const club = response.data.clubs[0];
      setClub(club);
      setClubSearchDone(true);

      const optionsAchievements = {
        method: 'GET',
        url: 'https://transfermarket.p.rapidapi.com/clubs/get-profile',
        params: { id: club.id, domain: 'com' },
        headers: {
          'x-rapidapi-key': '9d8caf93efmsh73fc3fcb1ffda12p10b0e8jsn8a2efeb59685',
          'x-rapidapi-host': 'transfermarket.p.rapidapi.com'
        }
      };

      const achievementsResponse = await axios.request<any>(optionsAchievements); // Utiliser `any` pour éviter les erreurs de typage
      const successes = achievementsResponse.data.successes || []; // Vérifier si successes existe

      // Adapter le traitement des réalisations
      const formattedAchievements: ClubAchievement[] = successes.map((success: any) => ({
        number: success.number || '0',
        name: success.name || 'Nom non disponible'
      }));

      setClubAchievements(formattedAchievements);
      setClubDataLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour gérer la soumission du formulaire pour les clubs
  const handleClubSubmit = (e: FormEvent<HTMLFormElement>, query: string, setClub: React.Dispatch<React.SetStateAction<Club | null>>, setClubAchievements: React.Dispatch<React.SetStateAction<ClubAchievement[]>>, setClubSearchDone: React.Dispatch<React.SetStateAction<boolean>>, setClubDataLoaded: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.preventDefault();
    fetchClubData(query, setClub, setClubAchievements, setClubSearchDone, setClubDataLoaded);
  };

  // Fonction pour formater les réalisations de clubs en texte brut
  const formatClubAchievements = (achievements: ClubAchievement[]): string => {
    return achievements.map(({ number, name }) => `${name} - ${number}x`).join(' | ');
  };

  // Fonction pour valider les meilleurs clubs
  const handleValidate = async () => {
    if (club1 && club2 && club1DataLoaded && club2DataLoaded) {
      try {
        const response = await axios.post('/api/compare-clubs', {
          club1: {
            name: club1.name,
            achievements: formatClubAchievements(club1Achievements)
          },
          club2: {
            name: club2.name,
            achievements: formatClubAchievements(club2Achievements)
          }
        });
        setBestClub(response.data.ClubName);
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Utiliser useEffect pour déclencher handleValidate lorsque les deux clubs sont prêts
  useEffect(() => {
    if (club1 && club2 && club1DataLoaded && club2DataLoaded) {
      handleValidate();
    }
  }, [club1, club2, club1DataLoaded, club2DataLoaded]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav/>

      <div className="pt-24">
        <h1 className="text-center text-4xl lg:text-6xl tracking-tight font-bold p-4">Comparez le palmarès des clubs</h1>
        
        <div className='pt-8 pb-36'>
          <div className='flex flex-col md:flex-row items-center justify-center gap-x-16 lg:gap-x-36'>
            <form onSubmit={(e) => handleClubSubmit(e, club1Query, setClub1, setClub1Achievements, setClub1SearchDone, setClub1DataLoaded)} className="mb-4 flex gap-4">
              <Input className='border-black' type='text' value={club1Query} onChange={(e) => setClub1Query(e.target.value)} placeholder="Nom du premier club" />
              <Button type='submit'>Rechercher</Button>
            </form>
            <form onSubmit={(e) => handleClubSubmit(e, club2Query, setClub2, setClub2Achievements, setClub2SearchDone, setClub2DataLoaded)} className="mb-4 flex gap-4">
              <Input className='border-black' type='text' value={club2Query} onChange={(e) => setClub2Query(e.target.value)} placeholder="Nom du deuxième club" />
              <Button type='submit'>Rechercher</Button>
            </form>
          </div>
          {bestClub && (
            <h1 className='text-center text-xl lg:text-2xl font-semibold tracking-tight px-8'>Le club avec le meilleur palmarès est : {bestClub}</h1>
          )}
          <div className='flex flex-col md:flex-row items-stretch justify-center gap-8 p-4'>
            {club1SearchDone && club1DataLoaded && (
              <Card className='bg-gray-300 w-[350px] lg:w-[500px] min-h-[400px] flex flex-col'>
                <CardHeader>
                  <CardTitle>{club1?.name}</CardTitle>
                  <CardDescription className='flex flex-col gap-2'>
                    <img src={club1?.logoImage} alt={club1?.name} className='w-24 h-30' />
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul>
                    {club1Achievements.map((achievement, index) => (
                      <li key={index}>{achievement.name} - {achievement.number}x</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {club2SearchDone && club2DataLoaded && (
              <Card className='bg-gray-300 w-[350px] lg:w-[500px] min-h-[400px] flex flex-col'>
                <CardHeader>
                  <CardTitle>{club2?.name}</CardTitle>
                  <CardDescription className='flex flex-col gap-2'>
                    <img src={club2?.logoImage} alt={club2?.name} className='w-24 h-30' />
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul>
                    {club2Achievements.map((achievement, index) => (
                      <li key={index}>{achievement.name} - {achievement.number}x</li>
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
