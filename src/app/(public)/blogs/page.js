"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CardItem = ({ title, subTitle, category }) => {
    return (
        <div className="cursor-pointer hover:drop-shadow-lg drop-shadow-md bg-[#E5E5E5] w-[310px] h-[474px]">
            <div className="flex justify-center">
                <img
                    className="h-[300px]"
                    src="/images/no-image-icon.jpg"
                    alt="Blog Thumbnail"
                />
            </div>
            <div className="p-4 bg-white h-[174px]">
                <div className="text-[18px]">{title}</div>
                <div className="text-[#767676] w-full h-[50px] text-ellipsis overflow-hidden">
                    {subTitle}
                </div>
                {/* <div className="mt-3 text-[#FFB400]">Learn more</div>
                <div className="text-[#767676] text-sm">{category}</div> */}
                <div className="flex mt-3 justify-between items-center">
        <div className="text-[#FFB400]">Learn more</div>
        <div className="text-[#767676] text-sm bg-gray-200 px-3 py-1 rounded-full shadow-sm">{category}</div>
    </div>
            </div>
        </div>
    );
};

const LoadingCard = () => {
    return (
        <div className="w-[310px] h-[474px] border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div className="animate-pulse">
                <div className="bg-slate-200 h-[300px]"></div>
                <div className="flex-1 space-y-6 py-1">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-3 bg-slate-200 rounded col-span-2"></div>
                            <div className="h-3 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-3 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-3 bg-slate-200 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default function Blogs() {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setLoading] = useState(true);

    const onFetchBlogs = async () => {
        try {
            setLoading(true);
            let res = await fetch("/api/blogs");
            let data = await res.json();
            setData(data.data);
            setFilteredData(data.data); // Set filtered data sama dengan data awal
            setLoading(false);
        } catch (err) {
            console.log("err", err);
            setData([]);
            setFilteredData([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        onFetchBlogs();
    }, []);

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category); // Set selected category
        const filtered = data.filter((item) =>
            category ? item.category === category : true
        );
        setFilteredData(filtered);
    };

    // Filter data berdasarkan searchQuery
    // useEffect(() => {
    //     const lowercasedQuery = searchQuery.toLowerCase();
    //     const filtered = data.filter(
    //         (item) =>
    //             item.title.toLowerCase().includes(lowercasedQuery) ||
    //             item.subTitle.toLowerCase().includes(lowercasedQuery)
    //     );
    //     setFilteredData(filtered);
    // }, [searchQuery, data]);
    // Filter data berdasarkan searchQuery dan kategori
    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = data.filter((item) => {
            const isSearchMatch =
                item.title.toLowerCase().includes(lowercasedQuery) ||
                item.subTitle.toLowerCase().includes(lowercasedQuery);
            const isCategoryMatch =
                selectedCategory ? item.category === selectedCategory : true; // Filter by category if selected
            return isSearchMatch && isCategoryMatch;
        });
        setFilteredData(filtered);
    }, [searchQuery, selectedCategory, data]);

    return (
        <>
            <h2 className="text-center text-[32px] font-bold w-full">Blog</h2>

            <p className="text-center margin-0 mx-auto w-2/3">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint. Velit officia consequat duis enim velit mollit. lorem
                ipsum
            </p>

            {/* Input Search */}
            <div className="w-full my-4">
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            {/* Buttons for Category Filter */}
            <div className="w-full my-4">
                <div className="flex space-x-4">
                    <button
                        onClick={() => handleCategoryFilter("")}
                        className={`p-2 ${!selectedCategory ? "bg-indigo-600 text-white" : "bg-gray-300"}`}
                    >
                        All Categories
                    </button>
                    <button
                        onClick={() => handleCategoryFilter("reactjs")}
                        className={`p-2 ${selectedCategory === "reactjs" ? "bg-indigo-600 text-white" : "bg-gray-300"}`}
                    >
                        ReactJs
                    </button>
                    <button
                        onClick={() => handleCategoryFilter("php-programming")}
                        className={`p-2 ${selectedCategory === "php-programming" ? "bg-indigo-600 text-white" : "bg-gray-300"}`}
                    >
                        PHP Programming
                    </button>
                    <button
                        onClick={() => handleCategoryFilter("vuejs")}
                        className={`p-2 ${selectedCategory === "vuejs" ? "bg-indigo-600 text-white" : "bg-gray-300"}`}
                    >
                        VueJs
                    </button>
                    <button
                        onClick={() => handleCategoryFilter("react-native")}
                        className={`p-2 ${selectedCategory === "react-native" ? "bg-indigo-600 text-white" : "bg-gray-300"}`}
                    >
                        React Native
                    </button>
                    {/* Add other category buttons as needed */}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                {isLoading && <LoadingCard />}
                {isLoading && <LoadingCard />}
                {isLoading && <LoadingCard />}

                {/* List of Filtered Items */}
                {!isLoading &&
                    filteredData.map((item, key) => (
                        <div
                            key={key}
                            onClick={() => router.push(`/blogs/${item._id}`)}
                            className="cursor-pointer"
                        >
                            <CardItem
                                className="m-5 p-4"
                                title={item.title}
                                subTitle={item.subTitle}
                                category={item.category}
                            />
                        </div>
                    ))}

                {/* Jika tidak ada hasil */}
                {!isLoading && filteredData.length === 0 && (
                    <p className="text-center text-gray-500">No blogs found.</p>
                )}
            </div>
        </>
    );
}
