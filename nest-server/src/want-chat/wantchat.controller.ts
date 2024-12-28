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

      // 设置响应头
      response.setHeader('Content-Type', 'application/json')
      response.setHeader('Transfer-Encoding', 'chunked')

      // 调用service处理流式响应
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
