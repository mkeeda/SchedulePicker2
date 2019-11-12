import GaroonService from './garoonservice';
import { ScheduleEventType } from './eventtype';
import * as base from 'garoon-soap/dist/type/base';

export default class ScheduleEventsModel {
    private garoonService = new GaroonService();

    private findDateFromType(type: ScheduleEventType): any {
        // TODO: typeによる条件分岐を追加する
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        return { start: startDate, end: endDate };
    }

    // TODO: 引数でScheduleTypeを受け取る
    async getMySchedule(): Promise<any> {
        const date = this.findDateFromType(ScheduleEventType.TODAY);
        const respStream = await this.garoonService.getScheduleEvents(date.start.toISOString(), date.end.toISOString());
        const respJson = await respStream.json();
        return respJson;
    }

    async getMyGroups(): Promise<base.MyGroupType[]> {
        const myGroupVersions = await this.garoonService.getMyGroupVersions([]);
        const myGroupIds = myGroupVersions.map(group => group.id);
        return this.garoonService.getMyGroupsById(myGroupIds);
    }
}
