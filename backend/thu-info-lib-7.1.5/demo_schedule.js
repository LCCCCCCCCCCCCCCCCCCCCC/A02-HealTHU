import {InfoHelper} from "./dist";
import {question, keyInYNStrict} from "readline-sync";

const userId = process.argv[2];
const password = process.argv[3];

(async () => {
    const helper = new InfoHelper();
    try{
        await helper.login(
            {
                userId: userId,
                password: password,
            },
        );
    }catch(e){
        console.error(e);
        console.log("LoginError");
    }
    // Go on with your code here.
    try {
        const schedule = await helper.getSchedule();
        console.log(schedule.calendar);
        for (let i = 0; i < schedule.schedule.length; i++) {
            console.log("------")
            console.log(schedule.schedule[i]);
            console.log(schedule.schedule[i].activeTime.base.length)
            console.log("-----")
            console.log(schedule.schedule[i].activeTime)
            console.log("----")
            for(let j = 0; j < schedule.schedule[i].activeTime.base.length;j++){
                console.log(schedule.schedule[i].activeTime.base[j].activeWeeks)
                console.log("---")
            }
            
        }
    } catch (e) {
        console.error(e);
        console.error("课程表获取失败。");
    }
})().catch((error) => {
    console.error(error);
}).finally(() => {
    process.exit();
});