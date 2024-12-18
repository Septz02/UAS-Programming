"use client";
import { useState, useEffect } from "react";
import Card from "../../../../components/card";
import { useParams } from "next/navigation";
// Komentar
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import ConfigDialog from "../../../../components/ConfirmDialog";
import { useRouter } from "next/router";

export default function Blogsbyid() {
  // Komentar
  const editorRef = useRef(null);
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  // Komentar end
  const params = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  // Komentar
  const [inputComment, setInputComment] = useState({
    nama: "",
    email: "",
    comment: "",
    id_blogs: params.id,
  });
  const [isLoadingComment, setLoadingComment] = useState(false);
  const [dataComment, setDataComment] = useState([]);
  const clearData = () => {
    setInputComment({
      nama: "",
      email: "",
      comment: "",
      id_blogs: params.id,
    });
  };
  const inputHandler = (e) => {
    setInputComment({ ...inputComment, [e.target.name]: e.target.value });
  };
  // End Komentar

  const onFetchBlogs = async () => {
    try {
      setLoading(true);
      let res = await fetch(`/api/blogs/${params.id}`);
      let data = await res.json();
      setData(data.data);
      setLoading(false);
    } catch (err) {
      console.log("err", err);
      setData(null);
      setLoading(false);
    }
  };

  const onFetchComment = async () => {
    try {
      setLoadingComment(true);
      let res = await fetch(`/api/comments/${params.id}`);
      let data = await res.json();
      setDataComment(data.data);
      setLoadingComment(false);
    } catch (err) {
      console.log("err", err);
      setDataComment([]);
      setLoadingComment(false);
    }
  };

  // Komentar
  const onCancel = () => {
    setModal(false);
    setModalTitle("");
    setModalMessage("");
    clearData();
    window.location.reload(); // Refresh halaman
  };
  // end Komentar

  async function onSubmitData() {
    try {
      if (editorRef.current) {
        const body = inputComment;
        body.comment = editorRef.current.getContent();

        let res = await fetch("/api/comments/", {
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

        // Refresh halaman setelah sukses
        // router.reload();
        // router.replace(router.asPath);
        // window.location.reload(); // Refresh halaman
      }
    } catch (err) {
      console.error("ERR", err.message);
      setModal(true);
      setModalTitle("Err");
      setModalMessage(err.message);
    }
  }

  useEffect(() => {
    onFetchBlogs();
    onFetchComment();
  }, []);

  if (isLoading) return <>Loading...</>;

  return (
    <>
      <div className="margin-0 mx-auto w-2/3">
        <h2 className="text-center text-[32px] font-bold w-full">
          {data.title}
        </h2>
        <div
          className="mb-40 mt-10  "
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>

      {/* Start Komentar */}
      <Card title="Tuliskan komentar">
        <div className="w-full my-5">
          <label>Nama</label>
          <input
            name="nama"
            value={inputComment.nama}
            onChange={inputHandler}
            type="text"
            className="w-full border my-input-text"
          />
        </div>

        <div className="w-full my-2">
          <label>Email</label>
          <input
            name="email"
            value={inputComment.email}
            onChange={inputHandler}
            className="w-full border my-input-text"
          />
        </div>

        <div className="w-full my-2">
          <label>Komentar</label>
          <Editor
            id="comment"
            apiKey="bhkgqljsurad9ypfitcpd86hmv0kw90xgstiksir5818qu1c"
            onInit={(_evt, editor) => (editorRef.current = editor)}
            initialValue={inputComment.comment}
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
            Kirim
          </span>
        </button>
      </Card>

      {dataComment.map((comment, idx) => (
        <Card className="mt-5" key={idx} title={comment.nama}>
          <div dangerouslySetInnerHTML={{ __html: comment.comment }} />
        </Card>
      ))}

      <ConfigDialog
        onOkOny={() => onCancel()}
        showDialog={modal}
        title={modalTitle}
        message={modalMessage}
        onCancel={() => onCancel()}
        onOk={() => onCancel()}
        isOkOnly={true}
      />
      {/* End Komentar */}
    </>
  );
}
