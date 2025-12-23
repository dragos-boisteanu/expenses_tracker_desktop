const sleep = (sleepTime = 1000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, sleepTime);
    });
};
export default sleep;
