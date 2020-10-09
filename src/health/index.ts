import {CommandInterface} from '../command-interface';

const ServingStatus = {
  UNKNOWN: 'UNKNOWN',
  SERVING: 'SERVING',
  NOT_SERVING: 'NOT_SERVING',
};

export class Health {

  readonly ci: CommandInterface;
  readonly readiness?: () => Promise<boolean>;

  constructor(ci: CommandInterface, readiness?: () => Promise<boolean>) {
    this.ci = ci;
    this.readiness = readiness;
  }

  async watch(call, context?: any): Promise<any> {
    // IGNORED
  }

  async check(call, context?: any): Promise<any> {
    const service = (call.request && call.request.service) || 'liveness';

    if (service === 'readiness') {
      if (!await this.readiness()) {
        return {status: ServingStatus.NOT_SERVING};
      }
    }

    const response = await this.ci.check({});

    if (!('status' in response)) {
      return {status: ServingStatus.UNKNOWN};
    }

    return response;
  }

}
