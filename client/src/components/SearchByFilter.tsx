import React from 'react'
import { Input } from '@/components/ui/input'

const SearchByFilter = ({ searchKeyword, setSearchKeyword, placeholder }: {
    searchKeyword: string;
    setSearchKeyword: (keyword: string) => void;
    placeholder: string;
}) => {
    return (
        <div className='flex w-full items-center size-8 justify-center mx-auto'>
            <Input
                type="search"
                placeholder={placeholder}
                className="h-10"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
            />
        </div>
    )
}

export default SearchByFilter
