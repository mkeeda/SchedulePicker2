import GaroonSoap from 'garoon-soap';
import * as base from 'garoon-soap/dist/type/base';

interface GaroonService {
    getScheduleEvents(rangeStart: string, rangeEnd: string, targetType: string, target: string): Promise<any>;
    getMyGroupVersions(myGroupItems: base.ItemVersionType[]): Promise<base.ItemVersionResultType[]>;
    getMyGroupsById(id: string[]): Promise<base.MyGroupType[]>;
}

export default class GaroonServiceImpl implements GaroonService {
    private BASE_URL = 'https://bozuman.s.cybozu.com/g/'; //FIXME: セキュアアクセス以外のときも動くようにする
    private PATH = 'api/v1/';
    private soap = new GaroonSoap(this.BASE_URL);

    getScheduleEvents(rangeStart: string, rangeEnd: string, targetType = '', target = ''): Promise<any> {
        const url = new URL(`${this.BASE_URL}${this.PATH}schedule/events`);
        url.searchParams.append('orderBy', 'start asc');

        if (rangeStart !== null) {
            url.searchParams.append('rangeStart', rangeStart);
        }

        if (rangeEnd !== null) {
            url.searchParams.append('rangeEnd', rangeEnd);
        }

        if (targetType !== null && targetType !== '') {
            url.searchParams.append('targetType', targetType);
        }

        if (target !== null && target !== '') {
            url.searchParams.append('target', target);
        }

        return fetch(url.toString(), {
            method: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
    }

    getMyGroupVersions(myGroupItems: base.ItemVersionType[]): Promise<base.ItemVersionResultType[]> {
        return this.soap.base.getMyGroupVersions(myGroupItems);
    }

    getMyGroupsById(groupIds: string[]): Promise<base.MyGroupType[]> {
        return this.soap.base.getMyGroupsById(groupIds);
    }
}