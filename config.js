const config =
{
    server: {
        host: "localhost",
        port: 80,
    },
    directories: {
        outgoing: "/var/spool/sms/outgoing/",
        checked: "/var/spool/sms/checked/",
        sent: "/var/spool/sms/sent/",
        failed: "/var/spool/sms/failed/",
    },
    message: {
        idLength: 10,
    }
};

module.exports = config;