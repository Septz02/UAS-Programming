"use client"
import { useRouter, useParams } from 'next/navigation';
import Card from '../../../../../../components/card';
import { useEffect, useState, useRef } from 'react';
import ConfigDialog from '../../../../../../components/ConfirmDialog'
import { Editor } from '@tinymce/tinymce-react';
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function EditBlogs() {
    const router = useRouter()
    const editorRef = useRef(null);
    const params = useParams()
    const [modal, setModal] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalMessage, setModalMessage] = useState("")
    const [isOkOnly, setIsOkOnly] = useState(true)
    const [data, setData] = useState({
        title: '',
        subTitle: '',
        content: '',
        _id: ''
    });
    const fetDataById = async () => {
        try {
            const res = await fetch(`/api/blogs/${params.id}`);
            let responseData = await res.json()
            setData(responseData.data)
        } catch (err) {
            console.error("ERR", err.message)
            setModal(true)
            setModalTitle('Err')
            setModalMessage(err.message)
        }
    }

    const onCancel = () => {
        setModal(false)
    }
    const onOkOnly = () => {
        setModal(false)
        router.push('/admin/blogs')
    }
    const inputHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const onBackClick = () => {
        router.push('/admin/blogs')
    }
    useEffect(() => {
        fetDataById()
    }, [])

    return (
        <>
            <button className="ml-5 flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow" onClick={onBackClick}>
                <ArrowLeftIcon className="h-5 w-5 text-white" />
                <span>Back</span>
            </button>
            <Card title="Detail Blogs">
                <div className="w-full my-2">
                    <label>Title</label>
                    <input
                        name='title'
                        value={data.title}
                        onChange={inputHandler}
                        readOnly
                        type="text"
                        className="w-full border my-input-text" />
                </div>
                <div className="w-full my-2">
                    <label>Sub Title</label>
                    <input
                        name='subTitle'
                        value={data.subTitle}
                        onChange={inputHandler}
                        readOnly
                        className="w-full border my-input-text" />
                </div>
                <div className="w-full my-2">
                    <label>Sub Title</label>
                    <input
                        name='subTitle'
                        value={data.category}
                        onChange={inputHandler}
                        readOnly
                        className="w-full border my-input-text" />
                </div>
                <Editor
                    id='content'
                    apiKey='hz9os6h0p1826jcqknks4q1fm8yl9khctaa7nmexkf0rnx2e'
                    onInit={(_evt, editor) => editorRef.current = editor}
                    initialValue={data.content}
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
                {/* <button className="btn-primary" onClick={onBackClick}>
                    <span className="relative text-sm font-semibold text-white">
                        Back
                    </span>
                </button> */}
            </Card>
            <ConfigDialog
                onOkOny={() => onOkOnly()}
                showDialog={modal}
                title={modalTitle}
                message={modalMessage}
                onCancel={() => onCancel()}
                onOk={() => onConfirmOk()}
                isOkOnly={isOkOnly} />
        </>
    );
}