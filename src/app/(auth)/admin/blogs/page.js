'use client'
import Card from '../../../../components/card';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ConfigDialog from '../../../../components/ConfirmDialog';

export default function AdminBlogs() {
    const router = useRouter();
    const [modal, setModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [blogs, setBologs] = useState([]);
    const [isOkOnly, setIsOkOnly] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [inputValue, setInputValue] = useState(''); // State untuk input box

    const onAddNew = () => {
        router.push('/admin/blogs/form');
    };

    const onEditData = (id) => {
        router.push('/admin/blogs/' + id);
    };

    const onDetailData = (id) => {
        router.push('/admin/blogs/' + id + '/detail');
    };

    const onConfirmDelete = (id) => {
        setDeleteId(id);
        setIsOkOnly(false);
        setModalTitle('Confirm');
        setModalMessage('Apakah anda yakin ingin menghapus data ini?');
        setModal(true);
    };

    const onCancel = () => {
        setModal(false);
    };

    const onConfirmOk = async () => {
        try {
            const res = await fetch(`/api/blogs/${deleteId}`, { method: 'DELETE' });
            let responseData = await res.json();

            setIsOkOnly(true);
            setModalTitle('Info');
            setModalMessage(responseData.message);
            setModal(true);
            fetchData();
        } catch (err) {
            console.error('ERR', err.message);
            setModal(true);
            setModalTitle('Err');
            setModalMessage(err.message);
        }
    };

    const fetchData = async () => {
        try {
            const res = await fetch('/api/blogs');
            let responseData = await res.json();
            setBologs(responseData.data);
        } catch (err) {
            console.error('ERR', err.message);
            setModal(true);
            setModalTitle('Err');
            setModalMessage(err.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const [searchQuery, setSearchQuery] = useState('');

    // Filter data berdasarkan query
    const filteredBlogs = blogs.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Card title="List of Blogs" style="mt-5" showAddBtn onAddNew={onAddNew}>

                {/* <button
                    onClick={() => router.push('/admin/blogs/search')}
                    className="bg-red-300 hover:bg-green-400 text-gray-800 py-2 px-4 rounded-l">
                    Search Blog
                </button> */}

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>


                <br></br>
                <br></br>

                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="table-head border-blue-gray-100">No</th>
                            <th className="table-head border-blue-gray-100">Title</th>
                            <th className="table-head border-blue-gray-100">Sub Title</th>
                            <th className="table-head border-blue-gray-100">Category</th>
                            <th className="table-head border-blue-gray-100">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {blogs.map((item, key) => {
                            return (
                                <tr key={key} className="border-b border-blue-gray-50">
                                    <td className="p-2 text-center">{key + 1}.</td>
                                    <td className="p-2" align='center'>{item.title}</td>
                                    <td className="p-2" align='center'>{item.subTitle}</td>
                                    <td className="p-2" align='center'>
                                        <div className="inline-flex text-[12px]">
                                            <button
                                                onClick={() => onDetailData(item._id)}
                                                className="bg-green-300 hover:bg-green-400 text-gray-800 py-2 px-4 rounded-l">
                                                Detail
                                            </button>
                                            <button
                                                onClick={() => onEditData(item._id)}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onConfirmDelete(item._id)}
                                                className="bg-red-300 hover:bg-red-400 text-gray-800 py-2 px-4 rounded-r"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })} */}
                        {filteredBlogs.map((item, key) => {
                            return (
                                <tr key={key} className="border-b border-blue-gray-50">
                                    <td className="p-2 text-center">{key + 1}.</td>
                                    <td className="p-2" align="center">{item.title}</td>
                                    <td className="p-2" align="center">{item.subTitle}</td>
                                    <td className="p-2" align="center">{item.category}</td>
                                    <td className="p-2" align="center">
                                        <div className="inline-flex text-[12px]">
                                            <button
                                                onClick={() => onDetailData(item._id)}
                                                className="bg-green-300 hover:bg-green-400 text-gray-800 py-2 px-4 rounded-l"
                                            >
                                                Detail
                                            </button>
                                            <button
                                                onClick={() => onEditData(item._id)}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onConfirmDelete(item._id)}
                                                className="bg-red-300 hover:bg-red-400 text-gray-800 py-2 px-4 rounded-r"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>

            <ConfigDialog
                onOkOny={() => onCancel()}
                showDialog={modal}
                title={modalTitle}
                message={modalMessage}
                onCancel={() => onCancel()}
                onOk={() => onConfirmOk()}
                isOkOnly={isOkOnly}
                okBtnMessage='Yes'
            />
        </>
    );
}
