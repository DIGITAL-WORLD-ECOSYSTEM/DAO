import imap from 'imap-simple';

const config = {
    imap: {
        user: 'suporte@asppibra.com.br',
        password: '#SUPORTE#2026#App',
        host: 'imap.zoho.com',
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: { rejectUnauthorized: false }
    }
};

imap.connect(config).then(connection => {
    console.log('Connected to IMAP successfully!');
    return connection.openBox('INBOX').then(() => {
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], struct: true };
        return connection.search(searchCriteria, fetchOptions).then(messages => {
            console.log(`Found ${messages.length} unseen messages.`);
            connection.end();
        });
    });
}).catch(err => {
    console.error('IMAP Error:', err);
});
