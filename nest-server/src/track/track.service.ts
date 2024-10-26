/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'

@Injectable()
export class TrackService {
  saveReports(msg: any): boolean {
    // console.log(msg);
    // TODO: save to database
    return true
  }
}
