import GaroonSoap from 'garoon-soap';
import * as base from 'garoon-soap/dist/type/base';
import { EventInfo } from '../model/event';
import EventConverter from './eventconverter';

interface GaroonDataSource {
    getScheduleEvents(rangeStart: string, rangeEnd: string, targetType: string, target: string): Promise<EventInfo[]>;
    getMyGroupVersions(myGroupItems: base.ItemVersionType[]): Promise<base.ItemVersionResultType[]>;
    getMyGroupsById(id: string[]): Promise<base.MyGroupType[]>;
}

export default class GaroonDataSourceImpl implements GaroonDataSource {
    private baseUrl: string;
    private PATH = 'api/v1/';
    private soap: GaroonSoap;

    constructor(domain: string) {
        this.baseUrl = `https://${domain}/g/`;
        this.soap = new GaroonSoap(this.baseUrl);
    }

    async getScheduleEvents(rangeStart: string, rangeEnd: string, targetType = '', target = ''): Promise<EventInfo[]> {
        const url = new URL(`${this.baseUrl}${this.PATH}schedule/events`);
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

        const respStream = await fetch(url.toString(), {
            method: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
        const respJson = await respStream.json();
        return respJson.events.map(event => {
            return EventConverter.convertToEventInfo(event);
        });
    }

    getMyGroupVersions(myGroupItems: base.ItemVersionType[]): Promise<base.ItemVersionResultType[]> {
        return this.soap.base.getMyGroupVersions(myGroupItems);
    }

    getMyGroupsById(groupIds: string[]): Promise<base.MyGroupType[]> {
        return this.soap.base.getMyGroupsById(groupIds);
    }
}
