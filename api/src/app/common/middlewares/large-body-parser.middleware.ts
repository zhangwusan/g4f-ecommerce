import { json, urlencoded } from 'body-parser';

export const largeBodyParser = json({ limit: '30mb' });
export const largeUrlencodedParser = urlencoded({ limit: '30mb', extended: true });
export const largeBodyParserForManagement = json({ limit: '100mb' });