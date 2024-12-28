/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Post, Body, Headers, Res } from '@nestjs/common'
import { Response } from 'express'
import { WantChatService } from './wantchat.service'

@Controller('want-chat')
export class WantChatController {
  constructor(private readonly wantChatService: WantChatService) {}

  @Post('stream')
  async streamChat(
    @Body() body: { message: string },
    @Headers('Authorization') auth: string,
    @Res() response: Response,
  ) {
    console.log('Received request to /want-chat/stream')
    try {
      const apiKey = auth?.replace('Bearer ', '')

      // 修改响应头设置
      response.setHeader('Content-Type', 'text/event-stream')
      response.setHeader('Cache-Control', 'no-cache')
      response.setHeader('Connection', 'keep-alive')
      response.setHeader('X-Accel-Buffering', 'no') // 禁用 Nginx 缓冲
      response.flushHeaders() // 立即发送响应头

      await this.wantChatService.handleStreamResponse(
        body.message,
        apiKey,
        response,
      )
    } catch (error) {
      console.error('Stream chat error:', error)
      response.write(JSON.stringify({ error: error.message }))
      response.end()
    }
  }
}
