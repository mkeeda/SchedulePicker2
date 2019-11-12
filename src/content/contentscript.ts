import ScheduleEventsModel from '../background/scheduleeventsmodel';

const testPromise = async (): Promise<void> => {
    const model = new ScheduleEventsModel();
    const resp = await model.getMySchedule();
    const json = await resp.json();
    console.log(json);
};

console.log('echo backgroundddd');
testPromise();
