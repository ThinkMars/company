/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { TrackService } from './track.service'

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getTrack(@Query('data') data: any): boolean {
    return this.trackService.saveReports(data)
  }

  @Post()
  postTrack(@Body('data') data: any): boolean {
    return this.trackService.saveReports(data)
  }
}
