import GaroonService from './garoonservice';

enum ScheduleEventType {
    TODAY,
    NEXT_BUSINESS_DAY,
    SECRET,
}

export default class ScheduleEventsModel {
    private garoonService = new GaroonService();

    getMySchedule(): Promise<any> {
        // TODO: typeによる条件分岐を追加する
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        return this.garoonService.getScheduleEvents(startDate.toISOString(), endDate.toISOString());
    }
}
