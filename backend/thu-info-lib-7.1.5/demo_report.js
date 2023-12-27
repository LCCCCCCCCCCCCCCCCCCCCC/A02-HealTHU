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
        const report = await helper.getPhysicalExamResult();
        console.log(report);
    } catch (e) {
        console.error(e);
        console.error("体测成绩获取失败。");
    }
})().catch((error) => {
    console.error(error);
}).finally(() => {
    process.exit();
});