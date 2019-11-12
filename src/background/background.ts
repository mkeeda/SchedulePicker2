import ScheduleEventsModel from './scheduleeventsmodel';

const testPromise = async (): Promise<void> => {
    const model = new ScheduleEventsModel();
    const resp = await model.getMySchedule();
    console.log(resp);
};

console.log('echo backgroundddd');
testPromise();
