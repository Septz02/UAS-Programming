'use client';
import Card from '../../../../../components/card';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ConfigDialog from '../../../../../components/ConfirmDialog';
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function AdminBlogs() {
    const router = useRouter();
    const [modal, setModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [blogs, setBlogs] = useState([]); // State for storing blogs
    const [isOkOnly, setIsOkOnly] = useState(true);
    const [inputValue, setInputValue] = useState(''); // State for input box

    // Fetch categories data
    const fetchDataCategory = async () => {
        try {
            const res = await fetch('/api/category');
            let responseData = await res.json();
            setCategories(responseData.data);
        } catch (err) {
            console.error('ERR', err.message);
            setModal(true);
            setModalTitle('Error');
            setModalMessage(err.message);
        }
    };

    // Fetch blogs data
    const fetchDataBlogs = async () => {
        try {
            const res = await fetch('/api/blogs'); // Replace with actual API endpoint
            let responseData = await res.json();
            setBlogs(responseData.data);
        } catch (err) {
            console.error('ERR', err.message);
            setModal(true);
            setModalTitle('Error');
            setModalMessage(err.message);
        }
    };

    const stripHtml = (html) => {
        return html.replace(/<\/?[^>]+(>|$)/g, "");
    };

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        setInputValue(searchTerm);

        if (searchTerm.length > 2) {
            try {
                const response = await fetch(`/api/blogs?search=${searchTerm}`);
                const responseData = await response.json();
                setBlogs(responseData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                // setLoading(false);
            }
        } else {
            fetchDataBlogs();
        }
    };

    useEffect(() => {
        fetchDataCategory();
        fetchDataBlogs(); // Fetch blogs when component mounts
    }, []);

    const back = () => {
        router.push('/admin/blogs/');
    };
    return (
        <>
            <button className="ml-5 flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow" onClick={back}>
                <ArrowLeftIcon className="h-5 w-5 text-white" />
                <span>Back</span>
            </button>
            <Card title="Search Blogs" style="mt-5">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search or Add Blogs"
                        value={inputValue}
                        onChange={handleSearch}
                        onKeyUp={handleSearch}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <table className="table-auto w-full">
                    <tbody>
                        <tr>
                            {categories.map((item, key) => (
                                <td key={key} className="p-4">
                                    <div className="bg-red shadow-md rounded-lg p-6 max-w-xs hover:shadow-lg transition-shadow">
                                        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                                        <p className="text-gray-700">{item.name}</p>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </Card>

            <Card title="Blogs List" style="mt-5">
                <div className="mb-4">
                    {blogs.map((blog, key) => (
                        <div key={key}>
                            <h1>{blog.title}</h1>
                            <h5>{stripHtml(blog.content)}</h5>
                            <hr></hr>
                            <br></br>
                            <br></br>
                        </div>
                    ))}
                </div>
            </Card>

            <ConfigDialog
                onOkOny={() => onCancel()}
                showDialog={modal}
                title={modalTitle}
                message={modalMessage}
                onCancel={() => onCancel()}
                onOk={() => onConfirmOk()}
                isOkOnly={isOkOnly}
            />
        </>
    );
}
