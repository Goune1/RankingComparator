import { NextResponse } from 'next/server';
import OpenAI from 'openai'

export async function POST(request: Request): Promise<NextResponse> {
    const result = await request.json()

    const player1 = result.player1.name
    const player1palmares = result.player1.achievements

    const player2 = result.player2.name
    const player2palmares = result.player2.achievements

    const openai = new OpenAI({ apiKey: process.env.OPENAI_SECRET });

    const prompt = `Voici le palmarès de ${player1} : ${player1palmares}, maintenant voici le 2eme palmares, celui de ${player2} : ${player2palmares}`

    const tools_functions = [
        {
          'type': 'function',
          'function': {
            'name': 'CompareAchievements',
            'description': 'tu va comparer les palmares de 2 joueurs de foot',
            'parameters': {
              'type': 'object',
              'properties': {
                "PlayerName": {
                  'type': 'string',
                  'description': 'tu va me dire le nom du joueur qui a le meilleur palmares, tout simplement'
                },
                "Reason": {
                  'type': 'string',
                  'descriptions': 'Tu va me donner les raisons de pourquoi le joueur qui a le meilleur palmares a le meilleur palmares'
                }
              }
            }
          }
        }
    ]

    const completion = await openai.chat.completions.create({
        messages: [{"role": 'user', 'content': prompt}],
        //@ts-ignore
        tools: tools_functions,
        tool_choice: 'auto',
        model: 'gpt-4o-mini',
        max_tokens: 256,
    })

    //@ts-ignore
    const note = JSON.parse(completion.choices[0].message.tool_calls[0].function.arguments);

    return NextResponse.json(note)
}
