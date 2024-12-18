"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'


// const [searchQuery, setSearchQuery] = useState([]);

// Filter data berdasarkan searchQuery
// const filteredData = data.filter((item) =>
//     item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     item.subTitle.toLowerCase().includes(searchQuery.toLowerCase())
// );


const CardItem = ({ title, subTitle }) => {
    return (
        <div className="cursor-pointer hover:drop-shadow-lg drop-shadow-md bg-[#E5E5E5] w-[310px] h-[474px]">
            <div className="flex justify-center">
                <img
                    className="h-[300px]"
                    src="/images/no-image-icon.jpg" />
            </div>
            <div className="p-4 bg-white h-[174px]">
                <div className="text-[18px]">{title}</div>
                <div className="text-[#767676] w-full h-[50px] text-ellipsis overflow-hidden">{subTitle}</div>
                <div className="mt-3 text-[#FFB400]">
                    Learn more
                </div>
            </div>
        </div>
    )
}

const LoadingCard = () => {
    return (
        <div className="w-[310px] h-[474px] border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div className="animate-pulse ">
                <div className=" bg-slate-200 h-[300px]"></div>
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
    )
}

export default function Blogs() {
    const router = useRouter();
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(true)

    const onFetchBlogs = async () => {
        try {
            setLoading(true)
            let res = await fetch('/api/blogs')
            let data = await res.json()
            setData(data.data)
            setLoading(false)
        } catch (err) {
            console.log('err', err)
            setData([])
            setLoading(false)
        }
    }

    useEffect(() => {
        onFetchBlogs()
    }, [])

    return (
        <>
            <h2 className="text-center text-[32px] font-bold w-full">Blog</h2>

            <p className="text-center margin-0 mx-auto w-2/3">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. lorem ipsum
            </p>
            {/* Input Search */}
            {/* <div className="w-full mb-4">
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div> */}
            <div className="grid grid-cols-3 gap-4 mt-10">
                {isLoading && <LoadingCard />}
                {isLoading && <LoadingCard />}
                {isLoading && <LoadingCard />}

                {/* {data.map((item, key) => <div
                    onClick={() => router.push(`/blogs/${item._id}`)}
                    key={key}>
                    <CardItem
                        className="m-5 p-4 "
                        title={item.title}
                        subTitle={item.subTitle}
                    />
                </div>
                )
                } */}

                {/* List of Filtered Items */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.map((item, key) => (
                        <div
                            key={key}
                            onClick={() => router.push(`/blogs/${item._id}`)}
                            className="cursor-pointer"
                        >
                            <CardItem
                                className="m-5 p-4"
                                title={item.title}
                                subTitle={item.subTitle}
                            />
                        </div>
                    ))}
                </div> */}

            </div>
        </>
    );
}