import GaroonService from './garoonservice';
import { ScheduleEventType } from './eventtype';
import * as base from 'garoon-soap/dist/type/base';

interface ScheduleEventsLogic {
    getMySchedule(ScheduleEventType): Promise<any>;
    getMyGroups(): Promise<base.MyGroupType[]>;
    getMyGroupSchedule(member, string): Promise<any>;
}

export default class ScheduleEventsLogicImpl implements ScheduleEventsLogic {
    private garoonService = new GaroonService();

    private findDateFromType(type: ScheduleEventType): any {
        // TODO: typeによる条件分岐を追加する
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        return { start: startDate, end: endDate };
    }

    async getMySchedule(type: ScheduleEventType, targetType = '', target = ''): Promise<any> {
        const date = this.findDateFromType(type);
        const respStream = await this.garoonService.getScheduleEvents(
            date.start.toISOString(),
            date.end.toISOString(),
            targetType,
            target
        );
        return respStream.json();
    }

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
        const eventsPerUserList = await Promise.all(
            groupMemberList.map(async userId => {
                const schedule = await this.getMySchedule(type, 'user', userId);
                return schedule.events;
            })
        );

        /*
            [{}, {}, {},........]
        */
        let mergeEventsList = [];
        eventsPerUserList.forEach(events => {
            mergeEventsList = mergeEventsList.concat(events);
        });

        const events = mergeEventsList
            .reduce((uniqueEvents: any, currentEvent: any) => {
                if (!uniqueEvents.some(event => event.id === currentEvent.id)) {
                    uniqueEvents.push(currentEvent);
                }
                return uniqueEvents;
            }, [])
            .map(event => {
                const participantNameList: string[] = [];
                event.attendees.forEach((participant: any) => {
                    groupMemberList.forEach(userId => {
                        if (participant.id === userId) {
                            participantNameList.push(participant.name.split(' ')[0]);
                        }
                    });
                });

                //TODO: スケジュールのタイトルに名前を入れない
                event.subject += ` (${participantNameList.join('、')})`;
                return event;
            });

        /*
            {events: [{}, {}, {}....]}
        */
        return { events: events };
    }
}
