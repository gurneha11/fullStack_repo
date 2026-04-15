export const logger = (req, res, next) => {
    debugger;
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
};