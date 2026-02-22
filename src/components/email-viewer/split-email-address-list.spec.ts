import { splitEmailAddressList } from './split-email-address-list';

describe('splitEmailAddressList', () => {
    it('splits simple comma-separated addresses', () => {
        expect(
            splitEmailAddressList(
                'alice@example.com, bob@example.com, carol+label@example.com'
            )
        ).toEqual([
            'alice@example.com',
            'bob@example.com',
            'carol+label@example.com',
        ]);
    });

    it('returns a single address as-is', () => {
        expect(splitEmailAddressList('alice@example.com')).toEqual([
            'alice@example.com',
        ]);
    });

    it('handles display names with angle brackets', () => {
        expect(
            splitEmailAddressList(
                'Alice <alice+work@example.com>, Bob <bob@example.com>'
            )
        ).toEqual(['Alice <alice+work@example.com>', 'Bob <bob@example.com>']);
    });

    it('preserves commas inside quoted display names', () => {
        expect(
            splitEmailAddressList(
                '"Doe, Jane" <jane@example.com>, Team <team@example.com>'
            )
        ).toEqual([
            '"Doe, Jane" <jane@example.com>',
            'Team <team@example.com>',
        ]);
    });

    it('handles escaped quotes within quoted strings', () => {
        expect(
            splitEmailAddressList(
                String.raw`"Say \"Hello\"" <hello@example.com>, other@example.com`
            )
        ).toEqual([
            String.raw`"Say \"Hello\"" <hello@example.com>`,
            'other@example.com',
        ]);
    });

    it('does not split on commas inside angle brackets', () => {
        expect(
            splitEmailAddressList(
                'Name <user@example.com,extra>, other@test.com'
            )
        ).toEqual(['Name <user@example.com,extra>', 'other@test.com']);
    });

    it('returns an empty array for empty input', () => {
        expect(splitEmailAddressList('')).toEqual([]);
    });

    it('returns an empty array for whitespace-only input', () => {
        expect(splitEmailAddressList('   ')).toEqual([]);
    });

    it('trims whitespace from parts', () => {
        expect(
            splitEmailAddressList('  alice@example.com ,  bob@example.com  ')
        ).toEqual(['alice@example.com', 'bob@example.com']);
    });

    it('skips empty segments between commas', () => {
        expect(
            splitEmailAddressList('alice@example.com,,bob@example.com')
        ).toEqual(['alice@example.com', 'bob@example.com']);
    });

    it('handles multiple quoted display names with commas', () => {
        expect(
            splitEmailAddressList(
                '"Last, First" <a@x.com>, "Another, Name" <b@x.com>'
            )
        ).toEqual(['"Last, First" <a@x.com>', '"Another, Name" <b@x.com>']);
    });

    it('handles a group address syntax', () => {
        expect(
            splitEmailAddressList('undisclosed-recipients:;, admin@example.com')
        ).toEqual(['undisclosed-recipients:;', 'admin@example.com']);
    });
});
