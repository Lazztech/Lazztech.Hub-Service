import { of } from 'rxjs';
import { ModerationInterceptor } from './moderation.interceptor';

describe('ModerationInterceptor', () => {
  const interceptor = new ModerationInterceptor();

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should not intercept objects unless they have truthy banned field', async () => {
    // arrange
    const mockNonBannedResponse = {
      id: 'notBanned'
    };
    const mockCallHandler = {
      handle: () => of(mockNonBannedResponse)
    };
    // act
    const result = await interceptor.intercept(null, mockCallHandler).toPromise();
    // assert
    expect(result).toBe(mockNonBannedResponse);
  });

  it('should intercept banned objects', async () => {
    // arrange
    const mockBannedResponse = {
      banned: true
    };
    const mockCallHandler = {
      handle: () => of(mockBannedResponse)
    };
    // act
    const result = await interceptor.intercept(null, mockCallHandler).toPromise();
    // assert
    expect(result).toBeUndefined();
  });

  it('should intercept banned objects from an array', async () => {
    // arrange
    const mockNonBannedResponse = {
      id: 'notBanned'
    };
    const mockBannedResponse = {
      banned: true
    };
    const mockCallHandler = {
      handle: () => of([
        mockNonBannedResponse,
        mockBannedResponse
      ])
    };

    // act
    const result = await interceptor.intercept(null, mockCallHandler).toPromise();

    // assert
    expect(result).toEqual([mockNonBannedResponse]);
  });

});
