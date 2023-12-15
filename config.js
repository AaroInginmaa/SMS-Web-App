const config =
{
    server: {
        host: "localhost",
        port: 80,
    },
    directories: {
        test: "./test/",
        outgoing: "/var/spool/sms/outgoing",
        checked: "/var/spool/sms/checked",
        sent: "/var/spool/sms/sent",
        failed: "/var/spool/sms/failed",
    },
    message: {
        idLength: 10,       // Specifies how long a the randomly generated name for a message file is
        alphabet: "UTF"     // Specifies what encoding the message uses
    }
};

module.exports = config;