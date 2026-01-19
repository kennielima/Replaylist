import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const SearchByFilter = ({ searchKeyword, setSearchKeyword, placeholder }: {
    searchKeyword: string;
    setSearchKeyword: (keyword: string) => void;
    placeholder: string;
}) => {
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
    }
    return (
        <form
            onSubmit={() => changeHandler}
            className='flex w-full items-center gap-1 size-8 justify-center mx-auto'
        >
            <Input
                type="search"
                placeholder={placeholder}
                className="h-10"
                value={searchKeyword}
                onChange={changeHandler}
            />
            <Button
                type="submit"
                variant="outline"
                className={`h-10 bg-purple-600 hover:bg-purple-500 text-white cursor-pointer`}
                onClick={(e) => e.preventDefault()}
            >
                Submit
            </Button>
        </form>)
}

export default SearchByFilter