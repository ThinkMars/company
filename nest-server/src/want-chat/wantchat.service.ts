/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import fetch from 'node-fetch'
import { Readable } from 'stream'

@Injectable()
export class WantChatService {
  async handleStreamResponse(
    message: string,
    apiKey: string,
    response: Response,
  ) {
    try {
      const aiResponse = await fetch(
        'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'glm-4-flash',
            messages: [{ role: 'user', content: message }],
            stream: true,
            max_tokens: 2048,
            stop: ['\n\n\n'],
          }),
        },
      )

      if (!aiResponse.ok) {
        throw new Error(`AI API error: ${aiResponse.statusText}`)
      }

      if (!aiResponse.body) {
        throw new Error('No response body available')
      }

      const stream = Readable.from(aiResponse.body)
      let buffer = ''

      stream.on('data', (chunk) => {
        buffer += chunk.toString()
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.includes('data:')) {
            const data = line.replace('data:', '').trim()
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content || ''
              if (content) {
                response.write(`data: ${JSON.stringify({ content })}\n\n`)
              }
            } catch (e) {
              console.warn('Failed to parse AI response:', e)
            }
          }
        }
      })

      stream.on('end', () => {
        response.write(`data: ${JSON.stringify({ content: '' })}\n\n`)
        response.end()
      })

      stream.on('error', (error) => {
        console.error('Stream error:', error)
        response.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
        response.end()
      })
    } catch (error) {
      console.error('AI stream error:', error)
      response.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
      response.end()
    }
  }
}
