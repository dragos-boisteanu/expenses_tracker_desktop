const sleep = (sleepTime = 1000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, sleepTime);
    });
};
export default sleep;
