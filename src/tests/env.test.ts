import { ENV } from '../config/env';

describe('ENV config', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('provides dev defaults if env vars missing', async () => {
    delete process.env.REACT_APP_API_URL;
    delete process.env.REACT_APP_EXPORT_API_URL;
    const { ENV } = await import('../config/env');
    expect(ENV.API_URL).toContain('http://localhost');
    expect(ENV.EXPORT_API_URL).toContain('http://localhost');
  });
});


