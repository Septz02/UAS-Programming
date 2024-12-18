"use client";
import { useRouter, useParams } from "next/navigation";
import Card from "../../../../../components/card";
import { useEffect, useState, useRef } from "react";
import ConfigDialog from "../../../../../components/ConfirmDialog";
import { Editor } from "@tinymce/tinymce-react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function EditBlogs() {
  const router = useRouter();
  const editorRef = useRef(null);
  const params = useParams();
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isOkOnly, setIsOkOnly] = useState(true);
  const [data, setData] = useState({
    title: "",
    subTitle: "",
    content: "",
    category: "",
    _id: "",
  });
  const fetDataById = async () => {
    try {
      const res = await fetch(`/api/blogs/${params.id}`);
      let responseData = await res.json();
      setData(responseData.data);
    } catch (err) {
      console.error("ERR", err.message);
      setModal(true);
      setModalTitle("Err");
      setModalMessage(err.message);
    }
  };
  const onCancel = () => {
    setModal(false);
  };
  const onOkOnly = () => {
    setModal(false);
    router.push("/admin/blogs");
  };
  const inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const onSubmitData = async () => {
    try {
      if (editorRef.current) {
        const body = data;
        body.content = editorRef.current.getContent();
        let res = await fetch(`/api/blogs/${data._id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        let resData = await res.json();
        if (!resData.data) {
          throw Error(resData.message);
        }
        setModal(true);
        setModalTitle("Info");
        setModalMessage(resData.message);
      }
    } catch (err) {
      console.error("ERR", err.message);
      setModal(true);
      setModalTitle("Err");
      setModalMessage(err.message);
    }
  };
  useEffect(() => {
    fetDataById();
  }, []);

  const onBackClick = () => {
    router.push("/admin/blogs");
  };

  const optCategory = [
    { label: "ReactJs", value: "reactjs" },
    { label: "PHP Programming", value: "php-programming" },
    { label: "VueJs", value: "vuejs" },
    { label: "React Native", value: "react-native" },
  ];

  return (
    <>
      <button
        className="ml-5 flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
        onClick={onBackClick}
      >
        <ArrowLeftIcon className="h-5 w-5 text-white" />
        <span>Back</span>
      </button>
      <Card title="Blogs Edit Form">
        <div className="w-full my-2">
          <label>Title</label>
          <input
            name="title"
            value={data.title}
            onChange={inputHandler}
            type="text"
            className="w-full border my-input-text"
          />
        </div>
        <div className="w-full my-2">
          <label>Sub Title</label>
          <input
            name="subTitle"
            value={data.subTitle}
            onChange={inputHandler}
            className="w-full border my-input-text"
          />
        </div>
        <div className="w-full my-2">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={data.category}
            onChange={inputHandler}
            className="w-full border my-input-text p-2 rounded"
          >
            <option value="" disabled>
              Select Category Blogs
            </option>
            {optCategory.map((item, key) => (
              <option key={key} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <Editor
          id="content"
          apiKey="bhkgqljsurad9ypfitcpd86hmv0kw90xgstiksir5818qu1c"
          onInit={(_evt, editor) => (editorRef.current = editor)}
          initialValue={data.content}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
        <button className="btn-primary" onClick={onSubmitData}>
          <span className="relative text-sm font-semibold text-white">
            Save Data
          </span>
        </button>
      </Card>
      <ConfigDialog
        onOkOny={() => onOkOnly()}
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
