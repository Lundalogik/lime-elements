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

    // Tabulator pages the rows it was handed and refuses any page past them,
    // so counting from a larger total would offer pages that do nothing but
    // warn when they are clicked.
    it('counts the rows a local table holds over a total that says otherwise', () => {
        expect(countRows({ remote: false, rows: 25, totalRows: 100 })).toBe(25);
    });

    it('counts the total a remote table was given', () => {
        expect(countRows({ remote: true, rows: 10, totalRows: 100 })).toBe(100);
    });

    // A remote table holds one page, so the rows it holds say nothing about
    // how many there are. Counting them would make every set one page.
    it('has no count for a remote table until it is given a total', () => {
        expect(
            countRows({ remote: true, rows: 10, totalRows: undefined })
        ).toBeNull();
    });

    // Otherwise a set that shrinks to nothing reads as a count on its way,
    // and the pagination goes on showing the pages the old count had.
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

    // Guessing from the rows we happen to hold shrinks the set under a user
    // who is on a later page.
    it('has no count while the rows are unknown', () => {
        expect(countPages(null, 10)).toBeNull();
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
            isTotalIgnored({ remote: false, rows: 25, totalRows: 100 })
        ).toBe(true);
    });

    // A total of 0 beside rows is a total like any other: the table is in the
    // same state as one given 100, and only the second used to be reported.
    it('reports a local total of zero beside rows', () => {
        expect(isTotalIgnored({ remote: false, rows: 25, totalRows: 0 })).toBe(
            true
        );
    });

    it('says nothing about a total a remote table counts from', () => {
        expect(isTotalIgnored({ remote: true, rows: 10, totalRows: 100 })).toBe(
            false
        );
    });

    // A total that arrives before the rows is not a mistake, and the rows are
    // what it would be measured against.
    it('waits for rows before calling a total wrong', () => {
        expect(isTotalIgnored({ remote: false, rows: 0, totalRows: 100 })).toBe(
            false
        );
    });

    it('says nothing about a prop nobody set', () => {
        expect(
            isTotalIgnored({ remote: false, rows: 25, totalRows: undefined })
        ).toBe(false);
    });

    // What keeps a correct local consumer quiet: the library's own
    // `table-selectable-rows` example passes `totalRows={persons.length}`.
    it('says nothing about a total that matches the rows', () => {
        expect(isTotalIgnored({ remote: false, rows: 25, totalRows: 25 })).toBe(
            false
        );
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
    // A refusal has several causes and the table cannot tell which one it
    // met, so it reports the numbers and names none of them.
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
