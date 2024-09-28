export enum TrackerEvents {
  /* SDK expose events */
  jsError = "jsError",
  unHandleRejection = "unHandleRejection",
  resourceError = "resourceError",
  reqError = "reqError",
  vuejsError = "vuejsError",
  batchErrors = "batchErrors",

  performanceInfoReady = "performanceInfoReady",
  reqStart = "reqStart",
  reqEnd = "reqEnd",
  mouseTrack = "mouseTrack",
  event = "event",

  /* SDK inner events */
  _clickEle = "_clickEle",
  _console = "_console",
  _onConsoleTrack = "_onConsoleTrack",
  _offConsoleTrack = "_offConsoleTrack",
  _mouseTrack = "_mouseTrack",
  _initOptions = "_initOptions",
  _globalDataChange = "_globalDataChange",
}

export enum ErrorType {
  vueJsError = "vuejsError",
  jsError = "jsError",
  unHandleRejectionError = "unHandleRejectionError",
  resourceError = "resourceError",
  httpRequestError = "httpError",
}
