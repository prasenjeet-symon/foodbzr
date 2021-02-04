import { backendTestDatasource } from './backend-test-datasource';

describe('backendTestDatasource', () => {
    it('should work', () => {
        expect(backendTestDatasource()).toEqual('backend-test-datasource');
    });
});
