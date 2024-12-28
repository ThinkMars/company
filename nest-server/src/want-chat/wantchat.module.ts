/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common'
import { WantChatController } from './wantchat.controller'
import { WantChatService } from './wantchat.service'

@Module({
  controllers: [WantChatController],
  providers: [WantChatService],
})
export class WantChatModule {}
