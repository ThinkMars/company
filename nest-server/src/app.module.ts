import { WantChatModule } from './want-chat/wantchat.module'
import { TrackModule } from './track/track.module'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [WantChatModule, TrackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
