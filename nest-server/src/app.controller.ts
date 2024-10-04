import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
  @Get('test')
  test(): string {
    console.log('测试非同源下是否已经发出请求到服务器')
    return 'test'
  }
}
