"use client";
import Card from "../../../../../components/card";
import ConfigDialog from "../../../../../components/ConfirmDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function AdminBlogsForm() {
  const router = useRouter();
  const editorRef = useRef(null);
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [data, setData] = useState({
    title: "",
    subTitle: "",
    content: "",
    category: "",
  });

  const optCategory = [
    { label: "ReactJs", value: "reactjs" },
    { label: "PHP Programming", value: "php-programming" },
    { label: "VueJs", value: "vuejs" },
    { label: "React Native", value: "react-native" },
  ];

  const clearData = () => {
    setData({
      title: "",
      subTitle: "",
      content: "",
    });
  };

  const inputHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onCancel = () => {
    setModal(false);
    setModalTitle("");
    setModalMessage("");
    clearData();
  };

  async function onSubmitData() {
    try {
      if (editorRef.current) {
        const body = data;
        body.content = editorRef.current.getContent();

        let res = await fetch("/api/blogs", {
          method: "POST",
          body: JSON.stringify(body),
        });

        let resData = await res.json();
        if (!resData.data) {
          throw Error(resData.message);
        }
        setModal(true);
        setModalTitle("Info");
        setModalMessage(resData.message);
        router.push("/admin/blogs");
      }
    } catch (err) {
      console.error("ERR", err.message);
      setModal(true);
      setModalTitle("Err");
      setModalMessage(err.message);
    }
  }

  const onBackClick = () => {
    router.push("/admin/blogs");
  };

  return (
    <>
      <button
        className="ml-5 flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
        onClick={onBackClick}
      >
        <ArrowLeftIcon className="h-5 w-5 text-white" />
        <span>Back</span>
      </button>
      <Card title="Blogs Form">
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
          <label>Employe Type</label>
          {/* <select
                        name='employeType'
                        onChange={inputHandler}
                        className="w-full border my-input-text">
                        {
                            optCategory &&
                            optCategory.map((item, key) =>
                                <option key={key} value={item.value}>{item.label}</option>
                            )
                        }
                    </select> */}
          <select
            name="category"
            value={data.category}
            onChange={inputHandler}
            className="w-full border my-input-text p-2 rounded"
          >
            <option value="" disabled>
              Select Category Blog
            </option>
            {optCategory.map((item, key) => (
              <option key={key} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full my-2">
          <label>Content</label>
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
        </div>

        <button className="btn-primary" onClick={onSubmitData}>
          <span className="relative text-sm font-semibold text-white">
            Save Data
          </span>
        </button>
      </Card>

      <ConfigDialog
        onOkOny={() => onCancel()}
        showDialog={modal}
        title={modalTitle}
        message={modalMessage}
        onCancel={() => onCancel()}
        onOk={() => onCancel()}
        isOkOnly={true}
      />
    </>
  );
}
