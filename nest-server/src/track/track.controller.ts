/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { TrackService } from './track.service'

@Controller()
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get('/track')
  getTrack(@Query('data') data: any): boolean {
    return this.trackService.saveReports(data)
  }

  @Post('/track')
  postTrack(@Body('data') data: any): boolean {
    return this.trackService.saveReports(data)
  }
}
