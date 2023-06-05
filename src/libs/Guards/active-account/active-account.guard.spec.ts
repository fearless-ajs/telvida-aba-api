import { ActiveAccountGuard } from './active-account.guard';

describe('ActiveAccountGuard', () => {
  it('should be defined', () => {
    expect(new ActiveAccountGuard()).toBeDefined();
  });
});
