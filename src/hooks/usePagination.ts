// Reference: https://github.com/mantinedev/mantine/blob/master/src/mantine-hooks/src/use-pagination/use-pagination.ts

import { useMemo, useState } from 'react';

export const DOTS = 'dots';

const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, index) => index + start);
};

export interface PaginationParams {
    /** Page selected on initial render, defaults to 1 */
    initialPage?: number;

    /** Total amount of pages */
    total: number;

    /** Siblings amount on left/right side of selected page, defaults to 1 */
    siblings?: number;

    /** Amount of elements visible on left/right edges, defaults to 1  */
    boundaries?: number;

    /** Callback fired after change of each page */
    onChange?: (page: number) => void;
}

export const usePagination = ({
    total,
    siblings = 1,
    boundaries = 1,
    initialPage = 1,
    onChange,
}: PaginationParams) => {
    const _total = Math.max(Math.trunc(total), 0);
    const [activePage, setActivePage] = useState(initialPage);

    const setPage = (pageNumber: number) => {
        let pageNumberToSet = pageNumber;

        if (pageNumber <= 0) {
            pageNumberToSet = 1;
        } else if (pageNumber > _total) {
            pageNumberToSet = _total;
        }

        setActivePage(pageNumberToSet);
        onChange?.(pageNumberToSet);
    };

    const next = () => setPage(activePage + 1);
    const previous = () => setPage(activePage - 1);
    const first = () => setPage(1);
    const last = () => setPage(_total);

    const paginationRange = useMemo((): (number | 'dots')[] => {
        const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;
        if (totalPageNumbers >= _total) {
            return range(1, _total);
        }

        const leftSiblingIndex = Math.max(activePage - siblings, boundaries);
        const rightSiblingIndex = Math.min(
            activePage + siblings,
            _total - boundaries
        );

        const shouldShowLeftDots = leftSiblingIndex > boundaries + 2;
        const shouldShowRightDots =
            rightSiblingIndex < _total - (boundaries + 1);

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = siblings * 2 + boundaries + 2;
            return [
                ...range(1, leftItemCount),
                DOTS,
                ...range(_total - (boundaries - 1), _total),
            ];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = boundaries + 1 + 2 * siblings;
            return [
                ...range(1, boundaries),
                DOTS,
                ...range(_total - rightItemCount, _total),
            ];
        }

        return [
            ...range(1, boundaries),
            DOTS,
            ...range(leftSiblingIndex, rightSiblingIndex),
            DOTS,
            ...range(_total - boundaries + 1, _total),
        ];
    }, [siblings, boundaries, _total, activePage]);

    return {
        range: paginationRange,
        active: activePage,
        setPage,
        next,
        previous,
        first,
        last,
    };
};
