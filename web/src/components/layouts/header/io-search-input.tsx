export default function SearchInput({ className = '' }: { className?: string }) {
    return (
        <input
            type="text"
            placeholder="Search products..."
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        />
    )
}