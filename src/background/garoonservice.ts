import GaroonSoap from 'garoon-soap';

interface GaroonService {
    getScheduleEvents(url: any, params: any): Promise<any>;
    getMyGroupVersions(): Promise<any>;
    getMyGroupsByIds(id: string[]): Promise<any>;
}

class GaroonServiceImpl implements GaroonService {
    private BASE_URL = `${document.domain}/g/`; // https://bozuman.cybozu.com/g/
    private PATH = '/api/v1/';
    private soap = new GaroonSoap(this.BASE_URL);

    getScheduleEvents(params: any): Promise<any> {
        const url = new URL(`${this.BASE_URL}${this.PATH}/schedule/events`);
        url.searchParams.append('orderBy', 'start asc');
        url.searchParams.append('rangeStart', params.startDate.toISOString());
        url.searchParams.append('rangeEnd', params.endDate.toISOString());
        url.searchParams.append('targetType', params.targetType);
        url.searchParams.append('target', params.target);
        return fetch(url.toString(), { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    }

    getMyGroupVersions(): Promise<any> {
        return this.soap.base.getMyGroupVersions([]);
    }

    getMyGroupsByIds(groupIds: string[]): Promise<any> {
        return this.soap.base.getMyGroupsById(groupIds);
    }
}
