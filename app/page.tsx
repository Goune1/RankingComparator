import Nav from '@/components/nav'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SquareArrowOutUpRight } from 'lucide-react';
import Footer from '@/components/footer'

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Nav/>
            <div className='pt-24'>
                <div>
                    <h1 className='text-center text-4xl lg:text-6xl font-bold tracking-tight px-4'>Le moyen le plus simple pour <br /> comparer des palmarès</h1>
                    <p className='text-center pt-2 px-8'>Grâce à RankingComparator vous pourrez facilement comparer le palmarès de deux clubs ou deux joueurs différents. <br /> Il vous sera indiqué lequel de vos propositions à le meilleur palmarès</p>
                    <div className='flex items-center justify-center pt-4'>
                        <Button asChild>
                            <Link href="/clubs">Commencer <SquareArrowOutUpRight className='ml-2'/></Link>
                        </Button>
                    </div>
                    <div className='flex items-center justify-center pt-16 pb-36'>
                        <img src="hero.png" alt="" className='w-[75%] border-4 border-black'/>
                    </div>
                </div>

                <Footer></Footer>
            </div>
        </div>
    )
}