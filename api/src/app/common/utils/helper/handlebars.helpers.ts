import * as Handlebars from 'handlebars';

export function registerHandlebarsHelpers() {
    Handlebars.registerHelper('strlen', (str: string) => (str ? str.length : 0));

    Handlebars.registerHelper('truncate', (str: string, len: number) =>
        str && str.length > len ? str.substring(0, len) : str,
    );

    Handlebars.registerHelper('gt', (a: number, b: number) => a > b);
    Handlebars.registerHelper('multiply', (a, b) => {
        const num1 = parseFloat(a);
        const num2 = parseFloat(b);
        if (isNaN(num1) || isNaN(num2)) return 0;
        return (num1 * num2).toFixed(2);
    });
    
    Handlebars.registerHelper('inc', (value) => {
        return parseInt(value) + 1;
    });
}