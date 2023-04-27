import type { ChangeEvent, FormEvent } from 'react';
import { forwardRef, useRef } from 'react';
import Input from './Input';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { mergeRefs } from 'react-merge-refs';

type SearchInputProps = {
    formRef?: React.RefObject<HTMLFormElement>;
    className?: string;
    placeholder: string;
    onSearch: (searchTerm: string) => void;
    onReset: () => void;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ placeholder, onReset, onSearch, className, formRef }, ref) => {
        const form = useRef<HTMLFormElement>(null);
        const searchInput = useRef<HTMLInputElement>(null);

        const handleSearch = (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const searchTerm = formData.get('searchTerm') as string;

            if (searchTerm) {
                onSearch(searchTerm);
            }
        };

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (!event.target.value) {
                onReset();
            }
        };

        const formRefs = formRef ? [formRef, form] : [form];

        return (
            <form
                className={className}
                ref={mergeRefs(formRefs)}
                onSubmit={handleSearch}
            >
                <Input
                    ref={mergeRefs([ref, searchInput])}
                    name='searchTerm'
                    placeholder={placeholder}
                    onChange={handleChange}
                    endIcon={
                        <button
                            type='submit'
                            className='default-focus flex h-full w-full items-center justify-center rounded'
                        >
                            <MagnifyingGlass className='h-6 w-6 text-inherit' />
                        </button>
                    }
                    endIconClassName='pointer-events-auto cursor-pointer hover:text-zinc-500 transition-colors'
                />
            </form>
        );
    }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
