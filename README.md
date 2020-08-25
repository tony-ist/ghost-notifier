## What it does

Notifies by email and telegram channel your ghost subscribers when new post is published. 

## Requirements
- [Latest stable node](https://github.com/nvm-sh/nvm)

## Config format

```
{
    adminApiKey: 'sample:key',
    ghostBaseUrl: 'http://example.com',
    mailHost: 'smtp.example.com',
    mailUser: 'info@example.com',
    mailPassword: 'secretlysecret',
    webhookUrl: 'yourwebhookurlwithoutslash',
    port: 3001,
    telegramBotToken: 'sample:token',
    telegramChatId: '@example',
    proxyHost: 'localhost',
    proxyPort: 1080,
}
``` 

## Development

You can use `ssh -D 1080 user@host -N -v` to enable port forwarding if telegram is blocked in your country. 