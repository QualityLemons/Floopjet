const { isAtLimit, assembleAudiences, isFieldEmpty } = require('./helpers');

describe('isAtLimit — character counter threshold', () => {
    test('returns false when length is below the limit', () => {
        expect(isAtLimit(0, 210)).toBe(false);
        expect(isAtLimit(100, 210)).toBe(false);
        expect(isAtLimit(209, 210)).toBe(false);
    });

    test('returns true when length equals the limit', () => {
        expect(isAtLimit(210, 210)).toBe(true);
    });

    test('returns true when length exceeds the limit', () => {
        expect(isAtLimit(211, 210)).toBe(true);
        expect(isAtLimit(500, 210)).toBe(true);
    });

    test('works with any arbitrary max value', () => {
        expect(isAtLimit(99, 100)).toBe(false);
        expect(isAtLimit(100, 100)).toBe(true);
        expect(isAtLimit(50, 50)).toBe(true);
    });

    test('returns false for zero length against a positive max', () => {
        expect(isAtLimit(0, 1)).toBe(false);
    });
});

describe('assembleAudiences — checkbox value assembly', () => {
    test('joins multiple values with ", "', () => {
        expect(assembleAudiences(['Young people', 'Educators'])).toBe('Young people, Educators');
    });

    test('returns a single value without a trailing comma', () => {
        expect(assembleAudiences(['Young people'])).toBe('Young people');
    });

    test('returns an empty string for an empty array', () => {
        expect(assembleAudiences([])).toBe('');
    });

    test('handles three or more values', () => {
        const result = assembleAudiences(['A', 'B', 'C']);
        expect(result).toBe('A, B, C');
    });

    test('preserves the order of values as given', () => {
        const values = ['Carers', 'AAC users', 'Support workers'];
        expect(assembleAudiences(values)).toBe('Carers, AAC users, Support workers');
    });
});

describe('isFieldEmpty — required field validation', () => {
    test('returns true for an empty string', () => {
        expect(isFieldEmpty('')).toBe(true);
    });

    test('returns true for a whitespace-only string', () => {
        expect(isFieldEmpty('   ')).toBe(true);
        expect(isFieldEmpty('\t\n')).toBe(true);
    });

    test('returns false for a string with content', () => {
        expect(isFieldEmpty('Hello')).toBe(false);
    });

    test('returns false for a string that is content surrounded by spaces', () => {
        expect(isFieldEmpty('  hi  ')).toBe(false);
    });
});
