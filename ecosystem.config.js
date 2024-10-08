// pm2 start npm --name "drn-apis" -- run serve

module.exports = {
    apps: [
        {
            name   : "drn-apis",
            script : "npm",
            args   : "run serve"
        }
    ]
}
