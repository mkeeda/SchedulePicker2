import GaroonDataSource from './garoondatasource';
import * as base from 'garoon-soap/dist/type/base';
import GaroonDataSourceImpl from './garoondatasource';
import { EventInfo, Participant, MyGroupEvent } from '../types/event';
import EventConverter from '../background/eventconverter';
import { DateRange } from '../types/date';

interface ScheduleEventsLogic {
    getMyEvents(
        dateRange: DateRange,
        isIncludePrivateEvent: boolean,
        isIncludeAllDayEvent: boolean,
        targetType: string,
        target: string
    ): Promise<EventInfo[]>;
    getSortedMyEvents(
        dateRange: DateRange,
        isIncludePrivateEvent: boolean,
        isIncludeAllDayEvent: boolean,
        targetType: string,
        target: string
    ): Promise<EventInfo[]>;
    getMyGroups(): Promise<base.MyGroupType[]>;
    getMyGroupEvents(
        dateRange: DateRange,
        isIncludePrivateEvent: boolean,
        isIncludeAllDayEvent: boolean,
        groupId: string
    ): Promise<MyGroupEvent[]>;
    getNarrowedDownPublicHolidays(specificDate: Date): Promise<string[]>;
}

export default class ScheduleEventsLogicImpl implements ScheduleEventsLogic {
    private garoonDataSource: GaroonDataSource;

    constructor(domain: string) {
        this.garoonDataSource = new GaroonDataSourceImpl(domain);
    }

    private sortByTimeFunc(eventInfo: EventInfo, nextEventInfo: EventInfo): number {
        return eventInfo.startTime.getTime() > nextEventInfo.startTime.getTime() ? 1 : -1;
    }

    async getMyEvents(
        dateRange: DateRange,
        isIncludePrivateEvent: boolean,
        isIncludeAllDayEvent: boolean,

        targetType = '',
        target = ''
    ): Promise<EventInfo[]> {
        const events = await this.garoonDataSource.getScheduleEvents(
            dateRange.startDate.toISOString(),
            dateRange.endDate.toISOString(),
            targetType,
            target
        );
        return events.filter(event => {
            let isIncludeEvent = true;

            if (!isIncludePrivateEvent) {
                isIncludeEvent = event.visibilityType !== 'PRIVATE';
            }

            if (!isIncludeAllDayEvent) {
                isIncludeEvent = !event.isAllDay;
            }

            return isIncludeEvent;
        });
    }

    async getSortedMyEvents(
        dateRange: DateRange,
        isIncludePrivateEvent: boolean,
        isIncludeAllDayEvent: boolean,
        targetType = '',
        target = ''
    ): Promise<EventInfo[]> {
        const eventInfoList = await this.getMyEvents(
            dateRange,
            isIncludePrivateEvent,
            isIncludeAllDayEvent,
            targetType,
            target
        );
        return eventInfoList.sort(this.sortByTimeFunc);
    }

    // TODO: 型定義ファイルを作る
    async getMyGroups(): Promise<base.MyGroupType[]> {
        const myGroupVersions = await this.garoonDataSource.getMyGroupVersions([]);
        const myGroupIds = myGroupVersions.map(group => group.id);
        return this.garoonDataSource.getMyGroupsById(myGroupIds);
    }

    async getMyGroupEvents(
        dateRange: DateRange,
        isIncludePrivateEvent: boolean,
        isIncludeAllDayEvent: boolean,
        groupId: string
    ): Promise<MyGroupEvent[]> {
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
                const eventInfoList = await this.getMyEvents(
                    dateRange,
                    isIncludePrivateEvent,
                    isIncludeAllDayEvent,
                    'user',
                    userId
                );
                return eventInfoList;
            })
        );

        /*
            [{}, {}, {},........]
        */
        let mergeEventInfoList: EventInfo[] = [];
        eventInfoPerUserList.forEach(events => {
            mergeEventInfoList = mergeEventInfoList.concat(events);
        });

        const myGroupEventList = mergeEventInfoList
            .reduce((uniqueEvents: EventInfo[], currentEvent: EventInfo) => {
                if (!uniqueEvents.some(event => event.id === currentEvent.id)) {
                    uniqueEvents.push(currentEvent);
                }
                return uniqueEvents;
            }, [])
            .sort(this.sortByTimeFunc)
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

    async getNarrowedDownPublicHolidays(specificDate: Date): Promise<string[]> {
        const calendarEvents = await this.garoonDataSource.getCalendarEvents();
        return calendarEvents
            .filter(event => {
                const holiday = new Date(event.date);

                const oneMonthBefore = new Date(
                    specificDate.getFullYear(),
                    specificDate.getMonth() - 1,
                    specificDate.getDate()
                );
                const oneMonthLater = new Date(
                    specificDate.getFullYear(),
                    specificDate.getMonth() + 1,
                    specificDate.getDate()
                );
                // リストのサイズが大きすぎるので、指定した日からの1ヶ月前後の祝日のリストに絞り込む
                return (
                    event.type === 'public_holiday' &&
                    oneMonthLater.getTime() > holiday.getTime() &&
                    holiday.getTime() > oneMonthBefore.getTime()
                );
            })
            .map(event => new Date(event.date).toLocaleDateString());
    }
}
