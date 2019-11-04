import GaroonSoap from 'garoon-soap';
console.log('1');
const garoon = new GaroonSoap(`https://bozuman.s.cybozu.com/g/`);
console.log('hoge');
const start = new Date();
start.setDate(start.getDate() + 2);
const end = new Date();
end.setDate(start.getDate() + 3);
garoon.schedule.getEvents(start, end).then(events => {
    console.log(events);
});
