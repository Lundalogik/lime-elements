import {
    countPages,
    countRows,
    hasMultiplePages,
    ignoredTotalMessage,
    isTotalIgnored,
    refusedPageMessage,
} from './pagination';

describe('countRows', () => {
    it('counts the rows a local table holds', () => {
        expect(
            countRows({ remote: false, rows: 25, totalRows: undefined })
        ).toBe(25);
    });

    it('counts the rows a local table holds over a total that says otherwise', () => {
        expect(countRows({ remote: false, rows: 25, totalRows: 100 })).toBe(25);
    });

    it('counts the total a remote table was given', () => {
        expect(countRows({ remote: true, rows: 10, totalRows: 100 })).toBe(100);
    });

    it('has no count for a remote table until it is given a total', () => {
        expect(
            countRows({ remote: true, rows: 10, totalRows: undefined })
        ).toBeNull();
    });

    it('counts an emptied remote set as empty, not as unknown', () => {
        expect(countRows({ remote: true, rows: 0, totalRows: undefined })).toBe(
            0
        );
    });
});

describe('countPages', () => {
    it('counts the pages the rows make up', () => {
        expect(countPages(25, 10)).toBe(3);
    });

    it('counts no pages for an empty set', () => {
        expect(countPages(0, 10)).toBe(0);
    });

    it('has no count while the rows are unknown', () => {
        expect(countPages(null, 10)).toBeNull();
    });

    it('has no count without a page size', () => {
        expect(countPages(25, undefined)).toBeNull();
    });
});

describe('hasMultiplePages', () => {
    it('reports more than one page when the rows do not fit on one', () => {
        expect(hasMultiplePages(25, 10)).toBe(true);
    });

    it('reports one page for a set that fits', () => {
        expect(hasMultiplePages(10, 10)).toBe(false);
    });

    it('does not claim pages while the count is unknown', () => {
        expect(hasMultiplePages(null, 10)).toBe(false);
    });

    it('does not claim pages when there is no page size', () => {
        expect(hasMultiplePages(25, undefined)).toBe(false);
    });
});

describe('isTotalIgnored', () => {
    it('reports a local total that disagrees with the rows', () => {
        expect(
            isTotalIgnored({ remote: false, rows: 25, totalRows: 100 }, 10)
        ).toBe(true);
    });

    it('reports a local total of zero beside rows', () => {
        expect(
            isTotalIgnored({ remote: false, rows: 25, totalRows: 0 }, 10)
        ).toBe(true);
    });

    it('says nothing about a total a remote table counts from', () => {
        expect(
            isTotalIgnored({ remote: true, rows: 10, totalRows: 100 }, 10)
        ).toBe(false);
    });

    it('waits for rows before calling a total wrong', () => {
        expect(
            isTotalIgnored({ remote: false, rows: 0, totalRows: 100 }, 10)
        ).toBe(false);
    });

    it('says nothing about a prop nobody set', () => {
        expect(
            isTotalIgnored(
                { remote: false, rows: 25, totalRows: undefined },
                10
            )
        ).toBe(false);
    });

    it('says nothing about a table that does not paginate', () => {
        expect(
            isTotalIgnored(
                { remote: false, rows: 25, totalRows: 100 },
                undefined
            )
        ).toBe(false);
    });

    it('says nothing about a total that matches the rows', () => {
        expect(
            isTotalIgnored({ remote: false, rows: 25, totalRows: 25 }, 10)
        ).toBe(false);
    });
});

describe('ignoredTotalMessage', () => {
    it('names the total it ignored and the rows it counted', () => {
        const message = ignoredTotalMessage(100, 25);

        expect(message).toContain('limel-table');
        expect(message).toContain('(100)');
        expect(message).toContain('25 rows');
    });
});

describe('refusedPageMessage', () => {
    it('reports what it knows rather than a cause', () => {
        const message = refusedPageMessage({
            page: 4,
            lastPage: 1,
            remote: false,
            pageProp: 4,
            totalRows: undefined,
            rows: 1,
        });

        expect(message).toContain('limel-table');
        expect(message).toContain('page 4');
        expect(message).toContain('the last page is 1');
        expect(message).toContain('mode: local');
        expect(message).toContain('totalRows: undefined');
        expect(message).toContain('data.length: 1');
    });

    it('says which mode a remote table was in', () => {
        const message = refusedPageMessage({
            page: 9,
            lastPage: 3,
            remote: true,
            pageProp: 9,
            totalRows: 25,
            rows: 10,
        });

        expect(message).toContain('mode: remote');
    });
});
