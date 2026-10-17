export type HouseUpdateContext = {
  isDev: boolean
  platform: string
  isEnabled: boolean
  isUpdatePending: boolean
  isStartupProcedureRunning: boolean
  isChecking: boolean
  isDownloading: boolean
}

export function houseUpdateCanRun(
  ctx: Pick<HouseUpdateContext, 'isDev' | 'platform' | 'isEnabled'>,
) {
  return !ctx.isDev && ctx.platform !== 'web' && ctx.isEnabled
}

export function houseUpdateShouldReload(ctx: HouseUpdateContext) {
  return houseUpdateCanRun(ctx) && ctx.isUpdatePending
}

export function houseUpdateShouldFetch(ctx: HouseUpdateContext) {
  if (!houseUpdateCanRun(ctx)) return false
  if (ctx.isStartupProcedureRunning || ctx.isChecking || ctx.isDownloading) return false
  return true
}
