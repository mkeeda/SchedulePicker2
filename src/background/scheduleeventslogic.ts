import GaroonService from './garoonservice';
import { ScheduleEventType } from './eventtype';
import * as base from 'garoon-soap/dist/type/base';
import GaroonServiceImpl from './garoonservice';
import { Participant } from '../model/event';
import EventConverter from '../background/eventconverter';
import * as util from './util';

interface ScheduleEventsLogic {
    getMyEvents(type: ScheduleEventType, targetType: string, target: string): Promise<any>;
    getSortedMyEvents(type: ScheduleEventType, targetType: string, target: string): Promise<any>;
    getMyGroups(): Promise<base.MyGroupType[]>;
    getMyGroupSchedule(type: ScheduleEventType, groupId: string): Promise<any>;
}

export default class ScheduleEventsLogicImpl implements ScheduleEventsLogic {
    private garoonService: GaroonService;

    constructor(domain: string) {
        this.garoonService = new GaroonServiceImpl(domain);
    }

    private findDateFromType(type: ScheduleEventType): any {
        // TODO: typeによる条件分岐を追加する
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        return { start: startDate, end: endDate };
    }

    async getMyEvents(type: ScheduleEventType, targetType = '', target = ''): Promise<any> {
        const date = this.findDateFromType(type);
        const respStream = await this.garoonService.getScheduleEvents(
            date.start.toISOString(),
            date.end.toISOString(),
            targetType,
            target
        );
        const respJson = await respStream.json();
        return respJson.events.map(event => {
            return EventConverter.convertToEventInfo(event);
        });
    }

    async getSortedMyEvents(type: ScheduleEventType, targetType = '', target = ''): Promise<any> {
        const eventInfoList = await this.getMyEvents(type);
        return eventInfoList.sort(util.sortByTimeFunc);
    }

    // TODO: 型定義ファイルを作る
    async getMyGroups(): Promise<base.MyGroupType[]> {
        const myGroupVersions = await this.garoonService.getMyGroupVersions([]);
        const myGroupIds = myGroupVersions.map(group => group.id);
        return this.garoonService.getMyGroupsById(myGroupIds);
    }

    async getMyGroupSchedule(type: ScheduleEventType, groupId: string): Promise<any> {
        const myGroups = await this.getMyGroups();
        const targetMyGroups = myGroups.filter(g => g.key === groupId);

        if (targetMyGroups.length === 0) {
            throw new Error('選択したMyグループが存在しません');
        }
        const groupMemberList = targetMyGroups[0].belong_member;

        /*
        [
            [{}, {}, {}],
            [{}, {}, {}],
            [{}, {}, {}]
            ....
        ]
        */
        const eventInfoPerUserList = await Promise.all(
            groupMemberList.map(async userId => {
                const eventInfoList = await this.getMyEvents(type, 'user', userId);
                return eventInfoList;
            })
        );

        /*
            [{}, {}, {},........]
        */
        let mergeEventInfoList = [];
        eventInfoPerUserList.forEach(events => {
            mergeEventInfoList = mergeEventInfoList.concat(events);
        });

        const myGroupEventList = mergeEventInfoList
            .reduce((uniqueEvents: any, currentEvent: any) => {
                if (!uniqueEvents.some(event => event.id === currentEvent.id)) {
                    uniqueEvents.push(currentEvent);
                }
                return uniqueEvents;
            }, [])
            .sort(util.sortByTimeFunc)
            .map(eventInfo => {
                const participantList: Participant[] = [];
                eventInfo.attendees.forEach((participant: Participant) => {
                    groupMemberList.forEach(userId => {
                        if (participant.id === userId) {
                            participantList.push(participant);
                        }
                    });
                });
                return EventConverter.convertToMyGroupEvent(eventInfo, participantList);
            });

        /*
            [{}, {}, {}....]
        */
        return myGroupEventList;
    }
}
