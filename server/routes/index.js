module.exports = app => {
    const coastersRouter = require("./coaster.routes")
    app.use("/api", coastersRouter)

    const authRouter = require("./auth.routes")
    app.use("/api", authRouter)
}